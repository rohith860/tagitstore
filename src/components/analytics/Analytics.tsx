import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Electronics", value: 45 },
  { name: "Fashion", value: 25 },
  { name: "Groceries", value: 15 },
  { name: "Others", value: 15 },
];

const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
];

export default function Analytics() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">

      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Sales Analytics
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}