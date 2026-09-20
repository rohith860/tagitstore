import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  Search,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

type NavbarProps = {
  setMobileSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
};

interface ProfileData {
  name: string;
  email: string;
  image: string;
}

interface SearchItem {
  title: string;
  description: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const PROFILE_STORAGE_KEY = "tagit_profile";

const PROFILE_UPDATED_EVENT =
  "tagit-profile-updated";

const searchItems: SearchItem[] = [
  {
    title: "Dashboard",
    description:
      "Store overview and business statistics",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    description:
      "Manage products and inventory",
    path: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    description:
      "Manage customer orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    description:
      "Manage customers and profiles",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    description:
      "View business performance",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    description:
      "Manage application settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    description:
      "Manage your administrator profile",
    path: "/profile",
    icon: User,
  },
];

export default function Navbar({
  setMobileSidebarOpen,
  sidebarCollapsed,
}: NavbarProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const searchContainerRef =
    useRef<HTMLDivElement>(null);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [profile, setProfile] =
    useState<ProfileData>({
      name: "Rohith.S",
      email: "rohithbecsc@gmail.com",
      image: "",
    });

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

        if (!savedProfile) {
          return;
        }

        const data = JSON.parse(savedProfile);

        setProfile({
          name: data.name || "Rohith.S",
          email:
            data.email ||
            "rohithbecsc@gmail.com",
          image: data.image || "",
        });
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    };

    loadProfile();

    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener(
      "storage",
      handleProfileUpdate
    );

    window.addEventListener(
      PROFILE_UPDATED_EVENT,
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleProfileUpdate
      );

