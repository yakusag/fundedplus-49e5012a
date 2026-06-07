export const metadata = { title: "Orders — Admin" };

export default function AdminOrdersPage() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
        <p>Orders will appear here once you connect a database.</p>
        <p className="mt-2 text-xs">PayTabs payments are logged via the webhook at <code className="text-primary">/api/paytabs-webhook</code></p>
      </div>
    </div>
  );
}
