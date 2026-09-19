import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  growth: string;
  icon: ReactNode;
  gradient: string;
}

export default function StatCard({
  title,
  value,
  growth,
  icon,
  gradient,
}: StatCardProps) {
  return (
    <div
      className={`group relative flex min-h-[170px] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-300/40 sm:p-6 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:hover:border-slate-700 dark:hover:shadow-black/40`}
    >
      {/* =====================================================
          DECORATIVE GLOW
      ===================================================== */}

      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-10 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-20 ${gradient}`}
      />

      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* TEXT */}

        <div className="min-w-0 flex-1">
          {/* TITLE */}

          <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal dark:text-slate-400">
            {title}
          </p>

          {/* VALUE */}

          <h2 className="mt-2 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {value}
          </h2>
        </div>

        {/* ICON */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${gradient} text-lg text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-12 sm:w-12 sm:text-xl`}
        >
          {icon}
        </div>
      </div>

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-5">
        {/* GROWTH */}

        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 sm:text-xs dark:bg-emerald-950/30 dark:text-emerald-400">
            ↑ {growth}
          </span>

          <span className="hidden truncate text-xs font-medium text-slate-400 sm:inline dark:text-slate-500">
            this month
          </span>
        </div>

        {/* DECORATIVE LINE */}

        <div className="hidden h-1 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:block dark:bg-slate-800">
          <div
            className={`h-full w-8 rounded-full ${gradient} transition-all duration-500 group-hover:w-12`}
          />
        </div>
      </div>

      {/* =====================================================
          BOTTOM GRADIENT LINE
      ===================================================== */}

      <div
        className={`absolute bottom-0 left-0 h-1 w-0 ${gradient} transition-all duration-500 group-hover:w-full`}
      />
    </div>
  );
}