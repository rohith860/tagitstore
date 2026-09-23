import { useEffect, useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  Chrome,
  CheckCircle2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  GoogleAuthProvider,
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [email, setEmail] = useState(
    () =>
      localStorage.getItem(
        "tagit_remember_email"
      ) || ""
  );

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberEmail, setRememberEmail] =
    useState(
      Boolean(
        localStorage.getItem(
          "tagit_remember_email"
        )
      )
    );

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getAuthErrorMessage = (
    error: unknown
  ) => {
    const firebaseError = error as {
      code?: string;
      message?: string;
    };

    switch (firebaseError.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/user-disabled":
        return "This account has been disabled.";

      case "auth/user-not-found":
        return "Unable to sign in with these credentials.";

      case "auth/wrong-password":
        return "Unable to sign in with these credentials.";

      case "auth/invalid-credential":
        return "Email or password is incorrect.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";

      case "auth/popup-blocked":
        return "Google popup was blocked. Switching to redirect sign-in.";

      case "auth/popup-cancelled-by-user":
        return "Google sign-in was cancelled.";

      case "auth/unauthorized-domain":
        return "This website domain is not authorized in Firebase.";

      case "auth/account-exists-with-different-credential":
        return "An account already exists with a different sign-in method.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return (
          firebaseError.message ||
          "Something went wrong. Please try again."
        );
    }
  };

  // =========================================================
  // CHECK GOOGLE REDIRECT RESULT
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const checkRedirectResult =
      async () => {
        try {
          const result =
            await getRedirectResult(
              auth
            );

          if (!mounted) return;

          if (result?.user) {
            toast.success(
              "Google login successful!"
            );

            navigate("/", {
              replace: true,
            });
          }
        } catch (error) {
          console.error(
            "Google redirect login error:",
            error
          );

          if (!mounted) return;

          toast.error(
            getAuthErrorMessage(error)
          );
        }
      };

    void checkRedirectResult();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // =========================================================
  // EMAIL LOGIN
  // =========================================================

  const handleEmailLogin = async () => {
    if (loading) return;

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      toast.error(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      if (rememberEmail) {
        localStorage.setItem(
          "tagit_remember_email",
          cleanEmail
        );
      } else {
        localStorage.removeItem(
          "tagit_remember_email"
        );
      }

      toast.success(
        "Login successful!"
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Email login error:",
        error
      );

      toast.error(
        getAuthErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const handleForgotPassword =
    async () => {
      if (resetLoading) return;

      const cleanEmail =
        email.trim();

      if (!cleanEmail) {
        toast.error(
          "Enter your email address first."
        );
        return;
      }

      try {
        setResetLoading(true);

        await sendPasswordResetEmail(
          auth,
          cleanEmail
        );

        toast.success(
          "Password reset email sent. Check your inbox."
        );
      } catch (error) {
        console.error(
          "Password reset error:",
          error
        );

        const firebaseError =
          error as {
            code?: string;
          };

        switch (
          firebaseError.code
        ) {
          case "auth/invalid-email":
            toast.error(
              "Please enter a valid email address."
            );
            break;

          case "auth/too-many-requests":
            toast.error(
              "Too many requests. Please try again later."
            );
            break;

          default:
            toast.error(
              "Unable to send password reset email."
            );
        }
      } finally {
        setResetLoading(false);
      }
    };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const handleGoogleLogin =
    async () => {
      if (googleLoading) return;

      try {
        setGoogleLoading(true);

        const provider =
          new GoogleAuthProvider();

        provider.setCustomParameters({
          prompt: "select_account",
        });

        /*
         * Use redirect on smaller screens.
         *
         * This is better for mobile browsers where
         * popup windows can be blocked or restricted.
         */
        const isMobile =
          window.matchMedia(
            "(max-width: 1023px)"
          ).matches;

        if (isMobile) {
          await signInWithRedirect(
            auth,
            provider
          );

          return;
        }

        /*
         * Desktop: use popup.
         */
        try {
          await signInWithPopup(
            auth,
            provider
          );

          toast.success(
            "Google login successful!"
          );

          navigate("/", {
            replace: true,
          });
        } catch (popupError) {
          const popupErrorCode =
            (
              popupError as {
                code?: string;
              }
            )?.code;

          /*
           * If the browser blocks the popup,
           * automatically try redirect.
           */
          if (
            popupErrorCode ===
              "auth/popup-blocked" ||
            popupErrorCode ===
              "auth/popup-cancelled-by-user"
          ) {
            toast.loading(
              "Opening Google sign-in...",
              {
                id: "google-redirect",
              }
            );

            await signInWithRedirect(
              auth,
              provider
            );

            return;
          }

          throw popupError;
        }
      } catch (error) {
        console.error(
          "Google login error:",
          error
        );

        toast.dismiss(
          "google-redirect"
        );

        toast.error(
          getAuthErrorMessage(error)
        );

        setGoogleLoading(false);
      }
    };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleEmailLogin();
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10">
            <Link
              to="/home"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <ShieldCheck
                  size={25}
                />
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight">
                  TAGITStore
                </p>

                <p className="text-xs text-white/75">
                  Enterprise Dashboard
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">

            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              Secure authentication
            </p>

            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
              Welcome back to your
              <span className="block text-white/80">
                TAGITStore dashboard.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75">
              Manage products, orders,
              customers, analytics and
              your business settings from
              one secure dashboard.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <CheckCircle2
                  size={19}
                />

                <p className="mt-3 text-sm font-semibold">
                  Firebase Auth
                </p>

                <p className="mt-1 text-xs text-white/65">
                  Secure account access
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck
                  size={19}
                />

                <p className="mt-3 text-sm font-semibold">
                  Protected
                </p>

                <p className="mt-1 text-xs text-white/65">
                  Authenticated routes
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Chrome
                  size={19}
                />

                <p className="mt-3 text-sm font-semibold">
                  Google
                </p>

                <p className="mt-1 text-xs text-white/65">
                  Quick sign in
                </p>
              </div>

            </div>
          </div>

          <div className="relative z-10 text-xs text-white/55">
            © {new Date().getFullYear()} TAGITStore
          </div>
        </div>

        {/* =================================================
            RIGHT LOGIN PANEL
        ================================================= */}

        <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">

          <div className="w-full max-w-md">

            {/* =================================================
                MOBILE BRAND
            ================================================= */}

            <div className="mb-8 flex items-center justify-center lg:hidden">

              <Link
                to="/home"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    TAGITStore
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enterprise Dashboard
                  </p>
                </div>
              </Link>

            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                <ShieldCheck
                  size={14}
                />
                Secure login
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Sign in to continue to
                your TAGITStore dashboard.
              </p>

            </div>

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="space-y-5">

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
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                  </div>

                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        void handleForgotPassword()
                      }
                      disabled={
                        resetLoading
                      }
                      className="text-xs font-semibold text-blue-600 transition hover:text-blue-500 disabled:opacity-50 dark:text-blue-400"
                    >
                      {resetLoading
                        ? "Sending..."
                        : "Forgot password?"}
                    </button>

                  </div>

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
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            previous
                          ) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
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

                </div>

                {/* =================================================
                    REMEMBER EMAIL
                ================================================= */}

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      rememberEmail
                    }
                    onChange={(
                      event
                    ) =>
                      setRememberEmail(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />

                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Remember my email
                  </span>

                </label>

                {/* =================================================
                    SIGN IN
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    void handleEmailLogin()
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
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

              </div>

              {/* =================================================
                  GOOGLE DIVIDER
              ================================================= */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                <span className="text-xs font-medium text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

              </div>

              {/* =================================================
                  GOOGLE
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  void handleGoogleLogin()
                }
                disabled={
                  googleLoading
                }
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >

                {googleLoading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Chrome
                    size={18}
                  />
                )}

                {googleLoading
                  ? "Connecting..."
                  : "Continue with Google"}

              </button>

              {/* =================================================
                  SIGNUP
              ================================================= */}

              <div className="mt-6 text-center">

                <p className="text-sm text-slate-500 dark:text-slate-400">

                  Don't have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-bold text-blue-600 transition hover:text-blue-500 dark:text-blue-400"
                  >
                    Create account
                  </Link>

                </p>

              </div>

              {/* =================================================
                  SECURITY
              ================================================= */}

              <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">

                <ShieldCheck
                  size={14}
                />

                Secure authentication
                powered by Firebase

              </div>

            </div>

            {/* =================================================
                BACK HOME
            ================================================= */}

            <div className="mt-6 text-center">

              <Link
                to="/home"
                className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                ← Back to home
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}