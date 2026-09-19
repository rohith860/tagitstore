import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  CalendarDays,
  MapPin,
  Pencil,
  Check,
  X,
  Circle,
  Save,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";

interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  image: string;
}

type AccountStatus = "online" | "offline";

const PROFILE_STORAGE_KEY = "tagit_profile";
const STATUS_STORAGE_KEY = "tagit_account_status";

const PROFILE_UPDATED_EVENT =
  "tagit-profile-updated";

const defaultProfile: ProfileData = {
  name: "Rohith.S",
  role: "Administrator",
  email: "rohithbecsc@gmail.com",
  phone: "",
  location: "India",
  joined: "January 2026",
  image: "",
};

export default function Profile() {
  const { t } = useLanguage();

  const [profile, setProfile] =
    useState<ProfileData>(defaultProfile);

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [editingStatus, setEditingStatus] =
    useState(false);

  const [accountStatus, setAccountStatus] =
    useState<AccountStatus>("online");

  const [draftProfile, setDraftProfile] =
    useState<ProfileData>(defaultProfile);

  const [draftStatus, setDraftStatus] =
    useState<AccountStatus>("online");

  /* =====================================================
     LOAD PROFILE + STATUS
     ===================================================== */

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

      if (savedProfile) {
        const data = JSON.parse(savedProfile);

        const loadedProfile: ProfileData = {
          ...defaultProfile,
          ...data,
        };

        setProfile(loadedProfile);
        setDraftProfile(loadedProfile);
      }

      const savedStatus =
        localStorage.getItem(
          STATUS_STORAGE_KEY
        );

      if (
        savedStatus === "online" ||
        savedStatus === "offline"
      ) {
        setAccountStatus(savedStatus);
        setDraftStatus(savedStatus);
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );
    }
  }, []);

  /* =====================================================
     SAVE PROFILE
     ===================================================== */

  const handleSaveProfile = () => {
    if (!draftProfile.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!draftProfile.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const updatedProfile = {
      ...draftProfile,
      name: draftProfile.name.trim(),
      email: draftProfile.email.trim(),
      location:
        draftProfile.location.trim(),
    };

    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      setProfile(updatedProfile);
      setDraftProfile(updatedProfile);
      setEditingProfile(false);

      window.dispatchEvent(
        new CustomEvent(
          PROFILE_UPDATED_EVENT,
          {
            detail: updatedProfile,
          }
        )
      );

      toast.success(
        t("profileUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );

      toast.error(
        "Failed to save profile."
      );
    }
  };

  /* =====================================================
     SAVE ACCOUNT STATUS
     ===================================================== */

  const handleSaveStatus = () => {
    try {
      localStorage.setItem(
        STATUS_STORAGE_KEY,
        draftStatus
      );

      setAccountStatus(draftStatus);
      setEditingStatus(false);

      toast.success(
        "Account status updated successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to save account status:",
        error
      );

      toast.error(
        "Failed to update account status."
      );
    }
  };

  /* =====================================================
     CANCEL PROFILE EDIT
     ===================================================== */

  const handleCancelProfile = () => {
    setDraftProfile(profile);
    setEditingProfile(false);
  };

  /* =====================================================
     CANCEL STATUS EDIT
     ===================================================== */

  const handleCancelStatus = () => {
    setDraftStatus(accountStatus);
    setEditingStatus(false);
  };

  /* =====================================================
     PROFILE INITIAL
     ===================================================== */

  const profileInitial =
    profile.name
      .trim()
      .charAt(0)
      .toUpperCase() || "R";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="mx-auto mb-6 max-w-6xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-1 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />

              <span className="text-sm font-semibold text-indigo-500">
                {t("myProfile")}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("manageProfile")}
            </p>
          </div>

          {!editingProfile && (
            <button
              type="button"
              onClick={() =>
                setEditingProfile(true)
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-indigo-600/20
                transition
                hover:bg-indigo-500
              "
            >
              <Pencil className="h-4 w-4" />

              {t("editProfile")}
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          MAIN PROFILE GRID
          ================================================= */}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =================================================
            LEFT PROFILE CARD
            ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >

          {/* Profile header */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-indigo-600
              via-blue-600
              to-cyan-500
              px-6
              pb-20
              pt-7
            "
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

            <p className="relative text-sm font-medium text-white/80">
              TAGITStore
            </p>

            <h2 className="relative mt-1 text-xl font-bold text-white">
              Administrator Profile
            </h2>
          </div>

          {/* Avatar */}

          <div className="-mt-14 px-6">

            <div className="relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-xl dark:border-slate-900">

              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profileInitial}
                </span>
              )}
            </div>

            <div className="py-5 text-center">

              <h2 className="text-xl font-bold">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {profile.role ||
                  t("administrator")}
              </p>

              {/* Online status */}

              <div className="mt-4 flex items-center justify-center gap-2">

                <span
                  className={`
                    h-2.5
                    w-2.5
                    rounded-full
                    ${
                      accountStatus ===
                      "online"
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                        : "bg-slate-500"
                    }
                  `}
                />

                <span
                  className={`
                    text-xs
                    font-semibold
                    ${
                      accountStatus ===
                      "online"
                        ? "text-emerald-500"
                        : "text-slate-500"
                    }
                  `}
                >
                  {accountStatus ===
                  "online"
                    ? t("online")
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div className="space-y-6 lg:col-span-2">

          {/* =================================================
              PROFILE INFORMATION
              ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:p-6
            "
          >

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  Profile Information
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Manage your account information
                </p>
              </div>

              {!editingProfile && (
                <button
                  type="button"
                  onClick={() =>
                    setEditingProfile(true)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-100
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                  "
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-5">

                {/* Name */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("name")}
                  </label>

                  <input
                    type="text"
                    value={draftProfile.name}
                    onChange={(event) =>
                      setDraftProfile({
                        ...draftProfile,
                        name: event.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-500/20
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("email")}
                  </label>

                  <input
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) =>
                      setDraftProfile({
                        ...draftProfile,
                        email: event.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-500/20
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("location")}
                  </label>

                  <input
                    type="text"
                    value={draftProfile.location}
                    onChange={(event) =>
                      setDraftProfile({
                        ...draftProfile,
                        location:
                          event.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-500/20
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>

                {/* Buttons */}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                  <button
                    type="button"
                    onClick={
                      handleSaveProfile
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-indigo-500
                    "
                  >
                    <Save className="h-4 w-4" />
                    {t("saveChanges")}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelProfile
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-600
                      transition
                      hover:bg-slate-100
                      dark:border-slate-700
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <X className="h-4 w-4" />
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoCard
                  icon={Mail}
                  label={t("email")}
                  value={
                    profile.email ||
                    "Not added"
                  }
                />

                <InfoCard
                  icon={ShieldCheck}
                  label={t("role")}
                  value={
                    profile.role ||
                    t("administrator")
                  }
                />

                <InfoCard
                  icon={MapPin}
                  label={t("location")}
                  value={
                    profile.location ||
                    "Not added"
                  }
                />

                <InfoCard
                  icon={CalendarDays}
                  label={t("joined")}
                  value={profile.joined}
                />
              </div>
            )}
          </section>

          {/* =================================================
              ACCOUNT STATUS
              ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:p-6
            "
          >

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  Account Status
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Manage your account information
                </p>
              </div>

              {!editingStatus && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftStatus(
                      accountStatus
                    );
                    setEditingStatus(true);
                  }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-100
                    dark:border-slate-700
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                  "
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Status
                </button>
              )}
            </div>

            {editingStatus ? (
              <div className="space-y-5">

                {/* Status selector */}

                <div>
                  <p className="mb-3 text-sm font-semibold">
                    Choose account status
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* ONLINE */}

                    <button
                      type="button"
                      onClick={() =>
                        setDraftStatus(
                          "online"
                        )
                      }
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition
                        ${
                          draftStatus ===
                          "online"
                            ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-emerald-400 dark:border-slate-700"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            draftStatus ===
                            "online"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }
                        `}
                      >
                        <Circle
                          className="h-5 w-5 fill-current"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-bold">
                          {t("online")}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Show that you are active
                        </p>
                      </div>

                      {draftStatus ===
                        "online" && (
                        <Check className="h-5 w-5 text-emerald-500" />
                      )}
                    </button>

                    {/* OFFLINE */}

                    <button
                      type="button"
                      onClick={() =>
                        setDraftStatus(
                          "offline"
                        )
                      }
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition
                        ${
                          draftStatus ===
                          "offline"
                            ? "border-slate-500 bg-slate-500/10 ring-2 ring-slate-500/20"
                            : "border-slate-200 hover:border-slate-400 dark:border-slate-700"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            draftStatus ===
                            "offline"
                              ? "bg-slate-600 text-white"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }
                        `}
                      >
                        <Circle className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <p className="font-bold">
                          Offline
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Show that you are unavailable
                        </p>
                      </div>

                      {draftStatus ===
                        "offline" && (
                        <Check className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Save status */}

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={
                      handleSaveStatus
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-indigo-500
                    "
                  >
                    <Save className="h-4 w-4" />
                    Save Status
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelStatus
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-600
                      transition
                      hover:bg-slate-100
                      dark:border-slate-700
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    <X className="h-4 w-4" />
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Role */}

                <StatusCard
                  icon={ShieldCheck}
                  label={t("role")}
                  value={
                    profile.role ||
                    t("administrator")
                  }
                />

                {/* Security */}

                <StatusCard
                  icon={Lock}
                  label={t(
                    "accountSecurity"
                  )}
                  value={t("secure")}
                />

                {/* Joined */}

                <StatusCard
                  icon={CalendarDays}
                  label={t("joined")}
                  value={profile.joined}
                />

                {/* Online / Offline */}

                <div
                  className={`
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    ${
                      accountStatus ===
                      "online"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-slate-500/30 bg-slate-500/10"
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        accountStatus ===
                        "online"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-500/20 text-slate-400"
                      }
                    `}
                  >
                    <Circle className="h-5 w-5 fill-current" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Status
                    </p>

                    <p
                      className={`
                        mt-1
                        text-lg
                        font-bold
                        ${
                          accountStatus ===
                          "online"
                            ? "text-emerald-500"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {accountStatus ===
                      "online"
                        ? t("online")
                        : "Offline"}
                    </p>
                  </div>

                  <span
                    className={`
                      h-3
                      w-3
                      rounded-full
                      ${
                        accountStatus ===
                        "online"
                          ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                          : "bg-slate-500"
                      }
                    `}
                  />
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              SECURITY FOOTER
              ================================================= */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/5
              px-5
              py-4
            "
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
                bg-emerald-500/10
                text-emerald-500
              "
            >
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-500">
                Account Protected
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your profile information is stored securely in your browser.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
   ========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-4
        dark:border-slate-800
        dark:bg-slate-950
      "
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
          bg-indigo-500/10
          text-indigo-500
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS CARD
   ========================================================= */

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-4
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-500/10
          text-indigo-400
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-base font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}