import { FaLaptop, FaMobileAlt, FaHeadphones, FaKeyboard } from "react-icons/fa";

const products = [
  {
    name: "MacBook Pro",
    sales: 92,
    amount: "$45,000",
    icon: <FaLaptop />,
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "iPhone 17 Pro",
    sales: 86,
    amount: "$38,000",
    icon: <FaMobileAlt />,
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "AirPods Pro",
    sales: 74,
    amount: "$21,000",
    icon: <FaHeadphones />,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Mechanical Keyboard",
    sales: 61,
    amount: "$15,500",
    icon: <FaKeyboard />,
    color: "from-emerald-500 to-green-600",
  },
];

export default function TopProducts() {
  return (
    <div className="mt-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-8">
        Top Products
      </h2>

      <div className="space-y-6">
        {products.map((product, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center text-white text-xl`}
                >
                  {product.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {product.amount}
                  </p>
                </div>
              </div>

              <span className="font-bold text-cyan-500">
                {product.sales}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${product.color}`}
                style={{ width: `${product.sales}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}