import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

interface RevenueData {
  order: string;
  revenue: number;
}

interface Order {
  id: string;
  amount: string;
}

export default function RevenueChart() {
  const [data, setData] =
    useState<RevenueData[]>([]);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

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
  // LOAD REVENUE FROM FIREBASE
  // -----------------------------------------

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "orders")
      );

      const orders: Order[] =
        snapshot.docs.map((orderDoc) => {
          const orderData =
            orderDoc.data();

          return {
            id: String(
              orderData.id ??
                orderDoc.id
            ),
            amount: String(
              orderData.amount ??
                "$0"
            ),
          };
        });

      // -----------------------------------------
      // CALCULATE TOTAL REVENUE
      // -----------------------------------------

      const revenue =
        orders.reduce(
          (total, order) => {
            return (
              total +
              parseAmount(
                order.amount
              )
            );
          },
          0
        );

      setTotalRevenue(revenue);

      // -----------------------------------------
      // PREPARE CHART DATA
      // -----------------------------------------

      const chartData = [...orders]
        .reverse()
        .slice(0, 7)
        .map((order) => ({
          order: order.id,
          revenue:
            parseAmount(
              order.amount
            ),
        }));

      setData(chartData);
    } catch (error) {
      console.error(
        "Failed to load revenue data:",
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
    loadRevenueData();
  }, []);

  // -----------------------------------------
  // FORMAT CURRENCY
  // -----------------------------------------

  const formatCurrency = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  // -----------------------------------------
  // FORMAT CHART Y AXIS
  // -----------------------------------------

  const formatAxisValue = (
    value: number
  ) => {
    if (value >= 1000) {
      return `$${Math.round(
        value / 1000
      )}k`;
    }

    return `$${value}`;
  };

  // -----------------------------------------
  // CURRENT REVENUE
  // -----------------------------------------

  const formattedRevenue =
    formatCurrency(
      totalRevenue
    );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 sm:p-6 lg:p-8 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        {/* TITLE */}

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Revenue Overview
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Track revenue from your recent customer orders
          </p>

        </div>

        {/* REVENUE SUMMARY */}

        <div className="w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 sm:w-auto sm:min-w-[170px] sm:px-5 dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/30">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Total Revenue
          </p>

          <div className="mt-1 flex items-center gap-2">

            <span className="truncate text-lg font-black text-slate-900 sm:text-xl dark:text-white">
              {loading
                ? "Loading..."
                : formattedRevenue}
            </span>

            {!loading && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                Live
              </span>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="flex h-[280px] items-center justify-center sm:h-[320px]">

          <div className="text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading revenue data...
            </p>

          </div>

        </div>
      ) : data.length === 0 ? (

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        <div className="flex h-[280px] items-center justify-center text-center sm:h-[320px]">

          <div>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30">

              <span className="text-2xl">
                📈
              </span>

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              No Revenue Data
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add orders to see your revenue chart.
            </p>

          </div>

        </div>
      ) : (

        /* =====================================================
           CHART
        ===================================================== */

        <div className="mt-6 h-[280px] w-full sm:mt-8 sm:h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: 0,
                bottom: 5,
              }}
            >

              {/* GRID */}

              <CartesianGrid
                strokeDasharray="4 6"
                stroke="#94a3b833"
                vertical={false}
              />

              {/* X AXIS */}

              <XAxis
                dataKey="order"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 600,
                }}
                dy={10}
                tickMargin={5}
              />

              {/* Y AXIS */}

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 600,
                }}
                tickFormatter={formatAxisValue}
                width={48}
              />

              {/* TOOLTIP */}

              <Tooltip
                cursor={{
                  stroke: "#6366f1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  backgroundColor:
                    "#0f172a",
                  border:
                    "1px solid #334155",
                  borderRadius:
                    "14px",
                  padding:
                    "10px 14px",
                  boxShadow:
                    "0 10px 30px rgba(15, 23, 42, 0.25)",
                }}
                labelStyle={{
                  color: "#cbd5e1",
                  fontWeight: 700,
                  marginBottom:
                    "4px",
                }}
                itemStyle={{
                  color: "#93c5fd",
                  fontWeight: 700,
                }}
                formatter={(value) => [
                  formatCurrency(
                    Number(value)
                  ),
                  "Revenue",
                ]}
              />

              {/* REVENUE LINE */}

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#6366f1",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "#4f46e5",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                animationDuration={800}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>
      )}

      {/* =====================================================
          BOTTOM INSIGHT
      ===================================================== */}

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/50">

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Performance
          </p>

          <p className="mt-1 truncate text-sm font-bold text-slate-700 dark:text-slate-200">
            Revenue data is connected to Firebase 📈
          </p>

        </div>

        <span className="w-fit shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
          Live Data
        </span>

      </div>

    </div>
  );
}