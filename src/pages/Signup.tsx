import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { auth } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getSignupErrorMessage = (
    error: unknown
  ) => {
    const firebaseError = error as {
      code?: string;
      message?: string;
    };

    switch (firebaseError.code) {
      case "auth/email-already-in-use":
        return "An account already exists with this email.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters.";

      case "auth/operation-not-allowed":
        return "Email/password authentication is not enabled in Firebase.";

      case "auth/too-many-requests":
        return "Too many signup attempts. Please try again later.";

      default:
        return (
          firebaseError.message ||
          "Unable to create your account. Please try again."
        );
    }
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim();

    if (!cleanName) {
      toast.error(
        "Please enter your full name."
      );
      return false;
    }

    if (cleanName.length < 2) {
      toast.error(
        "Name must contain at least 2 characters."
      );
      return false;
    }

    if (!cleanEmail) {
      toast.error(
        "Please enter your email address."
      );
      return false;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      toast.error(
        "Please enter a valid email address."
      );
      return false;
    }

    if (!password) {
      toast.error(
        "Please enter a password."
      );
      return false;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return false;
    }

    if (!confirmPassword) {
      toast.error(
        "Please confirm your password."
      );
      return false;
    }

    if (
      password !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // SIGNUP
  // =========================================================

  const handleSignup = async () => {
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      // Save user's display name
      await updateProfile(
        userCredential.user,
        {
          displayName: cleanName,
        }
      );

      toast.success(
        "Account created successfully!"
      );

      // Firebase signs the newly created
      // user in automatically, so go directly
      // to the protected dashboard.
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      toast.error(
        getSignupErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter"
    ) {
      event.preventDefault();
      void handleSignup();
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

          {/* =================================================
              LEFT BRAND PANEL
          ================================================= */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <ShieldCheck
                  size={26}
                />
              </div>

              <div>
                <h1 className="text-xl font-extrabold">
                  TAGITStore
                </h1>

                <p className="text-xs text-white/70">
                  Enterprise Dashboard
                </p>
              </div>
            </div>

            <div className="relative z-10 max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <CheckCircle2
                  size={14}
                />
                Public registration
              </div>

              <h2 className="text-4xl font-black leading-tight">
                Create your
                <span className="block text-white/80">
                  TAGITStore account.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/75">
                Create an account to access
                your dashboard, products,
                orders, customers and
                analytics.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <CheckCircle2
                    size={18}
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Secure authentication
                    </p>

                    <p className="text-xs text-white/65">
                      Powered by Firebase
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <ShieldCheck
                    size={18}
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Protected dashboard
                    </p>

                    <p className="text-xs text-white/65">
                      Only authenticated users can enter
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative z-10 text-xs text-white/55">
              © {new Date().getFullYear()} TAGITStore
            </p>
          </div>

          {/* =================================================
              SIGNUP FORM
          ================================================= */}

          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">

              {/* Mobile Logo */}

              <div className="mb-8 flex items-center justify-center lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <ShieldCheck
                      size={24}
                    />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                      TAGITStore
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enterprise Dashboard
                    </p>
                  </div>
                </div>
              </div>

              {/* Header */}

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                  <User
                    size={14}
                  />
                  Create account
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Register with your email
                  and create a secure password.
                </p>
              </div>

              {/* Form Card */}

              <div className="space-y-5">

                {/* Full Name */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                        />
                      ) : (
                        <Eye
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                    Use at least 6 characters.
                  </p>
                </div>

                {/* Confirm Password */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="Enter password again"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={18}
                        />
                      ) : (
                        <Eye
                          size={18}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Create Account */}

                <button
                  type="button"
                  onClick={() =>
                    void handleSignup()
                  }
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <User
                        size={18}
                      />
                      Create Account
                    </>
                  )}
                </button>

                {/* Login */}

                <div className="pt-1 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-blue-600 transition hover:text-blue-500 dark:text-blue-400"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

                {/* Security */}

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400 dark:text-slate-500">
                  <ShieldCheck
                    size={14}
                  />
                  Secure authentication
                  powered by Firebase
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}