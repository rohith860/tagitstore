
import {
  FaPlus,
  FaFileInvoice,
  FaUsers,
  FaChartBar,
  FaDownload,
  FaDatabase,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onGenerateReport: () => void;
}

export default function QuickActions({
  onGenerateReport,
}: QuickActionsProps) {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/products");
  };

  const handleCreateInvoice = () => {
    alert("Invoice creation feature is ready to be connected.");
  };

  const handleNewCustomer = () => {
    navigate("/customers");
  };

  const handleExportData = () => {
    const data = [
      ["Metric", "Value"],
      ["Revenue", "$84,500"],
      ["Orders", "1,284"],
      ["Customers", "8,420"],
      ["Products", "624"],
    ];

    const csv = data.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "TAGITStore_Data.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleBackupDatabase = () => {
    const backupData = {
      revenue: "$84,500",
      orders: "1,284",
      customers: "8,420",
      products: "624",
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(backupData, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "TAGITStore_Backup.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const actions = [
    {
      title: "Add Product",
      description: "Add a new item to inventory",
      icon: <FaPlus />,
      color: "from-indigo-500 to-purple-600",
      onClick: handleAddProduct,
    },
    {
      title: "Create Invoice",
      description: "Generate a new customer invoice",
      icon: <FaFileInvoice />,
      color: "from-cyan-500 to-blue-600",
      onClick: handleCreateInvoice,
    },
    {
      title: "New Customer",
      description: "Register a new customer",
      icon: <FaUsers />,
      color: "from-green-500 to-emerald-600",
      onClick: handleNewCustomer,
    },
    {
      title: "Generate Report",
      description: "Create a business report",
      icon: <FaChartBar />,
      color: "from-pink-500 to-rose-600",
      onClick: onGenerateReport,
    },
    {
      title: "Export Data",
      description: "Download your business data",
      icon: <FaDownload />,
      color: "from-orange-500 to-red-600",
      onClick: handleExportData,
    },
    {
      title: "Backup Database",
      description: "Secure your latest database",
      icon: <FaDatabase />,
      color: "from-violet-500 to-fuchsia-600",
      onClick: handleBackupDatabase,
    },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Quick Actions
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Frequently used business actions at your fingertips
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400">
          ⚡
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
          >
            {/* Glow */}
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-r ${action.color} opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
            />

            {/* Icon */}
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${action.color} text-lg text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              {action.icon}
            </div>

            {/* Content */}
            <div className="relative mt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-800 dark:text-white">
                  {action.title}
                </h3>

                <span className="text-lg text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-500">
                  →
                </span>
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {action.description}
              </p>
            </div>

            {/* Bottom Accent */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${action.color} transition-all duration-500 group-hover:w-full`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

