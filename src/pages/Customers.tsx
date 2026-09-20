import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Star,
  Trash2,
  Users,
  Crown,
  UserPlus,
  UserCheck,
  Eye,
  X,
  Filter,
  Pencil,
  Save,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

import toast from "react-hot-toast";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  status: "Premium" | "Regular" | "New";
  image: string;
  firebaseId?: string;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  orders: "0",
  spent: "",
  status: "New" as Customer["status"],
  image: "",
};

const DEFAULT_IMAGE =
  "https://randomuser.me/api/portraits/lego/1.jpg";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [showCustomerModal, setShowCustomerModal] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [deleteCustomer, setDeleteCustomer] =
    useState<Customer | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  const loadCustomers = async (showToast = false) => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "customers")
      );

      const firebaseCustomers: Customer[] =
        snapshot.docs.map((customerDoc, index) => {
          const data = customerDoc.data();

          return {
            id:
              typeof data.id === "number"
                ? data.id
                : index + 1,

            name:
              typeof data.name === "string"
                ? data.name
                : "",

            email:
              typeof data.email === "string"
                ? data.email
                : "",

            phone:
              typeof data.phone === "string"
                ? data.phone
                : "",

            orders:
              typeof data.orders === "number"
                ? data.orders
                : Number(data.orders) || 0,

            spent:
              typeof data.spent === "string"
                ? data.spent
                : "",

            status:
              data.status === "Premium" ||
              data.status === "Regular" ||
              data.status === "New"
                ? data.status
                : "New",

            image:
              typeof data.image === "string" &&
              data.image.trim()
                ? data.image
                : DEFAULT_IMAGE,

            firebaseId: customerDoc.id,
          };
        });

      setCustomers(firebaseCustomers);

      if (showToast) {
        toast.success("Customers refreshed");
      }
    } catch (error) {
      console.error(
        "Error loading customers:",
        error
      );

      toast.error(
        "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================================================
  // ESCAPE + BODY SCROLL
  // =========================================================

  useEffect(() => {
    const handleEscape = (
      event: globalThis.KeyboardEvent
    ) => {
      if (event.key !== "Escape") return;

      setSelectedCustomer(null);
      setShowCustomerModal(false);
      setDeleteCustomer(null);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    if (
      showCustomerModal ||
      selectedCustomer ||
      deleteCustomer
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [
    showCustomerModal,
    selectedCustomer,
    deleteCustomer,
  ]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredCustomers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !searchValue ||
        customer.name
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue) ||
        customer.phone
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    search,
    statusFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalCustomers =
    customers.length;

  const premiumCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Premium"
    ).length;

  const regularCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Regular"
    ).length;

  const newCustomers =
    customers.filter(
      (customer) =>
        customer.status === "New"
    ).length;

  const totalOrders =
    customers.reduce(
      (total, customer) =>
        total + customer.orders,
      0
    );

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (status) {
      case "Premium":
        return "border border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400";

      case "Regular":
        return "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";

      case "New":
        return "border border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400";

      default:
        return "border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({ ...emptyForm });
    setShowCustomerModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditCustomer = (
    customer: Customer
  ) => {
    setSelectedCustomer(null);

    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      orders: String(customer.orders),
      spent: customer.spent,
      status: customer.status,
      image: customer.image,
    });

    setShowCustomerModal(true);
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATE
  // =========================================================

  const validateForm = () => {
    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const spent =
      formData.spent.trim();

    const orders =
      Number(formData.orders);

    if (!name) {
      toast.error(
        "Customer name is required"
      );
      return false;
    }

    if (!email) {
      toast.error(
        "Email address is required"
      );
      return false;
    }

    if (!email.includes("@")) {
      toast.error(
        "Enter a valid email address"
      );
      return false;
    }

    if (!phone) {
      toast.error(
        "Phone number is required"
      );
      return false;
    }

    if (!spent) {
      toast.error(
        "Total spent is required"
      );
      return false;
    }

    if (
      Number.isNaN(orders) ||
      orders < 0 ||
      !Number.isInteger(orders)
    ) {
      toast.error(
        "Orders must be a valid whole number"
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSaveCustomer =
    async () => {
      if (saving) return;

      if (!validateForm()) return;

      const name =
        formData.name.trim();

      const email =
        formData.email.trim();

      const phone =
        formData.phone.trim();

      const spent =
        formData.spent.trim();

      const image =
        formData.image.trim();

      const orders =
        Number(formData.orders);

      try {
        setSaving(true);

        // ===================================================
        // EDIT
        // ===================================================

        if (editingCustomer) {
          if (
            !editingCustomer.firebaseId
          ) {
            toast.error(
              "Firebase ID is missing"
            );
            return;
          }

          const customerRef = doc(
            db,
            "customers",
            editingCustomer.firebaseId
          );

          const updatedData = {
            name,
            email,
            phone,
            orders,
            spent,
            status: formData.status,
            image:
              image || DEFAULT_IMAGE,
          };

          await updateDoc(
            customerRef,
            updatedData
          );

          setCustomers(
            (previousCustomers) =>
              previousCustomers.map(
                (customer) =>
                  customer.id ===
                  editingCustomer.id
                    ? {
                        ...customer,
                        ...updatedData,
                      }
                    : customer
              )
          );

          toast.success(
            "Customer updated successfully"
          );
        }

        // ===================================================
        // ADD
        // ===================================================

        else {
          const newId =
            customers.length > 0
              ? Math.max(
                  ...customers.map(
                    (customer) =>
                      customer.id
                  )
                ) + 1
              : 1;

          const newCustomerData = {
            id: newId,
            name,
            email,
            phone,
            orders,
            spent,
            status:
              formData.status,
            image:
              image || DEFAULT_IMAGE,
          };

          const customerRef =
            await addDoc(
              collection(
                db,
                "customers"
              ),
              newCustomerData
            );

          const newCustomer: Customer =
            {
              ...newCustomerData,
              firebaseId:
                customerRef.id,
            };

          setCustomers(
            (previousCustomers) => [
              ...previousCustomers,
              newCustomer,
            ]
          );

          toast.success(
            "Customer added successfully"
          );
        }

        setShowCustomerModal(false);
        setEditingCustomer(null);
        setFormData({
          ...emptyForm,
        });
      } catch (error) {
        console.error(
          "Error saving customer:",
          error
        );

        toast.error(
          "Failed to save customer"
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================

  const handleDeleteClick = (
    customer: Customer
  ) => {
    setDeleteCustomer(customer);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDelete = async () => {
    if (
      deleting ||
      !deleteCustomer
    ) {
      return;
    }

    if (!deleteCustomer.firebaseId) {
      toast.error(
        "Firebase ID is missing"
      );
      return;
    }

    try {
      setDeleting(true);

      const customerRef = doc(
        db,
        "customers",
        deleteCustomer.firebaseId
      );

      await deleteDoc(customerRef);

      setCustomers(
        (previousCustomers) =>
          previousCustomers.filter(
            (customer) =>
              customer.id !==
              deleteCustomer.id
          )
      );

      if (
        selectedCustomer?.id ===
        deleteCustomer.id
      ) {
        setSelectedCustomer(null);
      }

      toast.success(
        "Customer deleted successfully"
      );

      setDeleteCustomer(null);
    } catch (error) {
      console.error(
        "Error deleting customer:",
        error
      );

      toast.error(
        "Failed to delete customer"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // =========================================================
  // IMAGE FALLBACK
  // =========================================================

  const handleImageError = (
    event: React.SyntheticEvent<
      HTMLImageElement,
      Event
    >
  ) => {
    const image =
      event.currentTarget;

    if (
      image.src !== DEFAULT_IMAGE
    ) {
      image.src = DEFAULT_IMAGE;
    }
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeCustomerModal = () => {
    if (saving) return;

    setShowCustomerModal(false);
    setEditingCustomer(null);
    setFormData({
      ...emptyForm,
    });
  };

  // =========================================================
  // LIGHT / DARK STYLES
  // =========================================================

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900";

  const modalClass =
    "rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 transition-colors sm:p-6 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Customers
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and understand your customer base
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                loadCustomers(true)
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={
                handleAddCustomer
              }
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus size={18} />
              Add Customer
            </button>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <div className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Customers
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500 dark:text-blue-400">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Premium
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {premiumCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-600 dark:text-yellow-400">
                <Crown size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Regular
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {regularCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500 dark:text-blue-400">
                <UserCheck size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  New Customers
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {newCustomers}
                </p>
              </div>

              <div className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                <UserPlus size={20} />
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Customer Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalOrders}
                </p>
              </div>

              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                <ShoppingBag size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customers, email, phone..."
              className={`${inputClass} pl-11`}
            />
          </div>

          <div className="relative sm:w-60">
            <Filter
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className={`${inputClass} cursor-pointer pl-10`}
            >
              <option value="All">
                All Customer Categories
              </option>

              <option value="Premium">
                Premium
              </option>

              <option value="Regular">
                Regular
              </option>

              <option value="New">
                New
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {customers.length}
            </span>{" "}
            customers
          </p>

          {(search ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="text-sm font-medium text-blue-600 transition hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className={`${cardClass} flex min-h-[300px] flex-col items-center justify-center`}>
            <Loader2
              size={38}
              className="animate-spin text-blue-500"
            />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading customers...
            </p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          /* =================================================
              CARDS
          ================================================= */

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCustomers.map(
              (customer) => (
                <div
                  key={
                    customer.firebaseId ||
                    customer.id
                  }
                  className={`${cardClass} p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:hover:border-slate-700`}
                >
                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={
                          customer.image
                        }
                        alt={
                          customer.name
                        }
                        onError={
                          handleImageError
                        }
                        className="h-16 w-16 shrink-0 rounded-full border-2 border-slate-200 object-cover dark:border-slate-700"
                      />

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                          {
                            customer.name
                          }
                        </h2>

                        <span
                          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            customer.status
                          )}`}
                        >
                          {
                            customer.status
                          }
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 dark:text-slate-600">
                      #
                      {String(
                        customer.id
                      ).padStart(
                        3,
                        "0"
                      )}
                    </span>
                  </div>

                  <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

                  {/* DETAILS */}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500 dark:text-indigo-400">
                        <Mail size={16} />
                      </div>

                      <span className="truncate text-sm text-slate-600 dark:text-slate-400">
                        {
                          customer.email
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-500/10 p-2 text-green-600 dark:text-green-400">
                        <Phone size={16} />
                      </div>

                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {
                          customer.phone
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                        <ShoppingBag size={16} />
                      </div>

                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {
                          customer.orders
                        }{" "}
                        Orders
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600 dark:text-orange-400">
                        <DollarSign size={16} />
                      </div>

                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {
                          customer.spent
                        }
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCustomer(
                          customer
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      <Eye size={17} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEditCustomer(
                          customer
                        )
                      }
                      disabled={
                        saving ||
                        deleting
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-blue-600 transition hover:border-blue-500/40 hover:bg-blue-500/10 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-400"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteClick(
                          customer
                        )
                      }
                      disabled={
                        saving ||
                        deleting
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* EMPTY */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Users size={26} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {customers.length ===
              0
                ? "Your Firebase customers collection is empty."
                : "Try changing your search or customer category."}
            </p>

            {customers.length ===
            0 ? (
              <button
                type="button"
                onClick={
                  handleAddCustomer
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                <UserPlus
                  size={17}
                />
                Add First Customer
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* =================================================
            VIEW PROFILE MODAL
        ================================================= */}

        {selectedCustomer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setSelectedCustomer(
                  null
                );
              }
            }}
          >
            <div
              className={`${modalClass} max-h-[90vh] w-full max-w-md overflow-y-auto`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Customer Profile
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Customer details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCustomer(
                      null
                    )
                  }
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      selectedCustomer.image
                    }
                    alt={
                      selectedCustomer.name
                    }
                    onError={
                      handleImageError
                    }
                    className="h-24 w-24 rounded-full border-4 border-slate-200 object-cover dark:border-slate-700"
                  />

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {
                      selectedCustomer.name
                    }
                  </h3>

                  <span
                    className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      selectedCustomer.status
                    )}`}
                  >
                    {
                      selectedCustomer.status
                    }
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Mail
                        size={17}
                        className="text-indigo-500 dark:text-indigo-400"
                      />
                      Email
                    </span>

                    <span className="max-w-[190px] truncate text-sm text-slate-700 dark:text-slate-200">
                      {
                        selectedCustomer.email
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Phone
                        size={17}
                        className="text-green-500 dark:text-green-400"
                      />
                      Phone
                    </span>

                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      {
                        selectedCustomer.phone
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <ShoppingBag
                        size={17}
                        className="text-purple-500 dark:text-purple-400"
                      />
                      Orders
                    </span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {
                        selectedCustomer.orders
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <DollarSign
                        size={17}
                        className="text-orange-500 dark:text-orange-400"
                      />
                      Total Spent
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {
                        selectedCustomer.spent
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Star
                        size={17}
                        className="text-yellow-500 dark:text-yellow-400"
                      />
                      Category
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {
                        selectedCustomer.status
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditCustomer(
                        selectedCustomer
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    <Pencil size={17} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteClick(
                        selectedCustomer
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 p-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCustomer(
                      null
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ADD / EDIT MODAL
        ================================================= */}

        {showCustomerModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeCustomerModal();
              }
            }}
          >
            <div
              className={`${modalClass} max-h-[92vh] w-full max-w-2xl overflow-y-auto`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    {editingCustomer
                      ? "Edit Customer"
                      : "Add Customer"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                    {editingCustomer
                      ? "Update customer information"
                      : "Create a new customer profile"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeCustomerModal
                  }
                  disabled={saving}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Customer Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter customer name"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="customer@gmail.com"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="+1 9876543210"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Number of Orders
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      name="orders"
                      value={
                        formData.orders
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="0"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Total Spent
                    </label>

                    <input
                      type="text"
                      name="spent"
                      value={
                        formData.spent
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="$2,500"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Customer Category
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleInputChange
                      }
                      className={`${inputClass} cursor-pointer`}
                      disabled={saving}
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Regular">
                        Regular
                      </option>

                      <option value="Premium">
                        Premium
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Profile Image URL
                    </label>

                    <input
                      type="text"
                      name="image"
                      value={
                        formData.image
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="https://example.com/image.jpg"
                      className={
                        inputClass
                      }
                      disabled={saving}
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                      Leave empty to use the default profile image.
                    </p>
                  </div>
                </div>

                {formData.image.trim() && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                      Image Preview
                    </p>

                    <img
                      src={
                        formData.image
                      }
                      alt="Preview"
                      onError={
                        handleImageError
                      }
                      className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={
                    closeCustomerModal
                  }
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveCustomer
                  }
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <Save size={17} />

                      {editingCustomer
                        ? "Save Changes"
                        : "Add Customer"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            DELETE CONFIRMATION MODAL
        ================================================= */}

        {deleteCustomer && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setDeleteCustomer(
                  null
                );
              }
            }}
          >
            <div
              className={`${modalClass} w-full max-w-md p-6`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:text-red-400">
                  <AlertTriangle
                    size={24}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Delete Customer?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {
                        deleteCustomer.name
                      }
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteCustomer(
                      null
                    )
                  }
                  disabled={deleting}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmDelete
                  }
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? (
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
                      Delete Customer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}