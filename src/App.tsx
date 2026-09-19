import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import AnalyticsPage from "./pages/Analytics";
import CustomerProfile from "./pages/CustomerProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function PublicLayout() {
  return <Outlet />;
}

function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        <Navbar
          setMobileSidebarOpen={setMobileSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main
          className={`min-w-0 pt-16 transition-all duration-300 ${
            sidebarCollapsed
              ? "lg:ml-[76px]"
              : "lg:ml-64"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
      </Route>

      {/* PROTECTED DASHBOARD ROUTES */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/customers"
          element={<Customers />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/customer-profile"
          element={<CustomerProfile />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />
    </Routes>
  );
}