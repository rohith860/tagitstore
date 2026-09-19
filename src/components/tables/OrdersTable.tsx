import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import {
  ArrowRight,
  ChevronRight,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { db } from "../../firebase";

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
  payment: string;
  firebaseId?: string;
}

export default function OrdersTable() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // LOAD ORDERS FROM FIREBASE
  // -----------------------------------------

  const loadOrders = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "orders")
      );

      const data: Order[] = snapshot.docs.map(
        (orderDoc) => {
          const orderData = orderDoc.data();

          return {
            id: String(
              orderData.id ?? orderDoc.id
            ),
            customer: String(
              orderData.customer ??
                "Unknown Customer"
            ),
            product: String(
              orderData.product ??
                "Unknown Product"
            ),
            amount: String(
              orderData.amount ?? "$0"
            ),
            status: String(
              orderData.status ?? "Pending"
            ),
            payment: String(
              orderData.payment ?? "Pending"
            ),
            firebaseId: orderDoc.id,
          };
        }
      );

      // Newest Firebase documents first
      const recentOrders = [...data]
        .reverse()
        .slice(0, 5);

      setOrders(recentOrders);
    } catch (error) {
      console.error(
        "Failed to load recent orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // LOAD WHEN COMPONENT OPENS
  // -----------------------------------------

  useEffect(() => {
    loadOrders();
  }, []);

  // -----------------------------------------
  // STATUS STYLE
  // -----------------------------------------

  const getStatusStyle = (status: string) => {
    const normalizedStatus =
      status.toLowerCase();

    if (normalizedStatus === "completed") {
      return {
        container:
          "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400",
        dot: "bg-emerald-500",
      };
    }

    if (normalizedStatus === "pending") {
      return {
        container:
          "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400",
        dot: "bg-amber-500",
      };
    }

    if (normalizedStatus === "shipped") {
      return {
        container:
          "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400",
        dot: "bg-blue-500",
      };
    }

    if (normalizedStatus === "cancelled") {
      return {
        container:
          "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400",
        dot: "bg-red-500",
      };
    }

    return {
      container:
        "border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
      dot: "bg-slate-500",
    };
  };

  // -----------------------------------------
  // CUSTOMER INITIALS
  // -----------------------------------------

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg shadow-slate-200/40 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8 dark:border-slate-800">

        <div className="min-w-0">
          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />

            <div className="flex min-w-0 items-center gap-2.5">
              <ShoppingBag
                size={19}
                className="shrink-0 text-blue-500"
              />

              <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                Recent Orders
              </h2>
            </div>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Track your latest customer orders
            and payments
          </p>
        </div>

        {/* VIEW ALL */}

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md sm:w-fit dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
        >
          View All

          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <div className="flex h-72 items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />

            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading recent orders...
            </p>

          </div>

        </div>

      ) : orders.length === 0 ? (

        /* =========================================
           EMPTY STATE
        ========================================= */

        <div className="flex h-72 items-center justify-center px-6 text-center">

          <div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <ShoppingBag
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              No Orders Found
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add an order to see it here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Go to Orders
              <ArrowRight size={15} />
            </button>

          </div>

        </div>

      ) : (

        /* =========================================
           TABLE
        ========================================= */

        <div className="overflow-x-auto">

          <table className="w-full min-w-[820px]">

            {/* TABLE HEADER */}

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:px-6">
                  Date
                </th>

              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>

              {orders.map((order) => {

                const statusStyle =
                  getStatusStyle(order.status);

                return (
                  <tr
                    key={
                      order.firebaseId ??
                      order.id
                    }
                    className="group border-b border-slate-100 transition-all duration-200 last:border-b-0 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >

                    {/* ORDER */}

                    <td className="px-5 py-5 sm:px-6">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-105 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400">
                          <ShoppingBag size={16} />
                        </div>

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          #{order.id}
                        </span>

                      </div>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-5 py-5 sm:px-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[11px] font-extrabold text-white shadow-md shadow-blue-500/20">
                          {getInitials(
                            order.customer
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                            {order.customer}
                          </p>

                          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <User size={11} />
                            Customer
                          </div>
                        </div>

                      </div>

                    </td>

                    {/* PRODUCT */}

                    <td className="px-5 py-5 sm:px-6">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-500 dark:bg-violet-950/30 dark:text-violet-400">
                          <Package size={16} />
                        </div>

                        <span className="max-w-[190px] truncate text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {order.product}
                        </span>

                      </div>

                    </td>

                    {/* AMOUNT */}

                    <td className="px-5 py-5 sm:px-6">

                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {order.amount}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-5 sm:px-6">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold ${statusStyle.container}`}
                      >

                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle.dot}`}
                        />

                        {order.status}

                      </span>

                    </td>

                    {/* DATE */}

                    <td className="px-5 py-5 sm:px-6">

                      <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />

                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                          Recently added
                        </span>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      )}

      {/* =========================================
          FOOTER
      ========================================= */}

      {!loading && orders.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">

          <p className="text-xs font-semibold text-slate-400">
            Showing{" "}
            <span className="font-extrabold text-slate-600 dark:text-slate-300">
              {orders.length}
            </span>{" "}
            recent{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="group flex w-fit items-center gap-1.5 text-xs font-bold text-blue-500 transition-colors duration-200 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Manage orders

            <ChevronRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>

        </div>
      )}

    </div>
  );
}