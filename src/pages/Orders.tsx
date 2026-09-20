import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  X,
  Edit,
  Trash2,
  Plus,
  CreditCard,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

/* =========================================================
   TYPES
========================================================= */

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  payment: string;
  firebaseId?: string;
}

/* =========================================================
   INITIAL DEMO ORDERS
========================================================= */

const initialOrders: Order[] = [
  {
    id: "#1001",
    customer: "John Smith",
    product: "Gaming Laptop",
    amount: "$1,299",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "#1002",
    customer: "Emily Johnson",
    product: "Wireless Headphones",
    amount: "$249",
    status: "Pending",
    payment: "Pending",
  },
  {
    id: "#1003",
    customer: "Michael Brown",
    product: "Gaming Mouse",
    amount: "$89",
    status: "Shipped",
    payment: "Paid",
  },
  {
    id: "#1004",
    customer: "Sophia Wilson",
    product: "Mechanical Keyboard",
    amount: "$159",
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "#1005",
    customer: "David Miller",
    product: "Smart Watch",
    amount: "$399",
    status: "Completed",
    payment: "Paid",
  },
];

/* =========================================================
   EMPTY ORDER
========================================================= */

const emptyOrder: Order = {
  id: "",
  customer: "",
  product: "",
  amount: "",
  status: "Pending",
  payment: "Pending",
};

/* =========================================================
   COMPONENT
========================================================= */

