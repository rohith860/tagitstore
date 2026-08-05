import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const notifications = [
  {
    title: "New Order Received",
    message: "Order #1045 has been placed.",
    icon: <FaBell />,
    color: "text-blue-500",
  },
  {
    title: "Payment Successful",
    message: "$2,450 payment received.",
    icon: <FaCheckCircle />,
    color: "text-green-500",
  },
  {
    title: "Low Stock Alert",
    message: "Wireless Mouse stock is low.",
    icon: <FaExclamationTriangle />,
    color: "text-yellow-500",
  },
  {
    title: "System Update",
    message: "Dashboard updated successfully.",
    icon: <FaInfoCircle />,
    color: "text-purple-500",
  },
];

export default function NotificationsPanel() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
        Notifications
      </h2>

      <div className="space-y-4">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:scale-[1.02] transition"
          >
            <div className={`text-2xl ${item.color}`}>
              {item.icon}
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}