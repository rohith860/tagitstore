import {
  FaUsers,
  FaUserCheck,
  FaUserPlus,
  FaUserClock,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Customers",
    value: "8,420",
    icon: <FaUsers />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Active Users",
    value: "7,860",
    icon: <FaUserCheck />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "New This Month",
    value: "324",
    icon: <FaUserPlus />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Pending Approval",
    value: "58",
    icon: <FaUserClock />,
    color: "from-orange-500 to-red-500",
  },
];

export default function CustomerStats() {
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
              Customer Statistics
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Monitor your customer base and engagement
          </p>

        </div>

        {/* GROWTH BADGE */}

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">

          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            ↑ 24%
          </span>

          <span className="text-[10px] font-semibold text-emerald-600/70 sm:text-xs dark:text-emerald-400/70">
            customer growth
          </span>

        </div>

      </div>

      {/* =========================================
          STATS GRID
      ========================================= */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {stats.map((item) => (

          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
          >

            {/* DECORATIVE GLOW */}

            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-r ${item.color} opacity-10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-20`}
            />

            {/* TOP ROW */}

            <div className="relative flex items-start justify-between gap-3">

              {/* ICON */}

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-base text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-12 sm:w-12 sm:text-lg`}
              >
                {item.icon}
              </div>

              {/* STATUS DOT */}

              <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-slate-400 shadow-sm dark:bg-slate-700 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>

            </div>

            {/* TITLE */}

            <p className="relative mt-5 truncate text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm sm:normal-case sm:tracking-normal dark:text-slate-400">
              {item.title}
            </p>

            {/* VALUE */}

            <h3 className="relative mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {item.value}
            </h3>

            {/* BOTTOM INFO */}

            <div className="relative mt-5 flex items-center justify-between gap-3">

              <span className="truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
                Updated recently
              </span>

              <span
                className={`h-1.5 w-10 shrink-0 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 group-hover:w-16`}
              />

            </div>

            {/* BOTTOM HOVER LINE */}

            <div
              className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${item.color} transition-all duration-500 group-hover:w-full`}
            />

          </div>

        ))}

      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

        <p className="text-[10px] font-medium leading-4 text-slate-400 sm:text-xs">
          Customer metrics overview
        </p>

        <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
          Customer Insights
        </span>

      </div>

    </div>
  );
}