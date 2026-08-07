import StatCard from "./components/cards/StatCard";
import { FaDollarSign, FaShoppingCart, FaUsers, FaCube } from "react-icons/fa";

import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import RecentActivity from "./components/activity/RecentActivity";
import RevenueChart from "./components/charts/RevenueChart";
import Analytics from "./components/analytics/Analytics";
import OrdersTable from "./components/tables/OrdersTable";
import TopProducts from "./components/products/TopProducts";
import CustomerStats from "./components/customers/CustomerStats";
import QuickActions from "./components/quickactions/QuickActions";
import NotificationsPanel from "./components/notifications/NotificationsPanel";
import ProfileCard from "./components/profile/ProfileCard";
import TeamMembers from "./components/team/TeamMembers";
import InventoryStatus from "./components/inventory/InventoryStatus";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const generateReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("TAGITStore Dashboard Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Metric", "Value"]],
    body: [
      ["Revenue", "$84,500"],
      ["Orders", "1,284"],
      ["Customers", "8,420"],
      ["Products", "624"],
    ],
  });

  doc.save("TAGITStore_Report.pdf");
};
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Navbar */}
        <Navbar />

        {/* Welcome Card */}
        <div className="mt-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
  Welcome to TAGITStore 🚀
</h1>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
  Smart Inventory & Business Management Dashboard
</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
  onClick={() => {
    document.getElementById("dashboard-stats")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
>
  View Dashboard
</button>

            <button
  onClick={generateReport}
  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
>
  Generate Report
</button>
          </div>
        </div>
       <div
  id="dashboard-stats"
  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10"
>
  <StatCard
    title="Revenue"
    value="$84,500"
    growth="+18%"
    icon={<FaDollarSign />}
    gradient="bg-gradient-to-r from-cyan-500 to-blue-600"
  />

  <StatCard
    title="Orders"
    value="1,284"
    growth="+12%"
    icon={<FaShoppingCart />}
    gradient="bg-gradient-to-r from-purple-500 to-pink-500"
  />

  <StatCard
    title="Customers"
    value="8,420"
    growth="+24%"
    icon={<FaUsers />}
    gradient="bg-gradient-to-r from-green-500 to-emerald-600"
  />

  <StatCard
    title="Products"
    value="624"
    growth="+9%"
    icon={<FaCube />}
    gradient="bg-gradient-to-r from-orange-500 to-red-500"
  />
</div>
     <RecentActivity />
     <RevenueChart />
     <Analytics />
     <OrdersTable />
     <TopProducts />
     <CustomerStats />
     <QuickActions />
     <NotificationsPanel />
     <ProfileCard />
     <TeamMembers />
     <InventoryStatus />

      </main>
    </div>
  );
}

export default App;