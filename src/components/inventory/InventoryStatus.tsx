import { useEffect, useState } from "react";
import {
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

interface InventoryProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

const defaultInventory: InventoryProduct[] = [
  {
    id: 1,
    name: "Smart Tag Pro",
    sku: "TAG-001",
    stock: 125,
  },
  {
    id: 2,
    name: "NFC Card",
    sku: "NFC-002",
    stock: 18,
  },
  {
    id: 3,
    name: "RFID Reader",
    sku: "RFID-003",
    stock: 0,
  },
  {
    id: 4,
    name: "Tracking Label",
    sku: "LBL-004",
    stock: 85,
  },
];

export default function InventoryStatus() {
  const [products, setProducts] =
    useState<InventoryProduct[]>(() => {
      const savedInventory =
        localStorage.getItem(
          "tagit_inventory"
        );

      if (savedInventory) {
        return JSON.parse(savedInventory);
      }

      return defaultInventory;
    });

  const [showForm, setShowForm] =
    useState(false);

  const [productName, setProductName] =
    useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "tagit_inventory",
      JSON.stringify(products)
    );
  }, [products]);

  const getStatus = (stock: number) => {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 20) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const handleAddProduct = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !productName.trim() ||
      !sku.trim() ||
      stock === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const stockNumber = Number(stock);

    if (
      stockNumber < 0 ||
      !Number.isInteger(stockNumber)
    ) {
      alert(
        "Stock must be a valid positive number."
      );
      return;
    }

    const newProduct: InventoryProduct = {
      id: Date.now(),
      name: productName.trim(),
      sku: sku.trim().toUpperCase(),
      stock: stockNumber,
    };

    setProducts((prevProducts) => [
      ...prevProducts,
      newProduct,
    ]);

    setProductName("");
    setSku("");
    setStock("");
    setShowForm(false);
  };

  // -----------------------------------------
  // INVENTORY COUNTS
  // -----------------------------------------

  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => product.stock > 20
  ).length;

  const lowStock = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= 20
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inventory = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FaBoxes />,
      color: "from-indigo-500 to-purple-600",
      badge: "All",
    },
    {
      title: "In Stock",
      value: inStock,
      icon: <FaCheckCircle />,
      color: "from-green-500 to-emerald-600",
      badge: "Healthy",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <FaExclamationTriangle />,
      color: "from-yellow-500 to-orange-500",
      badge: "Attention",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: <FaTimesCircle />,
      color: "from-red-500 to-rose-600",
      badge: "Critical",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-lg shadow-slate-200/40 transition-all duration-300 sm:p-6 lg:p-8 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />

            <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Inventory Status
            </h2>

          </div>

          <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
            Monitor product stock levels and inventory health
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-fit"
        >
          <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
          Add Product
        </button>

      </div>

      {/* =========================================
          ADD PRODUCT FORM
      ========================================= */}

      {showForm && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-800/70">

          <div className="mb-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Add New Product
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Enter the product inventory details
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-700 dark:hover:border-red-900/40 dark:hover:bg-red-950/30"
              aria-label="Close form"
            >
              <FaTimes />
            </button>

          </div>

          <form onSubmit={handleAddProduct}>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* PRODUCT NAME */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Product Name
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    setProductName(
                      e.target.value
                    )
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

              {/* SKU */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  SKU
                </label>

                <input
                  type="text"
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value)
                  }
                  placeholder="e.g. TAG-005"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

              {/* STOCK */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  placeholder="Enter quantity"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
                />
              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Save Product
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =========================================
          INVENTORY SUMMARY
      ========================================= */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

        {inventory.map((item) => (

          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
          >

            {/* ICON */}

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-base text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-12 sm:w-12 sm:text-lg`}
            >
              {item.icon}
            </div>

            {/* TITLE */}

            <p className="mt-5 truncate text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm sm:normal-case sm:tracking-normal dark:text-slate-400">
              {item.title}
            </p>

            {/* VALUE */}

            <div className="mt-1 flex items-end justify-between gap-3">

              <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {item.value}
              </h3>

              <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold text-slate-400 shadow-sm dark:bg-slate-700 dark:text-slate-400">
                {item.badge}
              </span>

            </div>

            {/* BOTTOM LINE */}

            <div
              className={`mt-5 h-1 w-10 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 group-hover:w-16`}
            />

            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${item.color} transition-all duration-500 group-hover:w-full`}
            />

          </div>

        ))}

      </div>

      {/* =========================================
          PRODUCT LIST
      ========================================= */}

      <div className="mt-7 sm:mt-8">

        <div className="mb-4 flex items-center justify-between gap-3">

          <div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
              Inventory Products
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Current stock levels
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {products.length} items
          </span>

        </div>

        <div className="space-y-3">

          {products.map((product) => {

            const status =
              getStatus(product.stock);

            const statusStyles =
              status === "In Stock"
                ? {
                    badge:
                      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400",
                    dot: "bg-emerald-500",
                  }
                : status === "Low Stock"
                ? {
                    badge:
                      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400",
                    dot: "bg-amber-500",
                  }
                : {
                    badge:
                      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400",
                    dot: "bg-red-500",
                  };

            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:p-5 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:shadow-black/20"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* PRODUCT */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
                      <FaBoxes size={16} />
                    </div>

                    <div className="min-w-0">

                      <h4 className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {product.name}
                      </h4>

                      <p className="mt-1 text-[10px] font-semibold text-slate-400 sm:text-xs">
                        SKU: {product.sku}
                      </p>

                    </div>

                  </div>

                  {/* STOCK + STATUS */}

                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    <div className="text-left sm:text-right">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Stock
                      </p>

                      <p className="mt-0.5 text-lg font-black text-slate-800 dark:text-white">
                        {product.stock}
                      </p>

                    </div>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-extrabold sm:text-xs ${statusStyles.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                      />

                      {status}
                    </span>

                  </div>

                </div>

                {/* STOCK BAR */}

                <div className="mt-4">

                  <div className="mb-1.5 flex items-center justify-between">

                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Stock level
                    </span>

                    <span className="text-[9px] font-bold text-slate-400">
                      {product.stock === 0
                        ? "Empty"
                        : product.stock <= 20
                        ? "Needs restock"
                        : "Healthy"}
                    </span>

                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        status === "In Stock"
                          ? "from-emerald-500 to-green-500"
                          : status === "Low Stock"
                          ? "from-yellow-500 to-orange-500"
                          : "from-red-500 to-rose-500"
                      } transition-all duration-700`}
                      style={{
                        width:
                          product.stock === 0
                            ? "2%"
                            : `${Math.min(
                                product.stock,
                                100
                              )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

        <p className="text-[10px] font-medium leading-4 text-slate-400 sm:text-xs">
          Inventory data saved locally
        </p>

        <span className="w-fit rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          Live Status
        </span>

      </div>

    </div>
  );
}