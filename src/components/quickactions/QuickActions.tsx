import {
  FaPlus,
  FaFileInvoice,
  FaUsers,
  FaChartBar,
  FaDownload,
  FaDatabase,
} from "react-icons/fa";

const actions = [
  {
    title: "Add Product",
    icon: <FaPlus />,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Create Invoice",
    icon: <FaFileInvoice />,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "New Customer",
    icon: <FaUsers />,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Generate Report",
    icon: <FaChartBar />,
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Export Data",
    icon: <FaDownload />,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Backup Database",
    icon: <FaDatabase />,
    color: "from-violet-500 to-fuchsia-600",
  },
];

export default function QuickActions() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`bg-gradient-to-r ${action.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-all duration-300`}
          >
            <div className="text-3xl mb-3 flex justify-center">
              {action.icon}
            </div>

            <p className="font-semibold text-center">
              {action.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}