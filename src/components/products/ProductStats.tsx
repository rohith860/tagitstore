import {
  Package,
  CheckCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Props {
  total?: number;
  inStock?: number;
  lowStock?: number;
  categories?: number;
}

export default function ProductStats({
  total = 0,
  inStock = 0,
  lowStock = 0,
  categories = 0,
}: Props) {
  const stats = [
    {
      title: "Total Products",
      value: total,
      Icon: Package,
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "In Stock",
      value: inStock,
      Icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Low Stock",
      value: lowStock,
      Icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Categories",
      value: categories,
      Icon: Layers,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
      {stats.map((item) => {
        const Icon = item.Icon;

        return (
          <div
            key={item.title}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-5 sm:p-6 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${item.color}`}
            >
              <Icon size={26} />
            </div>

            <h3 className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
              {item.title}
            </h3>

            <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}