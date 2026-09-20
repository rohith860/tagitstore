import { useEffect, useState } from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Store,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Products",
    icon: Package,
    path: "/products",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    name: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  image: string;
}

const PROFILE_STORAGE_KEY =
  "tagit_profile";

const PROFILE_UPDATED_EVENT =
  "tagit-profile-updated";

const defaultProfile: ProfileData = {
  name: "Admin",
  role: "Administrator",
  email: "admin@tagitstore.com",
  phone: "+91 98765 43210",
  location: "Chennai, India",
  joined: "January 2026",
  image: "",
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE STATE
  // =====================================================

  const [profile, setProfile] =
    useState<ProfileData>(
      defaultProfile
    );

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile =
          localStorage.getItem(
            PROFILE_STORAGE_KEY
          );

        if (savedProfile) {
          const parsedProfile =
            JSON.parse(savedProfile);

          setProfile({
            ...defaultProfile,
            ...parsedProfile,
          });
        } else {
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error(
          "Sidebar profile loading error:",
          error
        );
      }
    };

    loadProfile();

    // ===================================================
    // SAME TAB PROFILE UPDATE
    // ===================================================

    const handleProfileUpdated = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<ProfileData>;

      if (customEvent.detail) {
        setProfile({
          ...defaultProfile,
          ...customEvent.detail,
        });
      } else {
        loadProfile();
      }
    };

    // ===================================================
    // CROSS TAB PROFILE UPDATE
    // ===================================================

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
        PROFILE_STORAGE_KEY
      ) {
        loadProfile();
      }
    };

    window.addEventListener(
      PROFILE_UPDATED_EVENT,
      handleProfileUpdated
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        PROFILE_UPDATED_EVENT,
        handleProfileUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =====================================================
  // PROFILE INITIALS
  // =====================================================

  const getInitials = () => {
    const name =
      profile.name.trim();

    if (!name) {
      return "A";
    }

    return name
      .split(/\s+/)
      .map(
        (part) => part[0] || ""
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      // Firebase logout
      await signOut(auth);

      // Remove old local auth flag if it exists
      localStorage.removeItem(
        "isLoggedIn"
      );

      // Close mobile sidebar
      setMobileOpen(false);

      // Go to login
      navigate("/login", {
        replace: true,
      });

      console.log(
        "✅ Successfully logged out"
      );
    } catch (error) {
      console.error(
        "❌ Logout failed:",
        error
      );
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const handleProfileClick = () => {
    setMobileOpen(false);
    navigate("/settings");
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
         ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          lg:hidden

          dark:bg-black/60

          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={() =>
          setMobileOpen(false)
        }
        aria-hidden="true"
      />

      {/* =====================================================
          SIDEBAR
         ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-slate-200
          bg-white
          text-slate-900
          shadow-xl
          shadow-slate-900/10
          transition-all
          duration-300

          dark:border-slate-800
          dark:bg-slate-950
          dark:text-white
          dark:shadow-black/30

          ${
            collapsed
              ? "w-[76px]"
              : "w-64"
          }

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* ===================================================
            HEADER
           =================================================== */}

        <div
          className="
            relative
            flex
            h-20
            shrink-0
            items-center
            border-b
            border-slate-200
            px-4

            dark:border-slate-800
          "
        >
          {/* BRAND */}

          <button
            type="button"
            onClick={() => {
              navigate("/");
              setMobileOpen(false);
            }}
            className={`
              flex
              w-full
              items-center

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }
            `}
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-violet-600
                shadow-lg
                shadow-blue-500/20
              "
            >
              <Store
                size={21}
                className="text-white"
              />
            </div>

            {!collapsed && (
              <div className="text-left">
                <p
                  className="
                    text-lg
                    font-black
                    tracking-tight
                    text-slate-900

                    dark:text-white
                  "
                >
                  TAGITStore
                </p>

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500

                    dark:text-slate-500
                  "
                >
                  Admin Panel
                </p>
              </div>
            )}
          </button>

          {/* =================================================
              DESKTOP COLLAPSE BUTTON
             ================================================= */}

          <button
            type="button"
            onClick={() =>
              setCollapsed(
                (value) => !value
              )
            }
            className="
              absolute
              -right-3
              top-[26px]
              hidden
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-lg
              transition-all
              duration-200
              hover:border-blue-500/40
              hover:bg-blue-600
              hover:text-white

              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300

              lg:flex
            "
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <ChevronRight
                size={16}
              />
            ) : (
              <ChevronLeft
                size={16}
              />
            )}
          </button>

          {/* =================================================
              MOBILE CLOSE BUTTON
             ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-slate-500
              transition-all
              duration-200
              hover:border-red-400/30
              hover:bg-red-50
              hover:text-red-500

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-400
              dark:hover:bg-red-500/10
              dark:hover:text-red-400

              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* ===================================================
            MENU
           =================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            py-6
          "
        >
          {!collapsed && (
            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-400

                dark:text-slate-500
              "
            >
              Main Menu
            </p>
          )}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={
                    handleNavigation
                  }
                  title={
                    collapsed
                      ? item.name
                      : undefined
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      group
                      relative
                      flex
                      h-11
                      w-full
                      items-center
                      rounded-xl
                      text-sm
                      font-semibold
                      transition-all
                      duration-200

                      ${
                        collapsed
                          ? "justify-center"
                          : "gap-3 px-3.5"
                      }

                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-blue-600
                            to-indigo-600
                            text-white
                            shadow-lg
                            shadow-blue-600/20
                          `
                          : `
                            text-slate-600
                            hover:bg-slate-100
                            hover:text-slate-900

                            dark:text-slate-400
                            dark:hover:bg-slate-900
                            dark:hover:text-white
                          `
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            h-6
                            w-1
                            rounded-r-full
                            bg-cyan-300
                          "
                        />
                      )}

                      <Icon
                        size={19}
                        className={`
                          shrink-0
                          transition-transform
                          duration-200

                          ${
                            isActive
                              ? "text-white"
                              : `
                                text-slate-400
                                group-hover:text-blue-600

                                dark:text-slate-500
                                dark:group-hover:text-blue-400
                              `
                          }
                        `}
                      />

                      {!collapsed && (
                        <span>
                          {item.name}
                        </span>
                      )}

                      {/* =================================================
                          COLLAPSED TOOLTIP
                         ================================================= */}

                      {collapsed && (
                        <span
                          className="
                            pointer-events-none
                            absolute
                            left-[68px]
                            z-[100]
                            whitespace-nowrap
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-900
                            opacity-0
                            shadow-xl
                            transition-opacity
                            duration-200
                            group-hover:opacity-100

                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-white
                          "
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ===================================================
            BOTTOM SECTION
           =================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-slate-200
            p-3

            dark:border-slate-800
          "
        >
          {/* =================================================
              ADMIN PROFILE
             ================================================= */}

          <button
            type="button"
            onClick={
              handleProfileClick
            }
            className={`
              group
              mb-2
              flex
              w-full
              items-center
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              transition-all
              duration-200
              hover:border-blue-500/30
              hover:bg-white

              dark:border-slate-800
              dark:bg-slate-900/70
              dark:hover:bg-slate-900

              ${
                collapsed
                  ? "justify-center p-2"
                  : "gap-3 p-3"
              }
            `}
            title={
              collapsed
                ? `${profile.name} - ${profile.role}`
                : undefined
            }
          >
            {/* PROFILE IMAGE */}

            <div className="relative shrink-0">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500
                  to-violet-600
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-500/10
                "
              >
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={`${profile.name} profile`}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <span>
                    {getInitials()}
                  </span>
                )}
              </div>

              {/* ONLINE INDICATOR */}

              <span
                className="
                  absolute
                  -bottom-0.5
                  -right-0.5
                  h-3
                  w-3
                  rounded-full
                  border-2
                  border-white
                  bg-emerald-400
                  shadow-lg
                  shadow-emerald-400/40

                  dark:border-slate-900
                "
              />
            </div>

            {/* PROFILE DETAILS */}

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    {profile.name}
                  </p>

                  <p
                    className="
                      truncate
                      text-xs
                      font-medium
                      text-slate-500

                      dark:text-slate-500
                    "
                  >
                    {profile.role}
                  </p>
                </div>

                <span
                  className="
                    ml-auto
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    bg-emerald-400
                    shadow-lg
                    shadow-emerald-400/50
                  "
                />
              </>
            )}
          </button>

          {/* =================================================
              LOGOUT
             ================================================= */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className={`
              group
              relative
              flex
              h-11
              w-full
              items-center
              rounded-xl
              text-sm
              font-semibold
              text-slate-500
              transition-all
              duration-200
              hover:bg-red-50
              hover:text-red-500

              dark:text-slate-400
              dark:hover:bg-red-500/10
              dark:hover:text-red-400

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3 px-3.5"
              }
            `}
            title={
              collapsed
                ? "Logout"
                : undefined
            }
          >
            <LogOut
              size={19}
              className="
                shrink-0
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />

            {!collapsed && (
              <span>
                Logout
              </span>
            )}

            {collapsed && (
              <span
                className="
                  pointer-events-none
                  absolute
                  left-[68px]
                  z-[100]
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-slate-900
                  opacity-0
                  shadow-xl
                  transition-opacity
                  duration-200
                  group-hover:opacity-100

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}