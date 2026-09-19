import { useState } from "react";
import {
  Bell,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Info,
  Check,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
  iconClass: string;
  dotClass: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order #1045 has been placed.",
    icon: <ShoppingBag className="h-5 w-5" />,
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    dotClass: "bg-blue-500",
    read: false,
  },
  {
    id: 2,
    title: "Payment Successful",
    message: "$2,450 payment received.",
    icon: <CheckCircle className="h-5 w-5" />,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
    read: true,
  },
  {
    id: 3,
    title: "Low Stock Alert",
    message: "Wireless Mouse stock is low.",
    icon: <AlertTriangle className="h-5 w-5" />,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    dotClass: "bg-amber-500",
    read: false,
  },
  {
    id: 4,
    title: "System Update",
    message: "Dashboard updated successfully.",
    icon: <Info className="h-5 w-5" />,
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
    dotClass: "bg-violet-500",
    read: false,
  },
];

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <div className="mt-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/30 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recent activity
            </p>
          </div>
        </div>

        {/* New Count */}
        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Notification Items */}
      <div>
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => markAsRead(notification.id)}
            className={`flex w-full items-start gap-4 border-b border-slate-100 px-5 py-4 text-left transition-colors duration-200 last:border-b-0 dark:border-slate-800 ${
              notification.read
                ? "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                : "bg-blue-50/30 hover:bg-blue-50/60 dark:bg-blue-950/10 dark:hover:bg-blue-950/20"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notification.iconClass}`}
            >
              {notification.icon}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={`truncate text-sm ${
                    notification.read
                      ? "font-semibold text-slate-700 dark:text-slate-300"
                      : "font-bold text-slate-900 dark:text-white"
                  }`}
                >
                  {notification.title}
                </h3>

                <span
                  className={`shrink-0 text-xs font-semibold ${
                    notification.read
                      ? "text-slate-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {notification.read ? "Read" : "Unread"}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {notification.message}
              </p>
            </div>

            {/* Status */}
            {notification.read ? (
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : (
              <span
                className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${notification.dotClass}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-4 text-center dark:border-slate-700">
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="text-sm font-bold text-blue-600 transition-colors hover:text-violet-600 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-blue-400 dark:hover:text-violet-400"
        >
          {unreadCount === 0
            ? "All notifications read"
            : "Mark all as read"}
        </button>
      </div>
    </div>
  );
}