const Orders = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    null
  );

  const [editingOrder, setEditingOrder] = useState<Order | null>(
    null
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const [newOrder, setNewOrder] = useState<Order>({
    ...emptyOrder,
  });

  const [formData, setFormData] = useState<Order>({
    ...emptyOrder,
  });

  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [orderToDelete, setOrderToDelete] =
    useState<Order | null>(null);

  const [deletingOrderId, setDeletingOrderId] = useState<
    string | null
  >(null);

  /* =======================================================
     GET NUMERIC ORDER NUMBER
  ======================================================= */

  const getNumericOrderNumber = (id: string) => {
    const number = Number(id.replace(/\D/g, ""));

    return Number.isFinite(number) ? number : 0;
  };

  /* =======================================================
     GET NEXT AVAILABLE ORDER ID
  ======================================================= */

  const getNextOrderNumberFromOrders = (
    currentOrders: Order[]
  ) => {
    const numbers = currentOrders
      .map((order) => getNumericOrderNumber(order.id))
      .filter((number) => number > 0);

    const maxNumber =
      numbers.length > 0 ? Math.max(...numbers) : 1000;

    return `#${maxNumber + 1}`;
  };

  /* =======================================================
     LOAD ORDERS FROM FIREBASE
     
     IMPORTANT:
     This also repairs missing/duplicate Order IDs.
  ======================================================= */

  const loadOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const ordersRef = collection(db, "orders");

      const snapshot = await getDocs(ordersRef);

      /* -----------------------------------------------------
         SEED DEMO DATA IF COLLECTION IS EMPTY
      ----------------------------------------------------- */

      if (snapshot.empty) {
        const seededOrders: Order[] = [];

        for (const order of initialOrders) {
          const { firebaseId, ...orderData } = order;

          const docRef = await addDoc(ordersRef, orderData);

          seededOrders.push({
            ...order,
            firebaseId: docRef.id,
          });
        }

        setOrders(seededOrders);

        return;
      }

      /* -----------------------------------------------------
         READ FIREBASE ORDERS
      ----------------------------------------------------- */

      const firebaseOrders: Order[] = [];

      snapshot.docs.forEach((orderDoc) => {
        const data = orderDoc.data();

        firebaseOrders.push({
          id: typeof data.id === "string" ? data.id : "",
          customer:
            typeof data.customer === "string"
              ? data.customer
              : "",
          product:
            typeof data.product === "string"
              ? data.product
              : "",
          amount:
            typeof data.amount === "string"
              ? data.amount
              : "",
          status:
            typeof data.status === "string"
              ? data.status
              : "Pending",
          payment:
            typeof data.payment === "string"
              ? data.payment
              : "Pending",
          firebaseId: orderDoc.id,
        });
      });

      /* -----------------------------------------------------
         REPAIR MISSING / DUPLICATE ORDER IDs
      ----------------------------------------------------- */

      const usedIds = new Set<number>();

      /*
       * First collect valid unique IDs.
       */
      firebaseOrders.forEach((order) => {
        const number = getNumericOrderNumber(order.id);

        if (number > 0 && !usedIds.has(number)) {
          usedIds.add(number);
        }
      });

      let nextNumber =
        usedIds.size > 0
          ? Math.max(...Array.from(usedIds))
          : 1000;

      /*
       * Repair orders that have:
       * - no ID
       * - invalid ID
       * - duplicate ID
       */
      const repairedOrders: Order[] = [];

      const idsAlreadyProcessed = new Set<number>();

      for (const order of firebaseOrders) {
        const currentNumber = getNumericOrderNumber(order.id);

        const isValidUniqueId =
          currentNumber > 0 &&
          !idsAlreadyProcessed.has(currentNumber);

        if (isValidUniqueId) {
          idsAlreadyProcessed.add(currentNumber);

          repairedOrders.push(order);

          continue;
        }

        /*
         * Generate a new unique ID.
         */
        do {
          nextNumber += 1;
        } while (usedIds.has(nextNumber));

        usedIds.add(nextNumber);
        idsAlreadyProcessed.add(nextNumber);

        const repairedId = `#${nextNumber}`;

        /*
         * Save repaired ID back to Firebase.
         */
        if (order.firebaseId) {
          try {
            await updateDoc(
              doc(db, "orders", order.firebaseId),
              {
                id: repairedId,
              }
            );
          } catch (repairError) {
            console.error(
              "Failed to repair order ID:",
              repairError
            );
          }
        }

        repairedOrders.push({
          ...order,
          id: repairedId,
        });
      }

      /* -----------------------------------------------------
         SORT NEWEST ORDER FIRST
      ----------------------------------------------------- */

      repairedOrders.sort((a, b) => {
        return (
          getNumericOrderNumber(b.id) -
          getNumericOrderNumber(a.id)
        );
      });

      setOrders(repairedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);

      toast.error("Failed to load orders from Firebase!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadOrders(true);
  }, []);

  /* =======================================================
     ESCAPE KEY + BODY SCROLL
  ======================================================= */

  useEffect(() => {
    const modalOpen =
      showAddModal ||
      !!editingOrder ||
      !!selectedOrder ||
      showDeleteModal;

    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (saving || deletingOrderId) return;

      if (showDeleteModal) {
        closeDeleteModal();
        return;
      }

      if (editingOrder) {
        closeEditModal();
        return;
      }

      if (showAddModal) {
        closeAddModal();
        return;
      }

      if (selectedOrder) {
        setSelectedOrder(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [
    showAddModal,
    editingOrder,
    selectedOrder,
    showDeleteModal,
    saving,
    deletingOrderId,
  ]);

  /* =======================================================
     FILTERED ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.product.toLowerCase().includes(searchValue) ||
        order.amount.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,

      shipped: orders.filter(
        (order) => order.status === "Shipped"
      ).length,

      completed: orders.filter(
        (order) => order.status === "Completed"
      ).length,

      cancelled: orders.filter(
        (order) => order.status === "Cancelled"
      ).length,
    };
  }, [orders]);

  /* =======================================================
     STATUS STYLE
  ======================================================= */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400";

      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:text-yellow-400";

      case "Shipped":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400";

      case "Cancelled":
        return "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400";

      default:
        return "bg-gray-500/10 text-gray-600 border border-gray-500/20 dark:text-gray-400";
    }
  };

  /* =======================================================
     PAYMENT STYLE
  ======================================================= */

  const getPaymentStyle = (payment: string) => {
    switch (payment) {
      case "Paid":
        return "text-green-600 dark:text-green-400";

      case "Pending":
        return "text-yellow-600 dark:text-yellow-400";

      case "Refunded":
        return "text-red-600 dark:text-red-400";

      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  /* =======================================================
     STATUS ICON
  ======================================================= */

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={15} />;

      case "Pending":
        return <Clock size={15} />;

      case "Shipped":
        return <Truck size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  /* =======================================================
     VALIDATE AMOUNT
  ======================================================= */

  const isValidAmount = (value: string) => {
    const cleanedValue = value.replace(/[^0-9.]/g, "");

    if (!cleanedValue) {
      return false;
    }

    const numericValue = Number(cleanedValue);

    return Number.isFinite(numericValue) && numericValue > 0;
  };

  /* =======================================================
     VALIDATE ORDER
  ======================================================= */

  const validateOrder = (order: Order) => {
    const customer = order.customer.trim();
    const product = order.product.trim();
    const amount = order.amount.trim();

    if (!customer) {
      toast.error("Please enter customer name!");
      return false;
    }

    if (customer.length > 100) {
      toast.error("Customer name is too long!");
      return false;
    }

    if (!product) {
      toast.error("Please enter product name!");
      return false;
    }

    if (product.length > 100) {
      toast.error("Product name is too long!");
      return false;
    }

    if (!amount) {
      toast.error("Please enter order amount!");
      return false;
    }

    if (!isValidAmount(amount)) {
      toast.error("Please enter a valid amount!");
      return false;
    }

    return true;
  };

  /* =======================================================
     ADD ORDER
  ======================================================= */

  const handleAddOrder = async () => {
    if (saving) return;

    const orderToAdd: Order = {
      ...newOrder,
      id: getNextOrderNumberFromOrders(orders),
      customer: newOrder.customer.trim(),
      product: newOrder.product.trim(),
      amount: newOrder.amount.trim(),
      status: newOrder.status,
      payment: newOrder.payment,
    };

    if (!validateOrder(orderToAdd)) {
      return;
    }

    try {
      setSaving(true);

      const { firebaseId, ...orderData } = orderToAdd;

      const docRef = await addDoc(
        collection(db, "orders"),
        orderData
      );

      const savedOrder: Order = {
        ...orderToAdd,
        firebaseId: docRef.id,
      };

      setOrders((previousOrders) =>
        [savedOrder, ...previousOrders].sort(
          (a, b) =>
            getNumericOrderNumber(b.id) -
            getNumericOrderNumber(a.id)
        )
      );

      setNewOrder({
        ...emptyOrder,
      });

      setShowAddModal(false);

      toast.success("Order Added Successfully!");
    } catch (error) {
      console.error("Error adding order:", error);

      toast.error("Failed to add order!");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const handleEdit = (order: Order) => {
    setEditingOrder(order);

    setFormData({
      ...order,
    });

    setSelectedOrder(null);
  };

  /* =======================================================
     SAVE EDIT
  ======================================================= */

  const saveEdit = async () => {
    if (saving) return;

    if (!editingOrder?.firebaseId) {
      toast.error(
        "This order is not connected to Firebase!"
      );
      return;
    }

    const updatedOrder: Order = {
      ...formData,
      id: editingOrder.id,
      firebaseId: editingOrder.firebaseId,
      customer: formData.customer.trim(),
      product: formData.product.trim(),
      amount: formData.amount.trim(),
    };

    if (!validateOrder(updatedOrder)) {
      return;
    }

    try {
      setSaving(true);

      const orderRef = doc(
        db,
        "orders",
        editingOrder.firebaseId
      );

      await updateDoc(orderRef, {
        id: updatedOrder.id,
        customer: updatedOrder.customer,
        product: updatedOrder.product,
        amount: updatedOrder.amount,
        status: updatedOrder.status,
        payment: updatedOrder.payment,
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.firebaseId === editingOrder.firebaseId
            ? updatedOrder
            : order
        )
      );

      setSelectedOrder(null);
      setEditingOrder(null);

      setFormData({
        ...emptyOrder,
      });

      toast.success("Order Updated Successfully!");
    } catch (error) {
      console.error("Error updating order:", error);

      toast.error("Failed to update order!");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     OPEN DELETE MODAL
  ======================================================= */

  const handleDelete = (order: Order) => {
    if (deletingOrderId) return;

    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  /* =======================================================
     CONFIRM DELETE
  ======================================================= */

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    if (!orderToDelete.firebaseId) {
      toast.error(
        "This order is not connected to Firebase!"
      );
      return;
    }

    try {
      setDeletingOrderId(orderToDelete.firebaseId);

      await deleteDoc(
        doc(db, "orders", orderToDelete.firebaseId)
      );

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) =>
            order.firebaseId !==
            orderToDelete.firebaseId
        )
      );

      if (
        selectedOrder?.firebaseId ===
        orderToDelete.firebaseId
      ) {
        setSelectedOrder(null);
      }

      if (
        editingOrder?.firebaseId ===
        orderToDelete.firebaseId
      ) {
        setEditingOrder(null);
      }

      setShowDeleteModal(false);
      setOrderToDelete(null);

      toast.success("Order Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);

      toast.error("Failed to delete order!");
    } finally {
      setDeletingOrderId(null);
    }
  };

  /* =======================================================
     CLOSE ADD MODAL
  ======================================================= */

  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);

    setNewOrder({
      ...emptyOrder,
    });
  };

  /* =======================================================
     CLOSE EDIT MODAL
  ======================================================= */

  const closeEditModal = () => {
    if (saving) return;

    setEditingOrder(null);

    setFormData({
      ...emptyOrder,
    });
  };

  /* =======================================================
     CLOSE DELETE MODAL
  ======================================================= */

  const closeDeleteModal = () => {
    if (deletingOrderId) return;

    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  /* =======================================================
     INPUT CLASSES
  ======================================================= */

  const inputClass =
    "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={40}
              className="animate-spin text-blue-500"
            />

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 text-slate-900 dark:text-white sm:p-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and track your customer orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              type="button"
              onClick={() => loadOrders(false)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-200 dark:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            {/* Add Order */}
            <button
              type="button"
              onClick={() => {
                setNewOrder({
                  ...emptyOrder,
                  id: getNextOrderNumberFromOrders(
                    orders
                  ),
                });

                setShowAddModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.98]"
            >
              <Plus size={18} />
              Add Order
            </button>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Package size={20} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
                <Clock size={20} />
              </div>
            </div>
          </div>

          {/* Shipped */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Shipped
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.shipped}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Truck size={20} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.completed}
                </p>
              </div>

              <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Cancelled
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.cancelled}
                </p>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <XCircle size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search orders, customers, products..."
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className={inputClass}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {orders.length}
            </span>{" "}
            orders
          </p>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-black/20 md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-50 dark:bg-slate-950/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.firebaseId || order.id}
                    className="border-b border-slate-200/80 dark:border-slate-200 dark:border-slate-800/80 transition hover:bg-slate-200 dark:bg-slate-800/40 last:border-b-0"
                  >
                    {/* Order */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {order.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {order.customer}
                      </p>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <p className="max-w-[220px] truncate text-sm text-slate-500 dark:text-slate-400">
                        {order.product}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <div
                        className={`flex items-center gap-2 text-sm font-semibold ${getPaymentStyle(
                          order.payment
                        )}`}
                      >
                        <CreditCard size={16} />
                        {order.payment}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                          title="View order"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(order)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-500/10 hover:text-yellow-400"
                          title="Edit order"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(order)
                          }
                          disabled={
                            deletingOrderId ===
                            order.firebaseId
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete order"
                        >
                          {deletingOrderId ===
                          order.firebaseId ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="space-y-4 md:hidden">
          {filteredOrders.map((order) => (
            <div
              key={order.firebaseId || order.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg shadow-black/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {order.id}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {order.customer}
                  </p>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              {/* Product */}
              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-50 dark:bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">
                  Product
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {order.product}
                </p>
              </div>

              {/* Amount / Payment */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {order.amount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Payment
                  </p>

                  <p
                    className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${getPaymentStyle(
                      order.payment
                    )}`}
                  >
                    <CreditCard size={15} />
                    {order.payment}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(order)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800"
                >
                  <Eye size={16} />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(order)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(order)}
                  disabled={
                    deletingOrderId ===
                    order.firebaseId
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingOrderId ===
                  order.firebaseId ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <Package size={26} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No orders found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {search || statusFilter !== "All"
                ? "Try changing your search or filter."
                : "There are no orders available yet."}
            </p>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-blue-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          VIEW ORDER MODAL
      ===================================================== */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Order Details
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {selectedOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-200 dark:bg-slate-800 hover:text-slate-900 dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Customer
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.customer}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Product
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.product}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Amount
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.amount}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Payment
                  </p>

                  <p
                    className={`mt-1 font-semibold ${getPaymentStyle(
                      selectedOrder.payment
                    )}`}
                  >
                    {selectedOrder.payment}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-50 dark:bg-slate-950/60 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Order Status
                </p>

                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusIcon(
                    selectedOrder.status
                  )}
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 dark:border-slate-800 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  handleEdit(selectedOrder)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-blue-500"
              >
                <Edit size={16} />
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD ORDER MODAL
      ===================================================== */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeAddModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add New Order
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Create a new customer order
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-200 dark:bg-slate-800 hover:text-slate-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-5">
              {/* Order ID */}
              <div>
                <label className={labelClass}>
                  Order ID
                </label>

                <input
                  type="text"
                  value={
                    newOrder.id ||
                    getNextOrderNumberFromOrders(
                      orders
                    )
                  }
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-50 dark:bg-slate-950`}
                />
              </div>

              {/* Customer */}
              <div>
                <label className={labelClass}>
                  Customer Name
                </label>

                <input
                  type="text"
                  value={newOrder.customer}
                  maxLength={100}
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      customer:
                        event.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {/* Product */}
              <div>
                <label className={labelClass}>
                  Product
                </label>

                <input
                  type="text"
                  value={newOrder.product}
                  maxLength={100}
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      product:
                        event.target.value,
                    })
                  }
                  placeholder="Enter product name"
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {/* Amount */}
              <div>
                <label className={labelClass}>
                  Amount
                </label>

                <input
                  type="text"
                  value={newOrder.amount}
                  maxLength={30}
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      amount:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. $1,299"
                  className={inputClass}
                  disabled={saving}
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Example: $1,299 or 1299
                </p>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>
                  Order Status
                </label>

                <select
                  value={newOrder.status}
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      status:
                        event.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={saving}
                >
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Shipped">
                    Shipped
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Payment */}
              <div>
                <label className={labelClass}>
                  Payment Status
                </label>

                <select
                  value={newOrder.payment}
                  onChange={(event) =>
                    setNewOrder({
                      ...newOrder,
                      payment:
                        event.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={saving}
                >
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Paid">
                    Paid
                  </option>
                  <option value="Refunded">
                    Refunded
                  </option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 dark:border-slate-800 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={saving}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddOrder}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT ORDER MODAL
      ===================================================== */}

      {editingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeEditModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Order
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Update {editingOrder.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-200 dark:bg-slate-800 hover:text-slate-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-5">
              {/* Order ID */}
              <div>
                <label className={labelClass}>
                  Order ID
                </label>

                <input
                  type="text"
                  value={formData.id}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-slate-50 dark:bg-slate-950`}
                />
              </div>

              {/* Customer */}
              <div>
                <label className={labelClass}>
                  Customer Name
                </label>

                <input
                  type="text"
                  value={formData.customer}
                  maxLength={100}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      customer:
                        event.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {/* Product */}
              <div>
                <label className={labelClass}>
                  Product
                </label>

                <input
                  type="text"
                  value={formData.product}
                  maxLength={100}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      product:
                        event.target.value,
                    })
                  }
                  placeholder="Enter product name"
                  className={inputClass}
                  disabled={saving}
                />
              </div>

              {/* Amount */}
              <div>
                <label className={labelClass}>
                  Amount
                </label>

                <input
                  type="text"
                  value={formData.amount}
                  maxLength={30}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      amount:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. $1,299"
                  className={inputClass}
                  disabled={saving}
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Example: $1,299 or 1299
                </p>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>
                  Order Status
                </label>

                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      status:
                        event.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={saving}
                >
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Shipped">
                    Shipped
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Payment */}
              <div>
                <label className={labelClass}>
                  Payment Status
                </label>

                <select
                  value={formData.payment}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      payment:
                        event.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={saving}
                >
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Paid">
                    Paid
                  </option>
                  <option value="Refunded">
                    Refunded
                  </option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 dark:border-slate-800 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {showDeleteModal && orderToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingOrderId
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Content */}
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <AlertCircle size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Order?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {orderToDelete.id}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-50 dark:bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {orderToDelete.customer}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {orderToDelete.product}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900 dark:text-white">
                    {orderToDelete.amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-50 dark:bg-slate-950/40 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!deletingOrderId}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingOrderId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingOrderId ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;