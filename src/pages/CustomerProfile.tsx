import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  ArrowLeft,
  Star,
} from "lucide-react";

const customers = [
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

export default function CustomerProfile() {
  const { id } = useParams();

  const customer = customers.find((c) => c.id === Number(id));

  if (!customer) {
    return (
      <div className="p-10 text-center text-2xl">
        Customer Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 p-10">

      <Link
        to="/customers"
        className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-8"
      >
        <ArrowLeft />
        Back to Customers
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex flex-col md:flex-row gap-8 items-center">

          <img
            src={customer.image}
            alt={customer.name}
            className="w-48 h-48 rounded-full object-cover border-8 border-indigo-100"
          />

          <div>

            <h1 className="text-5xl font-bold">
              {customer.name}
            </h1>

            <span className="inline-block mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
              {customer.status}
            </span>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">
                <Mail />
                {customer.email}
              </div>

              <div className="flex items-center gap-3">
                <Phone />
                {customer.phone}
              </div>

              <div className="flex items-center gap-3">
                <ShoppingBag />
                {customer.orders} Orders
              </div>

              <div className="flex items-center gap-3">
                <DollarSign />
                {customer.spent}
              </div>

            </div>

          </div>

        </div>

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            Recent Orders
          </h2>

          <div className="space-y-4">

            <div className="bg-slate-100 rounded-xl p-5 flex justify-between">
              <span>Gaming Laptop</span>
              <Star className="text-yellow-500" />
            </div>

            <div className="bg-slate-100 rounded-xl p-5 flex justify-between">
              <span>Mechanical Keyboard</span>
              <Star className="text-yellow-500" />
            </div>

            <div className="bg-slate-100 rounded-xl p-5 flex justify-between">
              <span>Gaming Mouse</span>
              <Star className="text-yellow-500" />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}