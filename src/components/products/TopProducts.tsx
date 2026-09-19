import { useEffect, useState } from "react";
import {
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaKeyboard,
  FaCube,
} from "react-icons/fa";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

interface Product {
  name: string;
  price: string;
  category: string;
  image: string;
}

interface Order {
  product: string;
  amount: string;
  status: string;
}

interface TopProduct {
  name: string;
  sales: number;
  amount: number;
  orders: number;
  icon: React.ReactNode;
  color: string;
}

export default function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // GET PRODUCT ICON
  // -----------------------------------------

  const getProductIcon = (
    category: string,
    productName: string
  ) => {
    const text =
      `${category} ${productName}`.toLowerCase();

    if (
      text.includes("laptop") ||
      text.includes("computer") ||
      text.includes("macbook")
    ) {
      return {
        icon: <FaLaptop />,
        color:
          "from-indigo-500 to-purple-600",
      };
    }

    if (
      text.includes("mobile") ||
      text.includes("phone") ||
      text.includes("iphone")
    ) {
      return {
        icon: <FaMobileAlt />,
        color:
          "from-cyan-500 to-blue-600",
      };
    }

    if (
      text.includes("headphone") ||
      text.includes("airpod") ||
      text.includes("earbud") ||
      text.includes("audio")
    ) {
      return {
        icon: <FaHeadphones />,
        color:
          "from-pink-500 to-rose-500",
      };
    }

    if (
      text.includes("keyboard") ||
      text.includes("mechanical")
    ) {
      return {
        icon: <FaKeyboard />,
        color:
          "from-emerald-500 to-green-600",
      };
    }

    return {
      icon: <FaCube />,
      color:
        "from-orange-500 to-red-500",
    };
  };

  // -----------------------------------------
  // CONVERT AMOUNT TO NUMBER
  // -----------------------------------------

  const parseAmount = (
    amount: unknown
  ): number => {
    if (typeof amount === "number") {
      return amount;
    }

    if (typeof amount === "string") {
      const numericAmount = Number(
        amount.replace(/[^0-9.-]+/g, "")
      );

      return Number.isNaN(numericAmount)
        ? 0
        : numericAmount;
    }

    return 0;
  };

  // -----------------------------------------
  // LOAD TOP PRODUCTS
  // -----------------------------------------

  const loadTopProducts = async () => {
    try {
      setLoading(true);

      // Load products
      const productsSnapshot = await getDocs(
        collection(db, "products")
      );

      // Load orders
      const ordersSnapshot = await getDocs(
        collection(db, "orders")
      );

      const firebaseProducts: Product[] =
        productsSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            name: String(
              data.name ?? "Unknown Product"
            ),
            price: String(
              data.price ?? "$0"
            ),
            category: String(
              data.category ?? ""
            ),
            image: String(
              data.image ?? ""
            ),
          };
        });

      const firebaseOrders: Order[] =
        ordersSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            product: String(
              data.product ?? ""
            ),
            amount: String(
              data.amount ?? "$0"
            ),
            status: String(
              data.status ?? ""
            ),
          };
        });

      // -----------------------------------------
      // CALCULATE PRODUCT PERFORMANCE
      // -----------------------------------------

      const productPerformance =
        firebaseProducts.map((product) => {
          const matchingOrders =
            firebaseOrders.filter(
              (order) =>
                order.product
                  .trim()
                  .toLowerCase() ===
                product.name
                  .trim()
                  .toLowerCase()
            );

          const totalRevenue =
            matchingOrders.reduce(
              (total, order) =>
                total +
                parseAmount(order.amount),
              0
            );

          const iconData =
            getProductIcon(
              product.category,
              product.name
            );

          return {
            name: product.name,
            sales: 0,
            amount: totalRevenue,
            orders:
              matchingOrders.length,
            icon: iconData.icon,
            color: iconData.color,
          };
        });

      // -----------------------------------------
      // SORT BY REVENUE
      // -----------------------------------------

      productPerformance.sort(
        (a, b) => b.amount - a.amount
      );

      // -----------------------------------------
      // SHOW ONLY PRODUCTS WITH SALES
      // -----------------------------------------

      const productsWithSales =
        productPerformance.filter(
          (product) => product.orders > 0
        );

      // -----------------------------------------
      // TOP 4 PRODUCTS
      // -----------------------------------------

      const topFour =
        productsWithSales.slice(0, 4);

      // -----------------------------------------
      // CALCULATE PERFORMANCE %
      // -----------------------------------------

      const highestRevenue =
        topFour.length > 0
          ? topFour[0].amount
          : 0;

      const finalProducts =
        topFour.map((product) => ({
          ...product,
          sales:
            highestRevenue > 0
              ? Math.round(
                  (product.amount /
                    highestRevenue) *
                    100
                )
              : 0,
        }));

      setProducts(finalProducts);
    } catch (error) {
      console.error(
        "Failed to load top products:",
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
    loadTopProducts();
  }, []);

  // -----------------------------------------
  // FORMAT CURRENCY
  // -----------------------------------------

  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 sm:p-6 lg:p-8 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />

            <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Top Products
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Your best-performing products based on current sales
          </p>

        </div>

        {/* PRODUCT COUNT */}

        <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 sm:w-auto sm:min-w-[145px] dark:border-indigo-900/40 dark:bg-indigo-950/30">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Showing
          </p>

          <p className="mt-1 text-lg font-black text-indigo-600 dark:text-indigo-400">
            Top {products.length || 0}
          </p>

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
              Loading top products...
            </p>

          </div>

        </div>

      ) : products.length === 0 ? (

        /* =========================================
           EMPTY STATE
        ========================================= */

        <div className="flex h-72 items-center justify-center px-4 text-center">

          <div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/30">

              <FaCube className="text-2xl text-indigo-500" />

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              No Sales Yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500 dark:text-slate-400">
              Add orders for your products to see top performers here.
            </p>

          </div>

        </div>

      ) : (

        /* =========================================
           PRODUCTS
        ========================================= */

        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">

          {products.map(
            (product, index) => (

              <div
                key={product.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
              >

                {/* subtle hover line */}

                <div
                  className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${product.color} transition-all duration-500 group-hover:w-full`}
                />

                {/* PRODUCT HEADER */}

                <div className="flex items-center gap-3 sm:gap-4">

                  {/* RANK */}

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-500 shadow-sm sm:h-9 sm:w-9 sm:text-xs dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    #{index + 1}
                  </div>

                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${product.color} text-base text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-1 sm:h-12 sm:w-12 sm:text-lg`}
                  >
                    {product.icon}
                  </div>

                  {/* PRODUCT INFO */}

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-sm font-bold text-slate-800 sm:text-base dark:text-white">
                      {product.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">

                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {formatCurrency(
                          product.amount
                        )}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />

                      <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
                        {product.orders}{" "}
                        {product.orders === 1
                          ? "order"
                          : "orders"}
                      </span>

                    </div>

                  </div>

                  {/* PERFORMANCE */}

                  <div className="shrink-0 text-right">

                    <p className="text-lg font-black text-slate-900 sm:text-xl dark:text-white">
                      {product.sales}%
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                      Performance
                    </p>

                  </div>

                </div>

                {/* PROGRESS */}

                <div className="mt-4 sm:mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]">
                      Revenue Performance
                    </span>

                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                      {product.sales}%
                    </span>

                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${product.color} transition-all duration-700 ease-out group-hover:brightness-110`}
                      style={{
                        width: `${product.sales}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

        <p className="text-[10px] font-medium leading-4 text-slate-400 sm:text-xs">
          Performance based on Firebase sales data
        </p>

        <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          ● Live Data
        </span>

      </div>

    </div>
  );
}