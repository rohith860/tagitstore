import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Package,
  X,
  Image as ImageIcon,
} from "lucide-react";

import ProductStats from "../components/products/ProductStats";
import toast from "react-hot-toast";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: string;
  rating: number;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const emptyProduct: Product = {
    id: "",
    name: "",
    price: "",
    category: "",
    stock: "In Stock",
    rating: 5,
    image: "",
  };

  const [formData, setFormData] =
    useState<Product>(emptyProduct);

  const [newProduct, setNewProduct] =
    useState<Product>(emptyProduct);

  // -------------------------
  // LOAD PRODUCTS
  // -------------------------

  const loadProducts = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "products")
      );

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }));

      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // -------------------------
  // SEARCH & FILTERING
  // -------------------------

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products.map((product) => product.category)
      )
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    const matchesStock =
      stockFilter === "All" ||
      product.stock === stockFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStock
    );
  });

  // -------------------------
  // STOCK STYLE
  // -------------------------

  const getStockStyle = (stock: string) => {
    const status = stock.toLowerCase();

    if (status === "in stock") {
      return {
        container:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
        icon: "text-green-600 dark:text-green-400",
      };
    }

    if (status === "low stock") {
      return {
        container:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
        icon: "text-orange-600 dark:text-orange-400",
      };
    }

    return {
      container:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      icon: "text-red-600 dark:text-red-400",
    };
  };

  // -------------------------
  // EDIT
  // -------------------------

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  // -------------------------
  // SAVE EDIT
  // -------------------------

  const saveEdit = async () => {
    if (!editingProduct) return;

    if (
      formData.name.trim() === "" ||
      formData.price.trim() === "" ||
      formData.category.trim() === "" ||
      formData.image.trim() === ""
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    if (
      formData.rating < 1 ||
      formData.rating > 5
    ) {
      toast.error("Rating must be between 1 and 5!");
      return;
    }

    try {
      await updateDoc(
        doc(db, "products", editingProduct.id),
        {
          name: formData.name,
          price: formData.price,
          category: formData.category,
          stock: formData.stock,
          rating: formData.rating,
          image: formData.image,
        }
      );

      await loadProducts();

      setEditingProduct(null);

      toast.success("Product Updated!");
    } catch (err) {
      console.error(err);
      toast.error("Update Failed!");
    }
  };

  // -------------------------
  // DELETE
  // -------------------------

  const handleDelete = async (id: string) => {
    const product = products.find(
      (p) => p.id === id
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product?.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));

      await loadProducts();

      toast.success("Product Deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Delete Failed!");
    }
  };

  // -------------------------
  // ADD PRODUCT
  // -------------------------

  const handleAddProduct = async () => {
    if (
      newProduct.name.trim() === "" ||
      newProduct.price.trim() === "" ||
      newProduct.category.trim() === "" ||
      newProduct.image.trim() === ""
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    if (
      newProduct.rating < 1 ||
      newProduct.rating > 5
    ) {
      toast.error("Rating must be between 1 and 5!");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        rating: newProduct.rating,
        image: newProduct.image,
      });

      await loadProducts();

      setShowAddModal(false);
      setNewProduct(emptyProduct);

      toast.success("Product Added Successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
    }
  };

  // -------------------------
  // CLOSE MODALS
  // -------------------------

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProduct(emptyProduct);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
  };

  // -------------------------
  // INPUT STYLES
  // -------------------------

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20";

  const labelClass =
    "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

  const modalInputClass =
    `${inputClass} text-sm sm:text-base`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-4 sm:p-6 lg:p-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">

      {/* PRODUCT STATS */}

      <ProductStats
        total={products.length}
        inStock={
          products.filter(
            (p) =>
              p.stock.toLowerCase() === "in stock"
          ).length
        }
        lowStock={
          products.filter(
            (p) =>
              p.stock.toLowerCase() === "low stock"
          ).length
        }
        categories={
          new Set(
            products.map((p) => p.category)
          ).size
        }
      />

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            Products
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your products easily.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* SEARCH & FILTERS */}

      <div className="bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-4 sm:p-5 mb-10 backdrop-blur-sm">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

          {/* SEARCH */}

          <div className="relative sm:col-span-2 lg:col-span-6">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={20}
            />

            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className={`${inputClass} pl-12 py-3.5`}
            />

          </div>

          {/* CATEGORY */}

          <div className="lg:col-span-2">

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className={`${inputClass} py-3.5`}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category === "All"
                    ? "All Categories"
                    : category}
                </option>
              ))}
            </select>

          </div>

          {/* STOCK */}

          <div className="lg:col-span-2">

            <select
              value={stockFilter}
              onChange={(e) =>
                setStockFilter(e.target.value)
              }
              className={`${inputClass} py-3.5`}
            >
              <option value="All">
                All Stock
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>

          </div>

          {/* CLEAR FILTERS */}

          <div className="lg:col-span-2">

            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setStockFilter("All");
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 px-4 py-3.5 rounded-xl font-semibold transition"
            >
              <X size={18} />
              Clear Filters
            </button>

          </div>

        </div>

        {/* FILTER INFO */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {products.length}
            </span>{" "}
            products
          </p>

          {(searchTerm ||
            categoryFilter !== "All" ||
            stockFilter !== "All") && (
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Filters applied
            </p>
          )}

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="flex justify-center items-center h-80">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-indigo-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Loading products...
            </p>

          </div>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">

          {/* NO PRODUCTS */}

          {filteredProducts.length === 0 ? (

            <div className="col-span-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-700">

              <Package
                size={60}
                className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
              />

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                No Products Found
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {searchTerm ||
                categoryFilter !== "All" ||
                stockFilter !== "All"
                  ? "Try changing your search or filters."
                  : 'Click "Add Product" to create your first product.'}
              </p>

            </div>

          ) : (

            filteredProducts.map((product) => {

              const stockStyle =
                getStockStyle(product.stock);

              return (

                <div
                  key={product.id}
                  className="group bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300"
                >

                  {/* IMAGE */}

                  <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-100 dark:bg-slate-900">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />

                    {/* STOCK BADGE */}

                    <div
                      className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border text-xs font-semibold ${stockStyle.container}`}
                    >
                      {product.stock}
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="p-5 sm:p-6">

                    <p className="text-xs uppercase tracking-wider font-semibold text-indigo-500 dark:text-indigo-400 mb-2">
                      {product.category}
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate">
                      {product.name}
                    </h2>

                    <div className="flex items-center justify-between gap-3 mt-4">

                      <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {product.price}
                      </span>

                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-2.5 py-1 rounded-lg">

                        <Star
                          size={16}
                          className="text-yellow-500"
                          fill="currentColor"
                        />

                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {product.rating}
                        </span>

                      </div>

                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">

                      <div className="flex items-center gap-2">

                        <Package
                          size={18}
                          className={stockStyle.icon}
                        />

                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Inventory
                        </span>

                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          product.stock.toLowerCase() ===
                          "in stock"
                            ? "text-green-600 dark:text-green-400"
                            : product.stock.toLowerCase() ===
                              "low stock"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {product.stock}
                      </span>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                      <button
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <Edit size={17} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              );
            })

          )}

        </div>

      )}

      {/* ================================================= */}
      {/* EDIT PRODUCT MODAL */}
      {/* ================================================= */}

      {editingProduct && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeEditModal();
            }
          }}
        >

          <div className="w-full max-w-3xl max-h-[96vh] sm:max-h-[94vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">

            {/* MODAL HEADER */}

            <div className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-700">

              <div className="min-w-0">

                <div className="flex items-center gap-3">

                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 items-center justify-center shrink-0">

                    <Edit
                      size={19}
                      className="text-indigo-600 dark:text-indigo-400"
                    />

                  </div>

                  <div className="min-w-0">

                    <h2 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
                      Edit Product
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
                      Update your product information
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={closeEditModal}
                aria-label="Close edit product modal"
                className="shrink-0 p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="overflow-y-auto overscroll-contain">

              <div className="p-4 sm:p-6 lg:p-8">

                {/* IMAGE PREVIEW */}

                <div className="mb-6">

                  <div className="flex items-center justify-between gap-3 mb-2">

                    <label className={labelClass}>
                      Product Image
                    </label>

                    {formData.image && (
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        Live Preview
                      </span>
                    )}

                  </div>

                  <div className="relative w-full h-44 sm:h-52 lg:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">

                    {formData.image ? (

                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                          e.currentTarget.parentElement
                            ?.classList.add(
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                        }}
                      />

                    ) : (

                      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">

                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">

                          <ImageIcon size={30} />

                        </div>

                        <span className="text-sm mt-3">
                          Image preview
                        </span>

                      </div>

                    )}

                  </div>

                </div>

                {/* FORM */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                  {/* PRODUCT NAME */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Product Name
                    </label>

                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                      className={modalInputClass}
                    />

                  </div>

                  {/* PRICE */}

                  <div>

                    <label className={labelClass}>
                      Price
                    </label>

                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      placeholder="e.g. $1299"
                      className={modalInputClass}
                    />

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label className={labelClass}>
                      Category
                    </label>

                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. Electronics"
                      className={modalInputClass}
                    />

                  </div>

                  {/* STOCK */}

                  <div>

                    <label className={labelClass}>
                      Stock Status
                    </label>

                    <select
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: e.target.value,
                        })
                      }
                      className={modalInputClass}
                    >
                      <option value="In Stock">
                        In Stock
                      </option>

                      <option value="Low Stock">
                        Low Stock
                      </option>

                      <option value="Out of Stock">
                        Out of Stock
                      </option>
                    </select>

                  </div>

                  {/* RATING */}

                  <div>

                    <label className={labelClass}>
                      Rating
                    </label>

                    <div className="relative">

                      <Star
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none"
                        fill="currentColor"
                      />

                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rating: Number(
                              e.target.value
                            ),
                          })
                        }
                        className={`${modalInputClass} pl-11`}
                      />

                    </div>

                  </div>

                  {/* IMAGE URL */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Image URL
                    </label>

                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://example.com/product.jpg"
                      className={modalInputClass}
                    />

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Paste a direct image URL to update the preview.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40">

              <div className="flex flex-col-reverse sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-full sm:flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <Edit size={17} />
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ================================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddModal();
            }
          }}
        >

          <div className="w-full max-w-3xl max-h-[96vh] sm:max-h-[94vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">

            {/* MODAL HEADER */}

            <div className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-700">

              <div className="min-w-0">

                <div className="flex items-center gap-3">

                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 items-center justify-center shrink-0">

                    <Plus
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />

                  </div>

                  <div className="min-w-0">

                    <h2 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
                      Add Product
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
                      Add a new product to your inventory
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={closeAddModal}
                aria-label="Close add product modal"
                className="shrink-0 p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="overflow-y-auto overscroll-contain">

              <div className="p-4 sm:p-6 lg:p-8">

                {/* IMAGE PREVIEW */}

                <div className="mb-6">

                  <div className="flex items-center justify-between gap-3 mb-2">

                    <label className={labelClass}>
                      Product Image
                    </label>

                    {newProduct.image && (
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        Live Preview
                      </span>
                    )}

                  </div>

                  <div className="relative w-full h-44 sm:h-52 lg:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">

                    {newProduct.image ? (

                      <img
                        src={newProduct.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                          e.currentTarget.parentElement
                            ?.classList.add(
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                        }}
                      />

                    ) : (

                      <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">

                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">

                          <ImageIcon size={30} />

                        </div>

                        <span className="text-sm mt-3 text-center px-4">
                          Image preview will appear here
                        </span>

                      </div>

                    )}

                  </div>

                </div>

                {/* FORM */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                  {/* PRODUCT NAME */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Product Name
                    </label>

                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                      className={modalInputClass}
                    />

                  </div>

                  {/* PRICE */}

                  <div>

                    <label className={labelClass}>
                      Price
                    </label>

                    <input
                      type="text"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: e.target.value,
                        })
                      }
                      placeholder="e.g. $1299"
                      className={modalInputClass}
                    />

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label className={labelClass}>
                      Category
                    </label>

                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. Electronics"
                      className={modalInputClass}
                    />

                  </div>

                  {/* STOCK */}

                  <div>

                    <label className={labelClass}>
                      Stock Status
                    </label>

                    <select
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock: e.target.value,
                        })
                      }
                      className={modalInputClass}
                    >
                      <option value="In Stock">
                        In Stock
                      </option>

                      <option value="Low Stock">
                        Low Stock
                      </option>

                      <option value="Out of Stock">
                        Out of Stock
                      </option>
                    </select>

                  </div>

                  {/* RATING */}

                  <div>

                    <label className={labelClass}>
                      Rating
                    </label>

                    <div className="relative">

                      <Star
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none"
                        fill="currentColor"
                      />

                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={newProduct.rating}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            rating: Number(
                              e.target.value
                            ),
                          })
                        }
                        className={`${modalInputClass} pl-11`}
                      />

                    </div>

                  </div>

                  {/* IMAGE URL */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Image URL
                    </label>

                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://example.com/product.jpg"
                      className={modalInputClass}
                    />

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Paste a direct image URL to preview your product image.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40">

              <div className="flex flex-col-reverse sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={closeAddModal}
                  className="w-full sm:flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <Plus size={18} />
                  Add Product
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

