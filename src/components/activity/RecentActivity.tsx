import { FaShoppingBag, FaUserPlus, FaBoxOpen, FaDollarSign } from "react-icons/fa";

const activities = [
  {
    icon: <FaShoppingBag />,
    title: "New Order Received",
    subtitle: "Order #1245 from John",
    color: "bg-blue-500",
  },
  {
    icon: <FaUserPlus />,
    title: "New Customer",
    subtitle: "Sarah joined today",
    color: "bg-green-500",
  },
  {
    icon: <FaBoxOpen />,
    title: "Product Updated",
    subtitle: "Wireless Headphones",
    color: "bg-purple-500",
  },
  {
    icon: <FaDollarSign />,
    title: "Payment Received",
    subtitle: "$2,450 Successfully Paid",
    color: "bg-orange-500",
  },
];

export default function RecentActivity() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 hover:scale-105 transition"
          >
            <div className="flex items-center gap-4">
              <div className={`${item.color} p-3 rounded-xl text-white text-xl`}>
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="text-sm text-slate-400">Just now</span>
          </div>
        ))}
      </div>
    </div>
  );
}