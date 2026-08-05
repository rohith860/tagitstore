import { useState } from "react";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const orders = [
  {
    id: "#1001",
    customer: "John Smith",
    product: "Gaming Laptop",
    amount: "$1,299",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "#1002",
    customer: "Emily Johnson",
    product: "Wireless Headphones",
    amount: "$249",
    status: "Pending",
    payment: "Pending",
  },
  {
    id: "#1003",
    customer: "Michael Brown",
    product: "Gaming Mouse",
    amount: "$89",
    status: "Shipped",
    payment: "Paid",
  },
  {
    id: "#1004",
    customer: "Sophia Wilson",
    product: "Mechanical Keyboard",
    amount: "$159",
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "#1005",
    customer: "David Miller",
    product: "Smart Watch",
    amount: "$399",
    status: "Completed",
    payment: "Paid",
  },
];

export default function Orders() {
  const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

 const filteredOrders = orders.filter(
  (order) => {

    const matchesSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());


    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;


    return matchesSearch && matchesStatus;

  }
);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-8">
      <h1 className="text-4xl font-bold text-slate-800">
        Orders
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Manage customer orders efficiently.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <CheckCircle className="text-green-600" size={32} />
          <h2 className="text-3xl font-bold mt-4">245</h2>
          <p className="text-slate-500">Completed</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <Clock className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-bold mt-4">34</h2>
          <p className="text-slate-500">Pending</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <Truck className="text-blue-600" size={32} />
          <h2 className="text-3xl font-bold mt-4">89</h2>
          <p className="text-slate-500">Shipped</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <XCircle className="text-red-600" size={32} />
          <h2 className="text-3xl font-bold mt-4">8</h2>
          <p className="text-slate-500">Cancelled</p>
        </div>
      </div>

      {/* Search */}
     <div className="flex flex-col md:flex-row gap-4 mb-8">


<div className="relative flex-1">

<Search
className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
size={20}
/>


<input
type="text"
placeholder="Search Orders..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full bg-white rounded-2xl border pl-12 py-4 pr-4 shadow-md outline-none focus:ring-2 focus:ring-indigo-500"
/>

</div>



<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
className="bg-white rounded-2xl border px-5 py-4 shadow-md outline-none"
>

<option value="All">
All Status
</option>

<option value="Completed">
Completed
</option>

<option value="Pending">
Pending
</option>

<option value="Shipped">
Shipped
</option>

<option value="Cancelled">
Cancelled
</option>

</select>


</div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-5">Order ID</th>
              <th className="text-left p-5">Customer</th>
              <th className="text-left p-5">Product</th>
              <th className="text-left p-5">Amount</th>
              <th className="text-left p-5">Status</th>
              <th className="text-left p-5">Payment</th>
              <th className="text-center p-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-5 font-semibold">{order.id}</td>
                <td className="p-5">{order.customer}</td>
                <td className="p-5">{order.product}</td>
                <td className="p-5 font-bold text-indigo-600">
                  {order.amount}
                </td>

                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-5">{order.payment}</td>

                <td className="p-5 text-center">
                  <button
  onClick={() => setSelectedOrder(order)}
  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
>
  <Eye size={18} />
</button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-8 text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
            {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Order Details
            </h2>

            <div className="space-y-3 text-slate-600">

              <p><b>Order ID:</b> {selectedOrder.id}</p>

              <p><b>Customer:</b> {selectedOrder.customer}</p>

              <p><b>Product:</b> {selectedOrder.product}</p>

              <p><b>Amount:</b> {selectedOrder.amount}</p>

              <p><b>Status:</b> {selectedOrder.status}</p>

              <p><b>Payment:</b> {selectedOrder.payment}</p>

            </div>


            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              Close
            </button>


          </div>

        </div>
      )}

    </div>
  );
}