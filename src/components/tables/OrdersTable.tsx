const orders = [
  {
    id: "#1001",
    customer: "John Smith",
    product: "Wireless Headphones",
    amount: "$249",
    status: "Completed",
    date: "25 Jul 2026",
  },
  {
    id: "#1002",
    customer: "Sarah Johnson",
    product: "Gaming Mouse",
    amount: "$149",
    status: "Pending",
    date: "25 Jul 2026",
  },
  {
    id: "#1003",
    customer: "David Lee",
    product: "Mechanical Keyboard",
    amount: "$199",
    status: "Cancelled",
    date: "24 Jul 2026",
  },
  {
    id: "#1004",
    customer: "Emma Wilson",
    product: "4K Monitor",
    amount: "$599",
    status: "Completed",
    date: "24 Jul 2026",
  },
];

export default function OrdersTable() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent mb-8">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 text-cyan-400">Order ID</th>
              <th className="text-left py-4 text-cyan-400">Customer</th>
              <th className="text-left py-4 text-cyan-400">Product</th>
              <th className="text-left py-4 text-cyan-400">Amount</th>
              <th className="text-left py-4 text-cyan-400">Status</th>
              <th className="text-left py-4 text-cyan-400">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition duration-300"
              >
                <td className="py-5 text-slate-300 font-medium">
                  {order.id}
                </td>

                <td className="py-5 text-white font-semibold">
                  {order.customer}
                </td>

                <td className="py-5 text-slate-300">
                  {order.product}
                </td>

                <td className="py-5 text-cyan-400 font-bold">
                  {order.amount}
                </td>

                <td className="py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-500 text-white"
                        : order.status === "Pending"
                        ? "bg-yellow-400 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="py-5 text-slate-400">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}