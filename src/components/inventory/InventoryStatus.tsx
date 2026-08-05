import {
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const inventory = [
  {
    title: "Total Products",
    value: "624",
    icon: <FaBoxes />,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "In Stock",
    value: "542",
    icon: <FaCheckCircle />,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Low Stock",
    value: "58",
    icon: <FaExclamationTriangle />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Out of Stock",
    value: "24",
    icon: <FaTimesCircle />,
    color: "from-red-500 to-rose-600",
  },
];

export default function InventoryStatus() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        Inventory Status
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {inventory.map((item, index) => (
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