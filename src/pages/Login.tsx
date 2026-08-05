import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";




import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
    }

    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  } catch (error: any) {
    alert(error.message);
  }
};

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
  } catch (error: any) {
    alert(error.message);
  }
};

const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent successfully!");
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-slate-800">
          TAGITStore
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          Welcome Back
        </p>

        <div className="mb-5">
          <label className="font-medium text-slate-700">Email</label>

          <div className="flex items-center border rounded-xl mt-2 px-3">
            <Mail className="text-slate-400" size={20} />

             <input
  type="email"
  placeholder="Enter your Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-3 outline-none"
/>
          </div>
        </div>

        <div className="mb-6">
          <label className="font-medium text-slate-700">
            Password
          </label>

          <div className="flex items-center border rounded-xl mt-2 px-3">
            <Lock className="text-slate-400" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">

  <label className="flex items-center gap-2 text-sm">

    <input
      type="checkbox"
      checked={rememberMe}
      onChange={() => setRememberMe(!rememberMe)}
    />

    Remember Me

  </label>
  <div className="text-right mb-6">

  <button
    onClick={() => setShowForgot(true)}
    className="text-indigo-600 hover:underline text-sm"
  >
    Forgot Password?
  </button>

</div>

</div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        <button
  onClick={handleForgotPassword}
  className="w-full mt-4 text-indigo-600 hover:underline"
>
  Forgot Password?
</button>

        <div className="mt-6 text-center">

  <button
    onClick={() => setIsSignup(!isSignup)}
    className="text-indigo-600 hover:underline"
  >
    {isSignup
      ? "Already have an account? Login"
      : "Don't have an account? Sign Up"}
  </button>

</div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t"></div>

          <span className="px-4 text-slate-500 text-sm">
            OR
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 hover:bg-slate-100 transition"
>
  <FcGoogle size={24} />
  Continue with Google
</button>

        <button className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 mt-4 hover:bg-slate-100 transition">
          <Phone className="text-green-600" size={20} />
          Continue with Mobile Number
        </button>

      </div>
      {showForgot && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white rounded-3xl p-8 w-[400px]">

<h2 className="text-2xl font-bold mb-4">
Reset Password
</h2>

<p className="text-slate-500 mb-6">
Enter your email address to receive a password reset link.
</p>

<input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-3 outline-none"
/>

<div className="flex gap-3">

<button
  onClick={async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully!");
      setShowForgot(false);
    } catch (error: any) {
      alert(error.message);
    }
  }}
  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
>
  Send Link
</button>

<button
onClick={()=>setShowForgot(false)}
className="flex-1 bg-gray-300 py-3 rounded-xl"
>
Cancel
</button>

</div>

</div>

</div>

)}
    </div>
  );
}