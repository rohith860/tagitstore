import {
  useEffect,
  useState,
} from "react";

import { Navigate } from "react-router-dom";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "../firebase";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    console.log(
      "🔐 Checking Firebase authentication..."
    );

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          console.log(
            "🔥 Firebase auth state:",
            currentUser
          );

          if (currentUser) {
            console.log(
              "✅ Authenticated user:",
              currentUser.email ||
                currentUser.phoneNumber ||
                currentUser.uid
            );
          } else {
            console.log(
              "❌ No authenticated user"
            );
          }

          setUser(currentUser);
          setCheckingAuth(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // Loading
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    console.log(
      "🚫 No user → redirecting to login"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Logged in
  console.log(
    "🚀 User authenticated → Dashboard"
  );

  return <>{children}</>;
}