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
      className={`${gradient} rounded-3xl p-6 shadow-2xl text-white transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

          <p className="mt-3 text-green-200 font-medium">
            {growth} this month
          </p>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </div>
  );
}