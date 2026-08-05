import { FaUsers, FaUserCheck, FaUserPlus, FaUserClock } from "react-icons/fa";

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
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        Customer Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-6 hover:scale-105 transition-all duration-300"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl`}
            >
              {item.icon}
            </div>

            <h3 className="mt-5 text-slate-500 dark:text-slate-400">
              {item.title}
            </h3>

            <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
              {item.value}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}