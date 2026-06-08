import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN_EMAIL } from "@/lib/utils";

export default function AdminRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  const email = user?.primaryEmailAddress?.emailAddress;
  if (email !== ADMIN_EMAIL) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
