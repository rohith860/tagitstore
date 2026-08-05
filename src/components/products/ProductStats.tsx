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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {stats.map((item) => {
        const Icon = item.Icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${item.color}`}
            >
              <Icon size={28} />
            </div>

            <h3 className="mt-5 text-slate-500 font-medium">
              {item.title}
            </h3>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

