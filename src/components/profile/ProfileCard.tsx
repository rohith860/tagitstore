import { useEffect, useRef, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  CalendarDays,
  Edit3,
  X,
  Save,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

export interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  image: string;
}

export const PROFILE_STORAGE_KEY = "tagit_profile";
export const PROFILE_UPDATED_EVENT = "tagit-profile-updated";

const defaultProfile: ProfileData = {
  name: "Admin",
  role: "Administrator",
  email: "admin@tagitstore.com",
  phone: "+91 98765 43210",
  location: "Chennai, India",
  joined: "January 2026",
  image: "",
};

export default function ProfileCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] =
    useState<ProfileData>(defaultProfile);

  const [originalProfile, setOriginalProfile] =
    useState<ProfileData>(defaultProfile);

  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // --------------------------------------------------
  // LOAD PROFILE
  // --------------------------------------------------

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        PROFILE_STORAGE_KEY
      );

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);

        const mergedProfile: ProfileData = {
          ...defaultProfile,
          ...parsedProfile,
        };

        setProfile(mergedProfile);
        setOriginalProfile(mergedProfile);
      }
    } catch (error) {
      console.error("Profile loading error:", error);
    }
  }, []);

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // OPEN IMAGE PICKER
  // --------------------------------------------------

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // --------------------------------------------------
  // IMAGE UPLOAD
  // --------------------------------------------------

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    setImageLoading(true);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setProfile((current) => ({
          ...current,
          image: result,
        }));
      }

      setImageLoading(false);
    };

    reader.onerror = () => {
      console.error("Image upload failed.");
      setImageLoading(false);
      alert("Unable to load this image.");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const handleRemoveImage = () => {
    setProfile((current) => ({
      ...current,
      image: "",
    }));
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleSave = () => {
  try {
    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(profile)
    );

    // Tell Navbar + Sidebar about the profile update
    window.dispatchEvent(
      new CustomEvent(
        "tagit-profile-updated",
        {
          detail: profile,
        }
      )
    );

    setOriginalProfile(profile);
    setEditMode(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  } catch (error) {
    console.error(
      "Profile save error:",
      error
    );

    alert(
      "Unable to save your profile. The selected image may be too large."
    );
  }
};
  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditMode(false);
  };

  // --------------------------------------------------
  // AVATAR CLICK
  // --------------------------------------------------

  const handleAvatarClick = () => {
    if (editMode) {
      openFilePicker();
    }
  };

  return (
    <div
      className="
        mt-10
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/70
        bg-white
        shadow-xl
        shadow-slate-200/40
        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Header */}

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-slate-200/70
          p-6
          dark:border-slate-800
          sm:p-8
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            left-1/3
            h-40
            w-40
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  h-8
                  w-1
                  rounded-full
                  bg-gradient-to-b
                  from-blue-500
                  to-violet-500
                "
              />

              <h2
                className="
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-2xl
                  dark:text-white
                "
              >
                My Profile
              </h2>
            </div>

            <p
              className="
                ml-4
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Manage your TAGITStore administrator profile
            </p>
          </div>

          {!editMode && (
            <button
              type="button"
              onClick={() => {
                setOriginalProfile(profile);
                setEditMode(true);
              }}
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-violet-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-blue-500/30
              "
            >
              <Edit3
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:rotate-12
                "
              />

              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Content */}

      <div className="p-6 sm:p-8">
        {/* Profile Hero */}

        <div
          className="
            flex
            flex-col
            gap-6
            rounded-2xl
            border
            border-slate-200/70
            bg-slate-50/70
            p-6
            dark:border-slate-800
            dark:bg-slate-800/40
            sm:flex-row
            sm:items-center
          "
        >
          {/* Avatar */}

          <div className="relative mx-auto sm:mx-0">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={!editMode}
              aria-label={
                editMode
                  ? "Change profile photo"
                  : "Profile photo"
              }
              className={`
                group
                relative
                flex
                h-24
                w-24
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-blue-500
                via-indigo-500
                to-violet-600
                text-white
                shadow-xl
                shadow-blue-500/20
                ${
                  editMode
                    ? "cursor-pointer ring-4 ring-blue-500/10"
                    : "cursor-default"
                }
              `}
            >
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={`${profile.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle className="h-16 w-16" />
              )}

              {editMode && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    bg-black/45
                    text-white
                    opacity-0
                    transition
                    duration-200
                    group-hover:opacity-100
                  "
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px] font-bold">
                    CHANGE
                  </span>
                </div>
              )}

              {imageLoading && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/50
                  "
                >
                  <div
                    className="
                      h-6
                      w-6
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />
                </div>
              )}
            </button>

            <span
              className="
                absolute
                bottom-1
                right-1
                h-5
                w-5
                rounded-full
                border-4
                border-slate-50
                bg-emerald-500
                dark:border-slate-800
              "
            />
          </div>

          {/* Name */}

          <div className="flex-1 text-center sm:text-left">
            {editMode ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className="
                  w-full
                  max-w-md
                  rounded-xl
                  border
                  border-blue-400/30
                  bg-white
                  px-4
                  py-3
                  text-xl
                  font-bold
                  text-slate-900
                  outline-none
                  transition
                  focus:ring-4
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              />
            ) : (
              <h3
                className="
                  text-2xl
                  font-extrabold
                  text-slate-900
                  dark:text-white
                "
              >
                {profile.name}
              </h3>
            )}

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
                sm:justify-start
              "
            >
              <span
                className="
                  rounded-full
                  border
                  border-blue-400/20
                  bg-blue-500/10
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-blue-600
                  dark:text-blue-400
                "
              >
                {profile.role}
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-emerald-400/20
                  bg-emerald-500/10
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Upload Controls */}

        {editMode && (
          <div
            className="
              mt-4
              flex
              flex-col
              gap-3
              rounded-2xl
              border
              border-blue-400/20
              bg-blue-500/5
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-500
                "
              >
                <Camera className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Profile Photo
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  JPG, PNG or WEBP • Maximum 5MB
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-blue-500/20
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-blue-600
                  transition
                  hover:bg-blue-50
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-blue-400
                  dark:hover:bg-slate-800
                "
              >
                <Upload className="h-4 w-4" />

                {profile.image
                  ? "Change Photo"
                  : "Upload Photo"}
              </button>

              {profile.image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-red-500
                    transition
                    hover:bg-red-500/10
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        )}

        {/* Information */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Mail className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email Address
                </p>

                {editMode ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    className="
                      mt-1
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-slate-800
                      outline-none
                      focus:border-blue-400
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                    "
                  />
                ) : (
                  <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-white">
                    {profile.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <Phone className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Phone Number
                </p>

                {editMode ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    className="
                      mt-1
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-slate-800
                      outline-none
                      focus:border-violet-400
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                    "
                  />
                ) : (
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Location
                </p>

                {editMode ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      handleChange("location", e.target.value)
                    }
                    className="
                      mt-1
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-50
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-slate-800
                      outline-none
                      focus:border-emerald-400
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                    "
                  />
                ) : (
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Joined */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Joined
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                  {profile.joined}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-500/5 to-violet-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Account Security
              </h4>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your administrator account is protected.
              </p>
            </div>
          </div>

          <span className="flex items-center gap-2 text-sm font-bold text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Secure
          </span>
        </div>

        {/* Edit Buttons */}

        {editMode && (
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
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
                font-bold
                text-slate-600
                transition
                hover:bg-slate-100
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-violet-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* Saved Message */}

        {saved && (
          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-emerald-400/20
              bg-emerald-500/10
              px-4
              py-3
              text-sm
              font-bold
              text-emerald-500
            "
          >
            <CheckCircle2 className="h-5 w-5" />
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}