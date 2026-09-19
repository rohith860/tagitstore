import { useEffect, useState } from "react";
import {
  User,
  Palette,
  Globe2,
  Bell,
  Shield,
  Mail,
  Database,
  AlertTriangle,
  Camera,
  Save,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Monitor,
  Lock,
  Smartphone,
  MapPin,
  Phone,
  AtSign,
} from "lucide-react";
import toast from "react-hot-toast";

import { useLanguage } from "../context/LanguageContext";

const SETTINGS_STORAGE_KEY = "tagit-settings";
const PROFILE_STORAGE_KEY = "tagit_profile";
const PROFILE_UPDATED_EVENT =
  "tagit-profile-updated";

interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  image: string;
}

interface SettingsData {
  darkMode: boolean;
  theme: "system" | "light" | "dark";
  notifications: {
    orders: boolean;
    customers: boolean;
    inventory: boolean;
    system: boolean;
  };
  emailPreferences: {
    orders: boolean;
    reports: boolean;
    marketing: boolean;
    announcements: boolean;
  };
}

const defaultProfile: ProfileData = {
  name: "Admin",
  role: "Administrator",
  email: "admin@tagitstore.com",
  phone: "",
  location: "",
  joined: "",
  image: "",
};

const defaultSettings: SettingsData = {
  darkMode: true,
  theme: "dark",
  notifications: {
    orders: true,
    customers: true,
    inventory: true,
    system: true,
  },
  emailPreferences: {
    orders: true,
    reports: true,
    marketing: false,
    announcements: true,
  },
};

