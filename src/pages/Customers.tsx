import { useState } from "react";

import {
  Search,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Star,
  Trash2,
} from "lucide-react";

const initialCustomers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@gmail.com",
    phone: "+1 9876543210",
    orders: 24,
    spent: "$5,490",
    status: "Premium",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily@gmail.com",
    phone: "+1 9876543211",
    orders: 12,
    spent: "$2,180",
    status: "Regular",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@gmail.com",
    phone: "+1 9876543212",
    orders: 38,
    spent: "$9,420",
    status: "Premium",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 4,
    name: "Sophia Wilson",
    email: "sophia@gmail.com",
    phone: "+1 9876543213",
    orders: 8,
    spent: "$1,120",
    status: "New",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "David Miller",
    email: "david@gmail.com",
    phone: "+1 9876543214",
    orders: 19,
    spent: "$4,250",
    status: "Regular",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 6,
    name: "Olivia Taylor",
    email: "olivia@gmail.com",
    phone: "+1 9876543215",
    orders: 42,
    spent: "$12,350",
    status: "Premium",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
  },
];

export default function Customers() {

    const [customers, setCustomers] = useState(initialCustomers);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter((customer) =>
  customer.name.toLowerCase().includes(search.toLowerCase())
  );

    const handleDelete = (id:number)=>{

    const confirmDelete =
      window.confirm(
        "Delete this customer?"
      );


    if(confirmDelete){

      setCustomers(
        customers.filter(
          (customer)=>customer.id !== id
        )
      );

    }

  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-8">
      <h1 className="text-4xl font-bold text-slate-800">
        Customers
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Manage your customers efficiently.
      </p>

      <div className="relative mb-10">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white rounded-2xl shadow-md border pl-12 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  {customer.name}
                </h2>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    customer.status === "Premium"
                      ? "bg-yellow-100 text-yellow-700"
                      : customer.status === "Regular"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-indigo-600" size={18} />
                <span>{customer.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-green-600" size={18} />
                <span>{customer.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <ShoppingBag className="text-purple-600" size={18} />
                <span>{customer.orders} Orders</span>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="text-orange-600" size={18} />
                <span>{customer.spent}</span>
              </div>
            </div>
              <div className="flex gap-3 mt-6">

<button
onClick={() => setSelectedCustomer(customer)}
className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
>
  <Star size={18}/>
  Profile
</button>


<button
className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-xl"
onClick={()=>handleDelete(customer.id)}
>
<Trash2 size={18}/>
</button>


</div>
            
          </div>
        ))}
      </div>
      
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Customer Profile
            </h2>


            <div className="space-y-3 text-slate-600">

              <p>
                <b>Name:</b> {selectedCustomer.name}
              </p>

              <p>
                <b>Email:</b> {selectedCustomer.email}
              </p>

              <p>
                <b>Phone:</b> {selectedCustomer.phone}
              </p>

              <p>
                <b>Orders:</b> {selectedCustomer.orders}
              </p>

              <p>
                <b>Spent:</b> {selectedCustomer.spent}
              </p>

              <p>
                <b>Status:</b> {selectedCustomer.status}
              </p>

            </div>


            <button
              onClick={() => setSelectedCustomer(null)}
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