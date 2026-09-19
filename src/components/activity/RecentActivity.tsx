import { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaUserPlus,
  FaBoxOpen,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

interface Activity {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  lightColor: string;
  textColor: string;
  time: string;
}

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  payment: string;
}

interface Customer {
  id: string | number;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

export default function RecentActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // PARSE MONEY
  // -----------------------------------------

  const parseAmount = (amount: unknown): number => {
    if (typeof amount === "number") {
      return amount;
    }

    if (typeof amount === "string") {
      const cleanedAmount = amount.replace(
        /[^0-9.-]+/g,
        ""
      );

      const numericAmount = Number(cleanedAmount);

      return Number.isNaN(numericAmount)
        ? 0
        : numericAmount;
    }

    return 0;
  };

  // -----------------------------------------
  // FORMAT MONEY
  // -----------------------------------------

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // -----------------------------------------
  // GET NUMERIC ORDER NUMBER
  // -----------------------------------------

  const getNumericOrderNumber = (id: string) => {
    const number = Number(
      id.replace(/\D/g, "")
    );

    return Number.isFinite(number)
      ? number
      : 0;
  };

  // -----------------------------------------
  // LOAD REAL FIREBASE ACTIVITY
  // -----------------------------------------

  const loadActivities = async () => {
    try {
      setLoading(true);

      const [
        ordersSnapshot,
        customersSnapshot,
        productsSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "customers")),
        getDocs(collection(db, "products")),
      ]);

      // -----------------------------------------
      // ORDERS
      // -----------------------------------------

      const orders: Order[] =
        ordersSnapshot.docs.map((orderDoc) => {
          const data = orderDoc.data();

          return {
            id: String(
              data.id ?? orderDoc.id
            ),
            customer: String(
              data.customer ??
                "Unknown Customer"
            ),
            amount: String(
              data.amount ?? "$0"
            ),
            status: String(
              data.status ?? "Pending"
            ),
            payment: String(
              data.payment ?? "Pending"
            ),
          };
        });

      // Sort by numeric order ID
      const sortedOrders = [...orders].sort(
        (a, b) =>
          getNumericOrderNumber(b.id) -
          getNumericOrderNumber(a.id)
      );

      // -----------------------------------------
      // CUSTOMERS
      // -----------------------------------------

      const customers: Customer[] =
        customersSnapshot.docs.map(
          (customerDoc) => {
            const data =
              customerDoc.data();

            return {
              id:
                data.id ??
                customerDoc.id,
              name: String(
                data.name ??
                  "Unknown Customer"
              ),
            };
          }
        );

      // -----------------------------------------
      // PRODUCTS
      // -----------------------------------------

      const products: Product[] =
        productsSnapshot.docs.map(
          (productDoc) => {
            const data =
              productDoc.data();

            return {
              id: productDoc.id,
              name: String(
                data.name ??
                  "Unknown Product"
              ),
            };
          }
        );

      // -----------------------------------------
      // CREATE ACTIVITIES
      // -----------------------------------------

      const generatedActivities: Activity[] =
        [];

      // -----------------------------------------
      // 1. NEWEST ORDER
      // -----------------------------------------

      if (sortedOrders.length > 0) {
        const latestOrder =
          sortedOrders[0];

        generatedActivities.push({
          id: `order-${latestOrder.id}`,
          icon: <FaShoppingBag />,
          title: "New Order Received",
          subtitle: `Order ${latestOrder.id} from ${latestOrder.customer}`,
          color: "bg-blue-500",
          lightColor: "bg-blue-50",
          textColor: "text-blue-600",
          time: "Recently added",
        });
      }

      // -----------------------------------------
      // 2. NEWEST CUSTOMER
      // -----------------------------------------

      if (customers.length > 0) {
        const latestCustomer =
          customers[customers.length - 1];

        generatedActivities.push({
          id: `customer-${latestCustomer.id}`,
          icon: <FaUserPlus />,
          title: "New Customer",
          subtitle: `${latestCustomer.name} joined`,
          color: "bg-emerald-500",
          lightColor: "bg-emerald-50",
          textColor: "text-emerald-600",
          time: "Recently added",
        });
      }

      // -----------------------------------------
      // 3. NEWEST PRODUCT
      // -----------------------------------------

      if (products.length > 0) {
        const latestProduct =
          products[products.length - 1];

        generatedActivities.push({
          id: `product-${latestProduct.id}`,
          icon: <FaBoxOpen />,
          title: "Product Updated",
          subtitle: latestProduct.name,
          color: "bg-violet-500",
          lightColor: "bg-violet-50",
          textColor: "text-violet-600",
          time: "Recently added",
        });
      }

      // -----------------------------------------
      // 4. PAYMENT RECEIVED
      // -----------------------------------------

      const paidOrder =
        sortedOrders.find(
          (order) =>
            order.payment
              .toLowerCase() === "paid" ||
            order.status
              .toLowerCase() ===
              "completed"
        );

      if (paidOrder) {
        const paymentAmount =
          parseAmount(
            paidOrder.amount
          );

        generatedActivities.push({
          id: `payment-${paidOrder.id}`,
          icon: <FaDollarSign />,
          title: "Payment Received",
          subtitle: `${formatCurrency(
            paymentAmount
          )} Successfully Paid`,
          color: "bg-orange-500",
          lightColor: "bg-orange-50",
          textColor: "text-orange-600",
          time: "Recently added",
        });
      }

      setActivities(
        generatedActivities.slice(0, 4)
      );
    } catch (error) {
      console.error(
        "Failed to load recent activity:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // LOAD ON DASHBOARD OPEN
  // -----------------------------------------

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 sm:p-6 lg:p-8 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />

            <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Recent Activity
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Latest updates from your business
          </p>

        </div>

        {/* LIVE STATUS */}

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">

          <span className="relative flex h-2 w-2">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

          </span>

          <span className="text-[10px] font-bold text-emerald-600 sm:text-xs dark:text-emerald-400">
            Live
          </span>

        </div>

      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <div className="flex h-72 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />

            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading recent activity...
            </p>

          </div>

        </div>

      ) : activities.length === 0 ? (

        /* =========================================
           EMPTY STATE
        ========================================= */

        <div className="flex h-72 items-center justify-center px-4 text-center">

          <div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/30">

              <FaBoxOpen className="text-2xl text-indigo-500" />

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              No Recent Activity
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500 dark:text-slate-400">
              Add orders, customers, or products to see activity here.
            </p>

          </div>

        </div>

      ) : (

        /* =========================================
           ACTIVITIES
        ========================================= */

        <div className="relative mt-6 sm:mt-8">

          {/* TIMELINE */}

          <div className="absolute bottom-5 left-[21px] top-5 hidden w-px bg-gradient-to-b from-blue-200 via-violet-200 to-transparent sm:block dark:from-blue-900 dark:via-violet-900 dark:to-transparent" />

          <div className="space-y-3">

            {activities.map(
              (item, index) => (

                <div
                  key={item.id}
                  className="group relative flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:gap-4 sm:p-4 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
                >

                  {/* ICON */}

                  <div
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color} text-base text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-12 sm:w-12 sm:text-lg`}
                  >
                    {item.icon}
                  </div>

                  {/* ACTIVITY CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="truncate text-sm font-bold text-slate-800 sm:text-base dark:text-white">
                        {item.title}
                      </h3>

                      {index === 0 && (
                        <span className="hidden shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-500 sm:inline dark:bg-blue-950/30 dark:text-blue-400">
                          Latest
                        </span>
                      )}

                    </div>

                    <p className="mt-1 truncate text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                      {item.subtitle}
                    </p>

                  </div>

                  {/* TIME */}

                  <div className="shrink-0">

                    <span
                      className={`rounded-full ${item.lightColor} px-2 py-1 text-[9px] font-bold ${item.textColor} sm:px-2.5 sm:py-1.5 sm:text-[10px] dark:bg-slate-700 dark:text-slate-300`}
                    >
                      {item.time}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5 dark:border-slate-800">

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="group flex items-center gap-2 rounded-xl px-1 py-1 text-sm font-bold text-blue-600 transition-all duration-200 hover:text-violet-600 dark:text-blue-400 dark:hover:text-violet-400"
        >
          View all activity

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

      </div>

    </div>
  );
}