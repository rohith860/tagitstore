import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

type PhoneConfirmation = Awaited<
  ReturnType<typeof signInWithPhoneNumber>
>;

export default function Login() {
  const navigate = useNavigate();

  // ==================================================
  // EMAIL LOGIN
  // ==================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // PHONE LOGIN
  // ==================================================

  const [phoneModal, setPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">(
    "phone"
  );

  const [phoneLoading, setPhoneLoading] = useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState<PhoneConfirmation | null>(null);

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(null);

  // ==================================================
  // LOAD REMEMBERED EMAIL
  // ==================================================

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(
        "tagit_remembered_email"
      );

      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (storageError) {
      console.error(
        "Failed to load remembered email:",
        storageError
      );
    }
  }, []);

  // ==================================================
  // FIREBASE ERROR MESSAGE
  // ==================================================

  const getFirebaseError = (code: string) => {
    switch (code) {
      case "auth/invalid-credential":
        return "Invalid email or password.";

      case "auth/user-not-found":
        return "No account found with this email.";

      case "auth/wrong-password":
        return "Incorrect password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/user-disabled":
        return "This account has been disabled.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";

      case "auth/popup-blocked":
        return "Your browser blocked the Google sign-in popup.";

      case "auth/account-exists-with-different-credential":
        return "An account already exists with a different sign-in method.";

      case "auth/invalid-verification-code":
        return "Invalid verification code.";

      case "auth/code-expired":
        return "The verification code has expired.";

      case "auth/invalid-phone-number":
        return "Please enter a valid phone number with country code.";

      case "auth/quota-exceeded":
        return "SMS limit reached. Please try again later.";

      case "auth/captcha-check-failed":
        return "reCAPTCHA verification failed. Please try again.";

      case "auth/missing-phone-number":
        return "Please enter your phone number.";

      case "auth/operation-not-allowed":
        return "Phone authentication is not allowed for this region or provider.";

      case "auth/billing-not-enabled":
        return "Firebase billing is required for real SMS phone authentication.";

      case "auth/invalid-app-credential":
        return "Firebase phone verification could not validate this app.";

      case "auth/unauthorized-domain":
        return "This website domain is not authorized in Firebase.";

      default:
        return "Something went wrong. Please try again.";
    }
  };

  // ==================================================
  // EMAIL LOGIN
  // ==================================================

  const handleLogin = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      try {
        if (rememberMe) {
          localStorage.setItem(
            "tagit_remembered_email",
            email.trim()
          );
        } else {
          localStorage.removeItem(
            "tagit_remembered_email"
          );
        }
      } catch (storageError) {
        console.error(
          "Failed to save remembered email:",
          storageError
        );
      }

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (firebaseError) {
      console.error("Email login error:", firebaseError);

      const errorCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code ?? ""
            )
          : "";

      setError(getFirebaseError(errorCode));
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // GOOGLE LOGIN
  // ==================================================

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);

      setSuccess("Google login successful!");

      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (firebaseError) {
      console.error(
        "Google login error:",
        firebaseError
      );

      const errorCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code ?? ""
            )
          : "";

      setError(getFirebaseError(errorCode));
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==================================================
  // FORGOT PASSWORD
  // ==================================================

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Enter your email address first, then click Forgot password."
      );
      return;
    }

    try {
      setForgotLoading(true);

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      setSuccess(
        "Password reset email sent. Check your inbox."
      );
    } catch (firebaseError) {
      console.error(
        "Password reset error:",
        firebaseError
      );

      const errorCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code ?? ""
            )
          : "";

      setError(getFirebaseError(errorCode));
    } finally {
      setForgotLoading(false);
    }
  };

  // ==================================================
  // OPEN PHONE LOGIN
  // ==================================================

  const openPhoneLogin = () => {
    setError("");
    setSuccess("");

    setPhoneNumber("");
    setVerificationCode("");
    setConfirmationResult(null);
    setPhoneStep("phone");

    setPhoneModal(true);
  };

  // ==================================================
  // CLOSE PHONE LOGIN
  // ==================================================

  const closePhoneLogin = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (recaptchaError) {
        console.error(
          "reCAPTCHA cleanup error:",
          recaptchaError
        );
      }

      recaptchaVerifierRef.current = null;
    }

    setPhoneModal(false);
    setPhoneStep("phone");
    setPhoneNumber("");
    setVerificationCode("");
    setConfirmationResult(null);
    setPhoneLoading(false);
  };

  // ==================================================
  // SEND PHONE OTP
  // ==================================================

  const sendPhoneOTP = async () => {
    setError("");
    setSuccess("");

    const cleanPhone = phoneNumber
      .trim()
      .replace(/\s+/g, "");

    if (!/^\+[1-9]\d{7,14}$/.test(cleanPhone)) {
      setError(
        "Enter a valid phone number with country code. Example: +919876543210"
      );
      return;
    }

    try {
      setPhoneLoading(true);

      // Remove previous reCAPTCHA instance
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (recaptchaError) {
          console.error(
            "Old reCAPTCHA cleanup error:",
            recaptchaError
          );
        }

        recaptchaVerifierRef.current = null;
      }

      const verifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",

          callback: () => {
            setError("");
          },

          "expired-callback": () => {
            setError(
              "reCAPTCHA expired. Please verify again."
            );
          },
        }
      );

      recaptchaVerifierRef.current = verifier;

      const result = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        verifier
      );

      setConfirmationResult(result);
      setPhoneStep("otp");

      setSuccess(
        "Verification code sent to your phone."
      );
    } catch (firebaseError) {
      console.error(
        "Phone OTP error:",
        firebaseError
      );

      const errorCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code ?? ""
            )
          : "";

      setError(getFirebaseError(errorCode));

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (recaptchaError) {
          console.error(
            "reCAPTCHA cleanup error:",
            recaptchaError
          );
        }

        recaptchaVerifierRef.current = null;
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  // ==================================================
  // VERIFY PHONE OTP
  // ==================================================

  const verifyPhoneOTP = async () => {
    setError("");
    setSuccess("");

    if (!confirmationResult) {
      setError(
        "Please request a new verification code."
      );
      return;
    }

    const code = verificationCode.trim();

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    try {
      setPhoneLoading(true);

      // Confirm the OTP with Firebase
      const result = await confirmationResult.confirm(
        code
      );

      // Make sure Firebase returned a signed-in user
      if (!result.user) {
        setError(
          "Phone verification completed, but sign-in failed."
        );
        return;
      }

      console.log(
        "Phone login successful:",
        result.user.uid
      );

      setSuccess("Phone login successful!");

      // Clean up reCAPTCHA
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (recaptchaError) {
          console.error(
            "reCAPTCHA cleanup error:",
            recaptchaError
          );
        }

        recaptchaVerifierRef.current = null;
      }

      setPhoneModal(false);
      setPhoneStep("phone");
      setPhoneNumber("");
      setVerificationCode("");
      setConfirmationResult(null);

      // Force the browser to load the dashboard route
      // after Firebase authentication has completed.
      window.location.replace("/");
    } catch (firebaseError) {
      console.error(
        "OTP verification error:",
        firebaseError
      );

      const errorCode =
        firebaseError &&
        typeof firebaseError === "object" &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code ?? ""
            )
          : "";

      setError(getFirebaseError(errorCode));
    } finally {
      setPhoneLoading(false);
    }
  };

  // ==================================================
  // CHANGE PHONE NUMBER
  // ==================================================

  const changePhoneNumber = () => {
    setError("");
    setSuccess("");

    setPhoneStep("phone");
    setVerificationCode("");
    setConfirmationResult(null);

    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (recaptchaError) {
        console.error(
          "reCAPTCHA cleanup error:",
          recaptchaError
        );
      }

      recaptchaVerifierRef.current = null;
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* MAIN LOGIN */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <span className="text-xl font-black text-white">
                T
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white">
              TAGIT
              <span className="text-indigo-400">
                Store
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Welcome back! Sign in to continue.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Sign in
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Access your TAGITStore dashboard
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-5 text-emerald-300">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>
              </div>
            )}

            {/* EMAIL LOGIN FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-200">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {forgotLoading
                      ? "Sending..."
                      : "Forgot password?"}
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />

                <span>Remember me</span>
              </label>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[11px] font-semibold tracking-wide text-slate-500">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-blue-500">
                  G
                </span>
              )}

              {googleLoading
                ? "Connecting..."
                : "Continue with Google"}
            </button>

            {/* PHONE */}
            <button
              type="button"
              onClick={openPhoneLogin}
              className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <Phone
                size={19}
                className="text-cyan-400"
              />

              Continue with Phone
            </button>

            {/* SIGN UP */}
            <p className="mt-7 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Create account
              </button>
            </p>
          </div>

          {/* SECURITY */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} />

            Secure authentication powered by Firebase
          </div>
        </div>
      </div>

      {/* PHONE LOGIN MODAL */}
      {phoneModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-7">
            {/* CLOSE */}
            <button
              type="button"
              onClick={closePhoneLogin}
              aria-label="Close phone login"
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* ICON */}
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Phone size={23} />
            </div>

            {/* TITLE */}
            <h3 className="text-2xl font-bold text-white">
              {phoneStep === "phone"
                ? "Phone sign in"
                : "Verify your phone"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {phoneStep === "phone"
                ? "Enter your phone number and we'll send you a verification code."
                : `Enter the 6-digit code sent to ${phoneNumber}.`}
            </p>

            {/* MODAL ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* PHONE STEP */}
            {phoneStep === "phone" && (
              <>
                <div className="mt-6">
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
                      onChange={(event) =>
                        setPhoneNumber(
                          event.target.value
                        )
                      }
                      placeholder="+919876543210"
                      autoComplete="tel"
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-950 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>
                </div>

                {/* RECAPTCHA */}
                <div className="mt-5 flex justify-center">
                  <div id="recaptcha-container" />
                </div>

                {/* SEND OTP */}
                <button
                  type="button"
                  onClick={sendPhoneOTP}
                  disabled={phoneLoading}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phoneLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Sending code...
                    </>
                  ) : (
                    <>
                      Send verification code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}

            {/* OTP STEP */}
            {phoneStep === "otp" && (
              <>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Verification code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="000000"
                    autoComplete="one-time-code"
                    className="h-14 w-full rounded-xl border border-white/10 bg-slate-950 text-center text-2xl font-bold tracking-[0.4em] text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>

                {/* VERIFY */}
                <button
                  type="button"
                  onClick={verifyPhoneOTP}
                  disabled={phoneLoading}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <>
                      Verify & Sign in
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>

                {/* CHANGE NUMBER */}
                <button
                  type="button"
                  onClick={changePhoneNumber}
                  className="mt-4 w-full text-center text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  Use a different phone number
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}