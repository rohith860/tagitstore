import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Plus,
  ArrowRight,
  UserPlus,
  BarChart3,
} from "lucide-react";

import { db } from "../firebase";

import ProfileCard from "../components/profile/ProfileCard";
import RevenueChart from "../components/charts/RevenueChart";
import OrdersTable from "../components/tables/OrdersTable";
import TopProducts from "../components/products/TopProducts";
import Analytics from "../components/analytics/Analytics";
import CustomerStats from "../components/customers/CustomerStats";
import RecentActivity from "../components/activity/RecentActivity";
import TeamMembers from "../components/team/TeamMembers";
import InventoryStatus from "../components/inventory/InventoryStatus";

interface DashboardStats {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        productsSnapshot,
        ordersSnapshot,
        customersSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "customers")),
      ]);

      let revenue = 0;

      ordersSnapshot.forEach((orderDoc) => {
        const data = orderDoc.data();

        const amount = Number(
          String(data.amount ?? "0")
            .replace(/[$,₹]/g, "")
            .trim()
        );

        if (!Number.isNaN(amount)) {
          revenue += amount;
        }
      });

      setStats({
        products: productsSnapshot.size,
        orders: ordersSnapshot.size,
        customers: customersSnapshot.size,
        revenue,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const generateReport = () => {
    try {
      const report = new jsPDF();

      report.setFontSize(20);
      report.text("TAGITStore Dashboard Report", 14, 20);

      report.setFontSize(10);
      report.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        14,
        28
      );

      autoTable(report, {
        startY: 36,
        head: [["Metric", "Value"]],
        body: [
          ["Total Products", String(stats.products)],
          ["Total Orders", String(stats.orders)],
          ["Total Customers", String(stats.customers)],
          ["Total Revenue", `$${stats.revenue.toLocaleString()}`],
        ],
      });

      report.save("TAGITStore-Dashboard-Report.pdf");
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  const viewDashboard = () => {
    const dashboardSection =
      document.getElementById("dashboard-overview");

    if (dashboardSection) {
      dashboardSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      id="dashboard-content"
      className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6"
    >
      {/* =====================================================
          WELCOME CARD
         ===================================================== */}
      <section className="mb-6">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 shadow-xl dark:border-indigo-500/20 sm:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                <span>🚀</span>
                Welcome back
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Welcome to TAGITStore!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Manage your products, orders, customers and
                business performance from one powerful
                dashboard.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/products";
                  }}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                >
                  Manage Products
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/orders";
                  }}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View Orders
                </button>

                <button
                  type="button"
                  onClick={viewDashboard}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View Dashboard
                </button>
              </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-3 rounded-2xl border border-white/10" />

                <span className="relative text-6xl drop-shadow-lg">
                  🛍️
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DASHBOARD OVERVIEW
         ===================================================== */}
      <section
        id="dashboard-overview"
        className="mb-6 scroll-mt-6"
      >
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor your store performance and activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={generateReport}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Products
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : stats.products.toLocaleString()}
                </h3>

                <p className="mt-2 text-sm font-medium text-emerald-500">
                  +12.5%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Orders
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : stats.orders.toLocaleString()}
                </h3>

                <p className="mt-2 text-sm font-medium text-emerald-500">
                  +8.2%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-500/10">
                <ShoppingCart className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Customers
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : stats.customers.toLocaleString()}
                </h3>

                <p className="mt-2 text-sm font-medium text-emerald-500">
                  +5.7%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/10">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Revenue
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : `$${stats.revenue.toLocaleString()}`}
                </h3>

                <p className="mt-2 text-sm font-medium text-emerald-500">
                  +14.8%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS + PROFILE
         ===================================================== */}
      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Access important store actions quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* PURPLE / INDIGO */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/products";
              }}
              className="group rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-purple-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                  <Plus className="h-6 w-6 text-white" />
                </div>

                <ArrowRight className="h-5 w-5 text-indigo-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 text-base font-bold text-indigo-900 dark:text-indigo-200">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-indigo-700/70 dark:text-indigo-300/70">
                Create and manage new products.
              </p>
            </button>

            {/* BLUE / CYAN */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/orders";
              }}
              className="group rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-cyan-500/20 dark:from-cyan-500/10 dark:to-blue-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 shadow-lg shadow-cyan-600/20">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>

                <ArrowRight className="h-5 w-5 text-cyan-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 text-base font-bold text-cyan-900 dark:text-cyan-200">
                View Orders
              </h3>

              <p className="mt-1 text-sm text-cyan-700/70 dark:text-cyan-300/70">
                Check and manage customer orders.
              </p>
            </button>

            {/* GREEN / EMERALD */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/customers";
              }}
              className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-green-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>

                <ArrowRight className="h-5 w-5 text-emerald-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 text-base font-bold text-emerald-900 dark:text-emerald-200">
                Add Customer
              </h3>

              <p className="mt-1 text-sm text-emerald-700/70 dark:text-emerald-300/70">
                Add and manage customer accounts.
              </p>
            </button>

            {/* ORANGE / AMBER */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/analytics";
              }}
              className="group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-orange-500/20 dark:from-orange-500/10 dark:to-amber-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 shadow-lg shadow-orange-600/20">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>

                <ArrowRight className="h-5 w-5 text-orange-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 text-base font-bold text-orange-900 dark:text-orange-200">
                View Analytics
              </h3>

              <p className="mt-1 text-sm text-orange-700/70 dark:text-orange-300/70">
                Analyze your store performance.
              </p>
            </button>
          </div>
        </div>

        <ProfileCard />
      </section>

      {/* =====================================================
          REVENUE CHART
         ===================================================== */}
      <section className="mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Revenue performance from your orders.
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>

          <RevenueChart />
        </div>
      </section>

      {/* =====================================================
          ORDERS + TOP PRODUCTS
         ===================================================== */}
      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OrdersTable />
        <TopProducts />
      </section>

      {/* =====================================================
          ANALYTICS + CUSTOMER STATS
         ===================================================== */}
      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Analytics />
        <CustomerStats />
      </section>

      {/* =====================================================
          RECENT ACTIVITY
         ===================================================== */}
      <section className="mb-6">
        <RecentActivity />
      </section>

      {/* =====================================================
          TEAM MEMBERS + INVENTORY
         ===================================================== */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TeamMembers />
        <InventoryStatus />
      </section>
    </div>
  );
}