export default function Settings() {
  const { language, setLanguage, t } =
    useLanguage();

  const [profile, setProfile] =
    useState<ProfileData>(defaultProfile);

  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [activeSection, setActiveSection] =
    useState("profile");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);

        const nextProfile = {
          ...defaultProfile,
          ...parsed,
        };

        setProfile(nextProfile);
        setImagePreview(nextProfile.image || "");
      }

      const savedSettings =
        localStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

      if (savedSettings) {
        const parsed = JSON.parse(
          savedSettings
        );

        setSettings({
          ...defaultSettings,
          ...parsed,
          notifications: {
            ...defaultSettings.notifications,
            ...(parsed.notifications || {}),
          },
          emailPreferences: {
            ...defaultSettings.emailPreferences,
            ...(parsed.emailPreferences || {}),
          },
        });
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    }
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<ProfileData>;

      if (customEvent.detail) {
        setProfile(customEvent.detail);
        setImagePreview(
          customEvent.detail.image || ""
        );
      }
    };

    window.addEventListener(
      PROFILE_UPDATED_EVENT,
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        PROFILE_UPDATED_EVENT,
        handleProfileUpdate
      );
    };
  }, []);

  const saveSettings = (
    nextSettings: SettingsData
  ) => {
    setSettings(nextSettings);

    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(nextSettings)
    );
  };

  const applyTheme = (
    theme: "system" | "light" | "dark"
  ) => {
    let resolvedTheme: "light" | "dark";

    if (theme === "system") {
      resolvedTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";
    } else {
      resolvedTheme = theme;
    }

    document.documentElement.classList.toggle(
      "dark",
      resolvedTheme === "dark"
    );
  };

  const handleThemeChange = (
    theme: "system" | "light" | "dark"
  ) => {
    const nextSettings: SettingsData = {
      ...settings,
      theme,
      darkMode: theme !== "light",
    };

    saveSettings(nextSettings);
    applyTheme(theme);

    toast.success(t("settingsSaved"));
  };

  const handleToggle = (
    group:
      | "notifications"
      | "emailPreferences",
    key: string
  ) => {
    const groupValues = settings[group] as Record<
      string,
      boolean
    >;

    const nextSettings: SettingsData = {
      ...settings,
      [group]: {
        ...groupValues,
        [key]: !groupValues[key],
      },
    };

    saveSettings(nextSettings);
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "Image must be smaller than 2MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = String(
        reader.result || ""
      );

      setImagePreview(image);

      setProfile((prev) => ({
        ...prev,
        image,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    if (!profile.name.trim()) {
      toast.error(t("requiredField"));
      return;
    }

    if (!profile.email.trim()) {
      toast.error(t("requiredField"));
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        profile.email
      )
    ) {
      toast.error(t("invalidEmail"));
      return;
    }

    try {
      setSavingProfile(true);

      const updatedProfile = {
        ...profile,
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        location:
          profile.location.trim(),
      };

      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      window.dispatchEvent(
        new CustomEvent(
          PROFILE_UPDATED_EVENT,
          {
            detail: updatedProfile,
          }
        )
      );

      toast.success(
        t("profileUpdatedSuccess")
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      toast.error(
        "Failed to save profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast.error(t("requiredField"));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(t("settingsSaved"));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = {
        profile,
        settings,
        language,
        exportedAt:
          new Date().toISOString(),
      };

      const blob = new Blob(
        [
          JSON.stringify(
            exportData,
            null,
            2
          ),
        ],
        {
          type: "application/json",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "tagitstore-settings-export.json";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success(
        t("exportData") + " ✓"
      );
    } catch (error) {
      console.error(
        "Failed to export settings:",
        error
      );

      toast.error(
        "Failed to export settings."
      );
    }
  };

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      "Reset all TAGITStore settings to their defaults?"
    );

    if (!confirmed) return;

    localStorage.removeItem(
      SETTINGS_STORAGE_KEY
    );

    setSettings(defaultSettings);
    setLanguage("English");
    applyTheme("dark");

    toast.success(
      t("resetSettings") + " ✓"
    );
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  const menuItemClass = (
    section: string
  ) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
      activeSection === section
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {t("settingsTitle")}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("settingsDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* SETTINGS MENU */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() =>
              setActiveSection("profile")
            }
            className={menuItemClass(
              "profile"
            )}
          >
            <User className="h-4 w-4" />
            {t("profileSettings")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("appearance")
            }
            className={menuItemClass(
              "appearance"
            )}
          >
            <Palette className="h-4 w-4" />
            {t("appearance")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("language")
            }
            className={menuItemClass(
              "language"
            )}
          >
            <Globe2 className="h-4 w-4" />
            {t("languageSettings")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection(
                "notifications"
              )
            }
            className={menuItemClass(
              "notifications"
            )}
          >
            <Bell className="h-4 w-4" />
            {t("notificationSettings")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("security")
            }
            className={menuItemClass(
              "security"
            )}
          >
            <Shield className="h-4 w-4" />
            {t("securitySettings")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("email")
            }
            className={menuItemClass(
              "email"
            )}
          >
            <Mail className="h-4 w-4" />
            {t("emailPreferences")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("data")
            }
            className={menuItemClass(
              "data"
            )}
          >
            <Database className="h-4 w-4" />
            {t("dataPrivacy")}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveSection("danger")
            }
            className={menuItemClass(
              "danger"
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            {t("dangerZone")}
          </button>
        </aside>

        {/* CONTENT */}
        <div className="space-y-6">
          {/* PROFILE */}
          {activeSection === "profile" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("profileSettings")}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("profileDescription")}
                </p>
              </div>

              <div className="space-y-6 p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-indigo-100 bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={t("profilePhoto")}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-indigo-500" />
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500">
                      <Camera className="h-4 w-4" />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={
                          handleImageUpload
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {t("profilePhoto")}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t(
                        "profilePhotoDescription"
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      {t("fullName")}
                    </label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={profile.name}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            name: event
                              .target.value,
                          }))
                        }
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      {t("roleName")}
                    </label>

                    <input
                      value={profile.role}
                      onChange={(event) =>
                        setProfile((prev) => ({
                          ...prev,
                          role: event.target
                            .value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      {t("emailAddress")}
                    </label>

                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={profile.email}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            email:
                              event.target.value,
                          }))
                        }
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      {t("phoneNumber")}
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={profile.phone}
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            phone:
                              event.target.value,
                          }))
                        }
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      {t("location")}
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={
                          profile.location
                        }
                        onChange={(event) =>
                          setProfile((prev) => ({
                            ...prev,
                            location:
                              event.target.value,
                          }))
                        }
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={
                      handleProfileSave
                    }
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {savingProfile
                      ? t("updating")
                      : t("saveChanges")}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("appearance")}
                </h2>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-3">
                {[
                  {
                    key: "light" as const,
                    title: t("themeLight"),
                    description: t(
                      "themeLightDescription"
                    ),
                    icon: Sun,
                  },
                  {
                    key: "dark" as const,
                    title: t("themeDark"),
                    description: t(
                      "themeDarkDescription"
                    ),
                    icon: Moon,
                  },
                  {
                    key: "system" as const,
                    title: t("themeSystem"),
                    description: t(
                      "themeSystemDescription"
                    ),
                    icon: Monitor,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const selected =
                    settings.theme ===
                    item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        handleThemeChange(
                          item.key
                        )
                      }
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20 dark:bg-indigo-500/10"
                          : "border-slate-200 hover:border-indigo-300 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                        </div>

                        {selected && (
                          <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* LANGUAGE */}
          {activeSection === "language" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("languageSettings")}
                </h2>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-3">
                {(
                  [
                    "English",
                    "Tamil",
                    "Hindi",
                  ] as const
                ).map((item) => {
                  const selected =
                    language === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setLanguage(item)
                      }
                      className={`rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20 dark:bg-indigo-500/10"
                          : "border-slate-200 hover:border-indigo-300 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Globe2 className="h-5 w-5 text-indigo-500" />

                        {selected && (
                          <Check className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                        {item}
                      </h3>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeSection ===
            "notifications" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t(
                    "notificationSettings"
                  )}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    "notificationDescription"
                  )}
                </p>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  {
                    key: "orders",
                    title: t("newOrders"),
                    description: t(
                      "newOrdersDescription"
                    ),
                  },
                  {
                    key: "customers",
                    title: t(
                      "customerUpdates"
                    ),
                    description: t(
                      "customerUpdatesDescription"
                    ),
                  },
                  {
                    key: "inventory",
                    title: t(
                      "inventoryAlerts"
                    ),
                    description: t(
                      "inventoryAlertsDescription"
                    ),
                  },
                  {
                    key: "system",
                    title: t(
                      "systemNotifications"
                    ),
                    description: t(
                      "systemNotificationsDescription"
                    ),
                  },
                ].map((item) => {
                  const enabled =
                    settings
                      .notifications[
                      item.key as keyof typeof settings.notifications
                    ];

                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 p-6"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(
                            "notifications",
                            item.key
                          )
                        }
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          enabled
                            ? "bg-indigo-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            enabled
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("securitySettings")}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("securityDescription")}
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className={labelClass}>
                    {t("currentPassword")}
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-10 pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    {t("newPassword")}
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t(
                      "confirmNewPassword"
                    )}
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePasswordChange
                  }
                  disabled={
                    changingPassword
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  <Shield className="h-4 w-4" />

                  {changingPassword
                    ? t("updating")
                    : t("updatePassword")}
                </button>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div className="flex gap-3">
                    <Smartphone className="h-5 w-5 text-emerald-600" />

                    <div>
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                        {t(
                          "passwordSecurityTip"
                        )}
                      </p>

                      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                        {t(
                          "passwordSecurityTipDescription"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* EMAIL */}
          {activeSection === "email" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("emailPreferences")}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    "emailPreferencesDescription"
                  )}
                </p>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  {
                    key: "orders",
                    title: t("orderEmails"),
                    description: t(
                      "orderEmailsDescription"
                    ),
                  },
                  {
                    key: "reports",
                    title: t("weeklyReports"),
                    description: t(
                      "weeklyReportsDescription"
                    ),
                  },
                  {
                    key: "marketing",
                    title: t(
                      "marketingEmails"
                    ),
                    description: t(
                      "marketingEmailsDescription"
                    ),
                  },
                  {
                    key: "announcements",
                    title: t(
                      "systemAnnouncements"
                    ),
                    description: t(
                      "systemAnnouncementsDescription"
                    ),
                  },
                ].map((item) => {
                  const enabled =
                    settings
                      .emailPreferences[
                      item.key as keyof typeof settings.emailPreferences
                    ];

                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 p-6"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(
                            "emailPreferences",
                            item.key
                          )
                        }
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          enabled
                            ? "bg-indigo-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                            enabled
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* DATA */}
          {activeSection === "data" && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("dataPrivacy")}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    "dataPrivacyDescription"
                  )}
                </p>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {t("exportSettings")}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t(
                          "exportSettingsDescription"
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleExportData
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Download className="h-4 w-4" />
                      {t("exportData")}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  <div className="flex gap-3">
                    <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />

                    <div>
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">
                        {t("localSettings")}
                      </h3>

                      <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                        {t(
                          "localSettingsDescription"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* DANGER */}
          {activeSection === "danger" && (
            <section className="rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-500/20 dark:bg-slate-900">
              <div className="border-b border-red-200 p-6 dark:border-red-500/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
                      {t("dangerZone")}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t(
                        "dangerZoneDescription"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      {t("resetSettings")}
                    </h3>

                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {t(
                        "resetSettingsDescription"
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleResetSettings
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t("resetSettings")}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}