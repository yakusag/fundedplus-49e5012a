import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Challenges from "@/pages/Challenges";
import FAQ from "@/pages/FAQ";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardChallenges from "@/pages/dashboard/DashboardChallenges";
import DashboardCheckout from "@/pages/dashboard/DashboardCheckout";
import DashboardPayouts from "@/pages/dashboard/DashboardPayouts";
import DashboardProfile from "@/pages/dashboard/DashboardProfile";
import DashboardAccounts from "@/pages/dashboard/DashboardAccounts";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminPayouts from "@/pages/admin/AdminPayouts";
import AdminGithub from "@/pages/admin/AdminGithub";
import AdminMetaAPI from "@/pages/admin/AdminMetaAPI";
import AdminAccountPool from "@/pages/admin/AdminAccountPool";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Auth — Clerk hosted components */}
        <Route path="/sign-in/*" element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/dashboard" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/dashboard" />
          </div>
        } />

        {/* Dashboard — protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/challenges" element={<DashboardChallenges />} />
            <Route path="/dashboard/checkout/:planId" element={<DashboardCheckout />} />
            <Route path="/dashboard/accounts" element={<DashboardAccounts />} />
            <Route path="/dashboard/payouts" element={<DashboardPayouts />} />
            <Route path="/dashboard/profile" element={<DashboardProfile />} />
          </Route>
        </Route>

        {/* Admin — admin only */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/payouts" element={<AdminPayouts />} />
            <Route path="/admin/github" element={<AdminGithub />} />
            <Route path="/admin/metaapi" element={<AdminMetaAPI />} />
            <Route path="/admin/accounts" element={<AdminAccountPool />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
