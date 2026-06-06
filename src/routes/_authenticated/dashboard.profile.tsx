import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "@clerk/clerk-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — FundedPlus" }] }),
  component: () => (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <UserProfile routing="hash" />
    </div>
  ),
});
