import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Box,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLanguage } from "../context/LanguageContext";

const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 17800 },
  { month: "Mar", revenue: 15400 },
  { month: "Apr", revenue: 22500 },
  { month: "May", revenue: 27800 },
  { month: "Jun", revenue: 32400 },
];

const categoryData = [
  {
    name: "Electronics",
    value: 45,
  },
  {
    name: "Fashion",
    value: 25,
  },
  {
    name: "Groceries",
    value: 15,
  },
  {
    name: "Others",
    value: 15,
  },
];

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
];

const productPerformance = [
  {
    name: "Gaming Laptop",
    sales: 1299,
    orders: 1,
    percentage: 100,
  },
  {
    name: "Wireless Headphones",
    sales: 249,
    orders: 1,
    percentage: 72,
  },
  {
    name: "Gaming Mouse",
    sales: 178,
    orders: 2,
    percentage: 58,
  },
  {
    name: "Smart Watch",
    sales: 399,
    orders: 1,
    percentage: 46,
  },
];

export default function Analytics() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:p-6">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>

              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                {t("analytics")}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t("analyticsOverview")}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("salesPerformance")}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <Activity className="h-5 w-5 text-emerald-500" />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live Status
              </p>

              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Analytics Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
          ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Revenue */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              14.8%
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            {t("revenue")}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            $124,500
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Compared with previous period
          </p>
        </div>

        {/* Orders */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
              <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <ArrowUpRight className="h-3 w-3" />
              8.2%
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            {t("orders")}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            2,485
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Total processed orders
          </p>
        </div>

        {/* Customers */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-500/10">
              <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <ArrowUpRight className="h-3 w-3" />
              5.7%
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            {t("customers")}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            1,245
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Active customers
          </p>
        </div>

        {/* Growth */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <ArrowUpRight className="h-3 w-3" />
              +18%
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Growth
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            +18%
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Business growth rate
          </p>
        </div>
      </section>

      {/* =====================================================
          MAIN CHARTS
          ===================================================== */}

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("revenueOverview")}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Revenue performance over the last six months
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              +14.8%
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.35}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `$${value / 1000}k`
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{
                    r: 4,
                    fill: "#6366f1",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("categoryPerformance")}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Product category distribution
            </p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {categoryData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[index %
                            COLORS.length]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [
                    `${value}%`,
                    "Share",
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#94a3b8",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* =====================================================
          PERFORMANCE
          ===================================================== */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Performance */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("topProducts")}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Product sales performance
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
                <Box className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {productPerformance.map(
              (product, index) => (
                <div
                  key={product.name}
                  className="p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      #{index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                          {product.name}
                        </h3>

                        <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                          $
                          {product.sales.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {product.orders}{" "}
                          {t("orders")}
                        </span>

                        <span>
                          {product.percentage}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{
                            width: `${product.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Business Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Business Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Current store performance
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average Order Value
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                $50.10
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                6.4%
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conversion Rate
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                4.82%
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                3.2%
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Return Rate
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                2.14%
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-500">
                <ArrowDownRight className="h-3 w-3" />
                1.1%
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active Products
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                186
              </p>

              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                9.7%
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}