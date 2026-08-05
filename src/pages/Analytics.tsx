import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 27000 },
  { month: "Jun", revenue: 32000 },
];

const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Wearables", value: 15 },
  { name: "Audio", value: 15 },
];

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EC4899",
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-8">

      <h1 className="text-4xl font-bold text-slate-800">
        Analytics Dashboard
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Business performance overview.
      </p>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <DollarSign className="text-green-600" size={34} />
          <p className="text-slate-500 mt-4">Revenue</p>
          <h2 className="text-3xl font-bold">$124,500</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <ShoppingCart className="text-indigo-600" size={34} />
          <p className="text-slate-500 mt-4">Orders</p>
          <h2 className="text-3xl font-bold">2,485</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <Users className="text-blue-600" size={34} />
          <p className="text-slate-500 mt-4">Customers</p>
          <h2 className="text-3xl font-bold">1,245</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <TrendingUp className="text-orange-500" size={34} />
          <p className="text-slate-500 mt-4">Growth</p>
          <h2 className="text-3xl font-bold">+18%</h2>
        </div>

      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Product Categories
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                outerRadius={110}
                label
              >
               {categoryData.map((_, index) => (
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
    </div>
  );
}