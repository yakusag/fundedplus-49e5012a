import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/payouts")({
  head: () => ({ meta: [{ title: "Payouts — FundedPlus" }] }),
  component: () => (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold">Payouts</h1>
      <p className="text-muted-foreground mt-1">Track and request withdrawals from your funded accounts.</p>
      <div className="glass rounded-2xl p-12 mt-8 text-center">
        <p className="text-muted-foreground">No payouts yet. Pass a challenge to start earning.</p>
      </div>
    </div>
  ),
});
