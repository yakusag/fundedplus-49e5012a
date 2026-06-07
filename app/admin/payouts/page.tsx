export const metadata = { title: "Payouts — Admin" };

export default function AdminPayoutsPage() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Payouts</h1>
      <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
        <p>Payout requests will appear here once you connect a database.</p>
      </div>
    </div>
  );
}
