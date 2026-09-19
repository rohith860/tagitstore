import { useEffect, useState } from "react";
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
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return unsubscribe;
  }, []);

  // Wait until Firebase finishes checking the session
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

  // User is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <>{children}</>;
}