import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  sendPasswordResetEmail,
  type AuthError,
} from "firebase/auth";

import { auth } from "../firebase";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Chrome,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

type PhoneConfirmation = Awaited<
  ReturnType<typeof signInWithPhoneNumber>
>;

export default function Login() {
  // --------------------------------------------------
  // BASIC STATE
  // --------------------------------------------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // PHONE AUTH STATE
  // --------------------------------------------------

  const [showPhoneModal, setShowPhoneModal] =
    useState(false);

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [otp, setOtp] = useState("");

  const [confirmationResult, setConfirmationResult] =
    useState<PhoneConfirmation | null>(null);

  const [phoneLoading, setPhoneLoading] =
    useState(false);

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(null);

  // --------------------------------------------------
  // LOAD REMEMBERED EMAIL
  // --------------------------------------------------

  useEffect(() => {
    const savedEmail = localStorage.getItem(
      "tagit_remember_email"
    );

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // --------------------------------------------------
  // FIREBASE ERROR HANDLER
  // --------------------------------------------------

  const getFirebaseErrorMessage = (
    error: unknown
  ) => {
    const firebaseError = error as AuthError;

    switch (firebaseError.code) {
      case "auth/user-not-found":
        return "No account found with this email.";

      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed.";

      case "auth/popup-blocked":
        return "Your browser blocked the Google popup.";

      case "auth/unauthorized-domain":
        return "This website domain is not authorized in Firebase.";

      case "auth/operation-not-allowed":
        return "This authentication method is not enabled in Firebase.";

      case "auth/invalid-phone-number":
        return "Please enter a valid phone number.";

      case "auth/invalid-verification-code":
        return "Invalid OTP. Please check the code.";

      case "auth/code-expired":
        return "OTP expired. Please request a new one.";

      case "auth/quota-exceeded":
        return "SMS limit reached. Try again later.";

      default:
        return (
          firebaseError.message ||
          "Something went wrong. Please try again."
        );
    }
  };

  // --------------------------------------------------
  // EMAIL LOGIN
  // --------------------------------------------------

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      console.log(
        "✅ Email login successful"
      );

      console.log(
        "👤 Firebase user:",
        result.user
      );

      console.log(
        "🔥 Firebase currentUser:",
        auth.currentUser
      );

      // Remember email
      if (rememberMe) {
        localStorage.setItem(
          "tagit_remember_email",
          email.trim()
        );
      } else {
        localStorage.removeItem(
          "tagit_remember_email"
        );
      }

      // Refresh Firebase user
      await auth.currentUser?.reload();

      toast.success(
        "Login successful!"
      );

      // IMPORTANT
      // Reload the app and open dashboard
      window.location.replace("/");
    } catch (error) {
      console.error(
        "❌ Email login error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // GOOGLE LOGIN
  // --------------------------------------------------

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      console.log(
        "✅ Google login successful"
      );

      console.log(
        "👤 Google user:",
        result.user
      );

      console.log(
        "🔥 Firebase currentUser:",
        auth.currentUser
      );

      // Refresh Firebase session
      await auth.currentUser?.reload();

      toast.success(
        "Google login successful!"
      );

      // IMPORTANT
      // Reload app and let ProtectedRoute
      // detect the Firebase session.
      window.location.replace("/");
    } catch (error) {
      console.error(
        "❌ Google login error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE RECAPTCHA
  // --------------------------------------------------

  const createRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",

          callback: () => {
            console.log(
              "✅ reCAPTCHA completed"
            );
          },

          "expired-callback": () => {
            console.log(
              "⚠️ reCAPTCHA expired"
            );
          },
        }
      );

    recaptchaVerifierRef.current =
      verifier;

    return verifier;
  };

  // --------------------------------------------------
  // SEND PHONE OTP
  // --------------------------------------------------

  const handleSendOtp = async () => {
    setError("");

    if (!phoneNumber.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    try {
      setPhoneLoading(true);

      const verifier =
        createRecaptcha();

      const result =
        await signInWithPhoneNumber(
          auth,
          phoneNumber.trim(),
          verifier
        );

      console.log(
        "✅ OTP sent successfully"
      );

      setConfirmationResult(result);

      toast.success(
        "OTP sent successfully!"
      );
    } catch (error) {
      console.error(
        "❌ Phone login error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );

      if (
        recaptchaVerifierRef.current
      ) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup error
        }

        recaptchaVerifierRef.current =
          null;
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  // --------------------------------------------------
  // VERIFY PHONE OTP
  // --------------------------------------------------

  const handleVerifyOtp = async () => {
    setError("");

    if (!confirmationResult) {
      setError(
        "Please request the OTP first."
      );
      return;
    }

    if (otp.trim().length < 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setPhoneLoading(true);

      const result =
        await confirmationResult.confirm(
          otp.trim()
        );

      console.log(
        "✅ Phone login successful"
      );

      console.log(
        "👤 Phone user:",
        result.user
      );

      console.log(
        "🔥 Firebase currentUser:",
        auth.currentUser
      );

      // Refresh Firebase session
      await auth.currentUser?.reload();

      toast.success(
        "Phone login successful!"
      );

      setShowPhoneModal(false);
      setConfirmationResult(null);
      setOtp("");

      // IMPORTANT
      window.location.replace("/");
    } catch (error) {
      console.error(
        "❌ OTP verification error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  // --------------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------------

  const handleForgotPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError(
        "Enter your email address first."
      );
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      toast.success(
        "Password reset email sent!"
      );
    } catch (error) {
      console.error(
        "❌ Password reset error:",
        error
      );

      setError(
        getFirebaseErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // OPEN PHONE MODAL
  // --------------------------------------------------

  const openPhoneModal = () => {
    setError("");
    setPhoneNumber("");
    setOtp("");
    setConfirmationResult(null);

    setShowPhoneModal(true);
  };

  // --------------------------------------------------
  // CLOSE PHONE MODAL
  // --------------------------------------------------

  const closePhoneModal = () => {
    setShowPhoneModal(false);

    setPhoneNumber("");
    setOtp("");
    setConfirmationResult(null);
    setError("");

    if (
      recaptchaVerifierRef.current
    ) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // Ignore cleanup error
      }

      recaptchaVerifierRef.current =
        null;
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
              <span className="text-3xl font-black">
                T
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight">
              TAGIT
              <span className="text-cyan-400">
                Store
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Welcome back! Sign in to continue.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Sign in
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Access your TAGITStore dashboard
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                ⚠️ {error}
              </div>
            )}

            {/* Email Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-4 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={
                      handleForgotPassword
                    }
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3.5 pl-11 pr-12 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900"
                />

                Remember me
              </label>

              {/* Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
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
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs font-medium text-slate-500">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Chrome size={19} />

              Continue with Google
            </button>

            {/* Phone */}
            <button
              type="button"
              onClick={openPhoneModal}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Phone size={19} />

              Continue with Phone
            </button>

            {/* Footer */}
            <p className="mt-7 text-center text-xs text-slate-500">
              © 2026 TAGITStore. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container" />

      {/* PHONE MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">

            {/* Close */}
            <button
              type="button"
              onClick={closePhoneModal}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Heading */}
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15">
                <Phone
                  size={23}
                  className="text-indigo-400"
                />
              </div>

              <h3 className="text-2xl font-bold">
                Verify your phone
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {confirmationResult
                  ? "Enter the 6-digit verification code."
                  : "Enter your phone number to receive an OTP."}
              </p>
            </div>

            {/* Modal Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* PHONE NUMBER */}
            {!confirmationResult ? (
              <div className="space-y-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value
                        )
                      }
                      placeholder="+1 650 555 3434"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-3.5 pl-11 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Include your country code.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={phoneLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3.5 font-semibold text-white disabled:opacity-60"
                >
                  {phoneLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            ) : (
              /* OTP */
              <div className="space-y-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Verification code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-center text-xl tracking-[0.5em] text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={phoneLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3.5 font-semibold text-white disabled:opacity-60"
                >
                  {phoneLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmationResult(
                      null
                    );

                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-sm text-slate-400 hover:text-white"
                >
                  Use a different number
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}