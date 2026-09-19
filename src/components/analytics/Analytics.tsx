import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
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
  "#6366F1",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
];

export default function Analytics() {
  const topCategory = data.reduce(
    (highest, item) =>
      item.value > highest.value
        ? item
        : highest,
    data[0]
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

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Sales Analytics
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Understand how your sales are distributed across categories
          </p>

        </div>

        {/* TOTAL */}

        <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 sm:w-auto sm:min-w-[140px] sm:px-5 dark:border-indigo-900/40 dark:bg-indigo-950/30">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Total Share
          </p>

          <p className="mt-1 text-lg font-black text-slate-900 sm:text-xl dark:text-white">
            100%
          </p>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:mt-8 lg:grid-cols-2 lg:gap-10">

        {/* ===================================================
            DONUT CHART
        =================================================== */}

        <div className="relative h-[280px] w-full sm:h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="72%"
                paddingAngle={3}
                stroke="none"
              >

                {data.map(
                  (item, index) => (
                    <Cell
                      key={item.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              {/* TOOLTIP */}

              <Tooltip
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
                }}
                itemStyle={{
                  color: "#ffffff",
                  fontWeight: 700,
                }}
                formatter={(value) => [
                  `${value}%`,
                  "Sales",
                ]}
              />

            </PieChart>

          </ResponsiveContainer>

          {/* CENTER TEXT */}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

            <div className="text-center">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                Top Category
              </p>

              <p className="mt-1 text-base font-black text-slate-900 sm:text-lg dark:text-white">
                {topCategory.name}
              </p>

              <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                {topCategory.value}% of sales
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            CATEGORY BREAKDOWN
        =================================================== */}

        <div className="space-y-3">

          {data.map(
            (item, index) => (
              <div
                key={item.name}
                className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-lg sm:p-4 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >

                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-3">

                  <span
                    className="h-3 w-3 shrink-0 rounded-full shadow-sm"
                    style={{
                      backgroundColor:
                        COLORS[
                          index %
                            COLORS.length
                        ],
                    }}
                  />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400 sm:text-xs">
                      Sales category
                    </p>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="ml-3 shrink-0 text-right">

                  <p className="text-base font-black text-slate-900 sm:text-lg dark:text-white">
                    {item.value}%
                  </p>

                  <div className="mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-slate-200 sm:w-16 dark:bg-slate-700">

                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* =====================================================
          INSIGHT
      ===================================================== */}

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50 p-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-cyan-950/20">

        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
            Key Insight
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            {topCategory.name} is currently your strongest sales category.
          </p>

        </div>

        <span className="w-fit shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
          {topCategory.value}% Share
        </span>

      </div>

    </div>
  );
}