      window.removeEventListener(
        PROFILE_UPDATED_EVENT,
        handleProfileUpdate
      );
    };
  }, []);

  // =====================================================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target as Node
        )
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (
      event: globalThis.KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  const filteredResults =
    searchQuery.trim()
      ? searchItems.filter((item) => {
          const query =
            searchQuery
              .trim()
              .toLowerCase();

          return (
            item.title
              .toLowerCase()
              .includes(query) ||
            item.description
              .toLowerCase()
              .includes(query)
          );
        })
      : [];

  // =====================================================
  // SEARCH RESULT CLICK
  // =====================================================

  const handleSearchResult = (
    path: string
  ) => {
    navigate(path);

    setSearchQuery("");
    setSearchOpen(false);
  };

  // =====================================================
  // SEARCH KEYBOARD
  // =====================================================

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (filteredResults.length > 0) {
        handleSearchResult(
          filteredResults[0].path
        );
      }
    }

    if (event.key === "Escape") {
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  // =====================================================
  // PROFILE INITIAL
  // =====================================================

  const profileInitial =
    profile.name
      .trim()
      .charAt(0)
      .toUpperCase() || "R";

  return (
    <header
      className={`
        fixed
        top-0
        right-0
        z-50
        h-16
        border-b
        border-slate-200
        bg-white/95
        text-slate-900
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300

        dark:border-slate-800/80
        dark:bg-slate-950/95
        dark:text-white
        dark:shadow-none

        ${
          sidebarCollapsed
            ? "left-[76px]"
            : "left-64"
        }
      `}
    >
      <div className="flex h-full w-full items-center px-4 sm:px-5">

        {/* =================================================
            MOBILE MENU
            ================================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileSidebarOpen(true)
          }
          className="
            mr-3
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            text-slate-600
            transition
            hover:bg-slate-100
            hover:text-slate-900

            dark:border-slate-700
            dark:bg-transparent
            dark:text-slate-300
            dark:hover:bg-slate-800
            dark:hover:text-white

            lg:hidden
          "
          aria-label="Open sidebar"
        >
          ☰
        </button>

        {/* =================================================
            BRAND
            ================================================= */}

        <div
          className="
            hidden
            w-[170px]
            shrink-0
            lg:block
          "
        >
          <h1
            className="
              text-sm
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            TAGITStore
          </h1>

          <p
            className="
              text-[10px]
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("enterpriseDashboard")}
          </p>
        </div>

        {/* =================================================
            SEARCH
            ================================================= */}

        <div
          ref={searchContainerRef}
          className="
            relative
            mx-3
            min-w-0
            flex-1
          "
        >
          <div
            className={`
              flex
              h-10
              w-full
              items-center
              rounded-xl
              border
              px-3
              transition-all
              duration-200

              ${
                searchOpen
                  ? `
                    border-indigo-500
                    bg-white
                    shadow-lg
                    shadow-indigo-500/10

                    dark:bg-slate-900
                  `
                  : `
                    border-slate-200
                    bg-slate-50
                    hover:border-slate-300

                    dark:border-slate-700
                    dark:bg-slate-900/70
                    dark:hover:border-slate-600
                  `
              }
            `}
          >
            <Search
              className={`
                mr-2
                h-4
                w-4
                shrink-0

                ${
                  searchOpen
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400"
                }
              `}
            />

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() =>
                setSearchOpen(true)
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
              placeholder={t("search")}
              className="
                min-w-0
                flex-1
                bg-transparent
                text-sm
                font-medium
                text-slate-900
                outline-none
                placeholder:text-slate-400

                dark:text-white
                dark:placeholder:text-slate-500
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");

                  searchInputRef.current?.focus();
                }}
                className="
                  ml-2
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-slate-500
                  transition
                  hover:bg-slate-200
                  hover:text-slate-900

                  dark:text-slate-400
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <span
              className="
                ml-2
                hidden
                shrink-0
                rounded-md
                border
                border-slate-200
                bg-white
                px-2
                py-1
                text-[9px]
                font-bold
                text-slate-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-400

                md:block
              "
            >
              Ctrl K
            </span>
          </div>

          {/* =================================================
              SEARCH DROPDOWN
              ================================================= */}

          {searchOpen &&
            searchQuery.trim() && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-12
                  z-[100]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl
                  shadow-slate-900/10

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/40
                "
              >
                {filteredResults.length > 0 ? (
                  <div className="max-h-[330px] overflow-y-auto p-2">
                    <div className="px-3 py-2">
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        Search results
                      </p>
                    </div>

                    {filteredResults.map(
                      (item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() =>
                              handleSearchResult(
                                item.path
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              p-3
                              text-left
                              transition
                              hover:bg-slate-100

                              dark:hover:bg-slate-800
                            "
                          >
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-50

                                dark:bg-indigo-500/10
                              "
                            >
                              <Icon
                                className="
                                  h-4
                                  w-4
                                  text-indigo-600

                                  dark:text-indigo-400
                                "
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-slate-900

                                  dark:text-white
                                "
                              >
                                {item.title}
                              </p>

                              <p
                                className="
                                  truncate
                                  text-xs
                                  text-slate-500

                                  dark:text-slate-400
                                "
                              >
                                {item.description}
                              </p>
                            </div>

                            <span
                              className="
                                text-slate-400
                                dark:text-slate-500
                              "
                            >
                              →
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <div
                      className="
                        mx-auto
                        mb-3
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100

                        dark:bg-slate-800
                      "
                    >
                      <Search
                        className="
                          h-5
                          w-5
                          text-slate-400

                          dark:text-slate-500
                        "
                      />
                    </div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-900

                        dark:text-white
                      "
                    >
                      No results found
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      Try another search
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1
            sm:gap-2
          "
        >

          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900

                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span
                className="
                  absolute
                  right-1
                  top-1
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                  ring-2
                  ring-white

                  dark:ring-slate-950
                "
              />
            </button>

            {/* Notification popup */}

            {notificationsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-[100]
                  w-[310px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl
                  shadow-slate-900/10

                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/40
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    px-4
                    py-3

                    dark:border-slate-800
                  "
                >
                  <h3
                    className="
                      text-sm
                      font-bold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    {t("notifications")}
                  </h3>

                  <span
                    className="
                      rounded-full
                      bg-indigo-50
                      px-2
                      py-1
                      text-[10px]
                      font-bold
                      text-indigo-600

                      dark:bg-indigo-500/10
                      dark:text-indigo-400
                    "
                  >
                    3 New
                  </span>
                </div>

                <div className="p-2">
                  <NotificationItem
                    dot="bg-indigo-500"
                    title={t(
                      "newOrderReceived"
                    )}
                    message={t(
                      "newOrderMessage"
                    )}
                  />

                  <NotificationItem
                    dot="bg-emerald-500"
                    title={t(
                      "paymentCompleted"
                    )}
                    message={t(
                      "paymentMessage"
                    )}
                  />

                  <NotificationItem
                    dot="bg-orange-500"
                    title={t(
                      "lowStockAlert"
                    )}
                    message={t(
                      "lowStockMessage"
                    )}
                  />
                </div>

                <div
                  className="
                    border-t
                    border-slate-200
                    p-2

                    dark:border-slate-800
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setNotificationsOpen(
                        false
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-indigo-600
                      transition
                      hover:bg-indigo-50

                      dark:text-indigo-400
                      dark:hover:bg-indigo-500/10
                    "
                  >
                    {t("markAllAsRead")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              PROFILE
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              p-1.5
              transition
              hover:bg-slate-100

              dark:hover:bg-slate-800
            "
          >
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="
                  h-9
                  w-9
                  rounded-xl
                  object-cover
                  ring-2
                  ring-indigo-500/20
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-cyan-500
                  text-sm
                  font-bold
                  text-white
                "
              >
                {profileInitial}
              </div>
            )}

            <div
              className="
                hidden
                min-w-0
                text-left
                xl:block
              "
            >
              <p
                className="
                  max-w-[100px]
                  truncate
                  text-xs
                  font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {profile.name}
              </p>

              <p
                className="
                  text-[10px]
                  font-medium
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {t("administrator")}
              </p>
            </div>

            <ChevronDown
              className="
                hidden
                h-4
                w-4
                text-slate-400

                dark:text-slate-500

                xl:block
              "
            />
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   NOTIFICATION ITEM
   ========================================================= */

function NotificationItem({
  dot,
  title,
  message,
}: {
  dot: string;
  title: string;
  message: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        w-full
        gap-3
        rounded-xl
        p-3
        text-left
        transition
        hover:bg-slate-100

        dark:hover:bg-slate-800
      "
    >
      <span
        className={`
          mt-1.5
          h-2
          w-2
          shrink-0
          rounded-full
          ${dot}
        `}
      />

      <div className="min-w-0">
        <p
          className="
            text-sm
            font-semibold
            text-slate-900

            dark:text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500

            dark:text-slate-400
          "
        >
          {message}
        </p>
      </div>
    </button>
  );
}