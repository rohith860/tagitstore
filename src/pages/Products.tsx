import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Package,
} from "lucide-react";

import ProductStats from "../components/products/ProductStats";
import toast from "react-hot-toast";
//import ClipLoader from "react-spinners/ClipLoader";

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
  const [loading, setLoading] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

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
  // SEARCH
  // -------------------------

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
    const confirmDelete = window.confirm(
  `Are you sure you want to delete "${products.find(p => p.id === id)?.name}"?`
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

if (newProduct.rating < 1 || newProduct.rating > 5) {
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
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-8">

       <ProductStats
  total={products.length}
  inStock={
    products.filter((p) => p.stock.toLowerCase() === "in stock").length
  }
  lowStock={
    products.filter((p) => p.stock.toLowerCase() !== "in stock").length
  }
  categories={
    new Set(products.map((p) => p.category)).size
  }
/>



      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Products
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your products easily.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* Search */}

      <div className="relative mb-10">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border bg-white pl-12 pr-5 py-4 shadow-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />

      </div>

      {/* Loading */}

      {loading ? (

        <div className="flex justify-center items-center h-80">
          <p>Loading...</p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filteredProducts.length === 0 ? (

  <div className="col-span-full bg-white rounded-3xl shadow-xl p-12 text-center">

    <Package
      size={60}
      className="mx-auto text-gray-400 mb-4"
    />

    <h2 className="text-2xl font-bold">
      No Products Found
    </h2>

    <p className="text-gray-500 mt-2">
      Click "Add Product" to create your first product.
    </p>

  </div>

) : (

  filteredProducts.map((product) => (
  

            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition duration-300"
            >

              <img
  src={product.image}
  alt={product.name}
  className="w-full h-56 object-cover"
  onError={(e) => {
    e.currentTarget.src =
      "https://placehold.co/600x400?text=No+Image";
  }}
/>

              <div className="p-6">

                <h2 className="text-2xl font-bold text-slate-800">
                  {product.name}
                </h2>

                <p className="text-indigo-600 text-xl font-semibold mt-2">
                  {product.price}
                </p>

                <div className="flex justify-between mt-4">

                  <span className="text-slate-500">
                    {product.category}
                  </span>

                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    {product.rating}
                  </span>

                </div>

                <div className="flex items-center gap-2 mt-5">

                  <Package
                    className="text-green-600"
                    size={18}
                  />

                  <span className="font-medium text-green-600">
                    {product.stock}
                  </span>

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                  >
                    <Edit size={18} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))
      )}

        </div>

      )}
            {/* EDIT MODAL */}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold mb-5">
              Edit Product
            </h2>

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
            />

            <input
              type="number"
              step="0.1"
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Rating"
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: Number(e.target.value),
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-5"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.value,
                })
              }
            />

            <div className="flex gap-3">

              <button
                onClick={saveEdit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ADD PRODUCT MODAL */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Add Product
            </h2>

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category: e.target.value,
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: e.target.value,
                })
              }
            />

            <input
              type="number"
              step="0.1"
              className="w-full border rounded-xl p-3 mb-3"
              placeholder="Rating"
              value={newProduct.rating}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  rating: Number(e.target.value),
                })
              }
            />

            <input
              className="w-full border rounded-xl p-3 mb-5"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  image: e.target.value,
                })
              }
            />

            <div className="flex gap-3">

              <button
                onClick={handleAddProduct}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
              >
                Add Product
              </button>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProduct(emptyProduct);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}
          </div>
  );
}