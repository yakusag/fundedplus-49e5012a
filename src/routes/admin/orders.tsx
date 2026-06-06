import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersPage,
});

type Order = { id: string; user_id: string; amount: number; currency: string; status: string; paytabs_tran_ref: string | null; created_at: string };

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { email: string; full_name: string | null }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const { data: ords } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    const ordList = (ords as Order[]) || [];
    setOrders(ordList);
    const userIds = [...new Set(ordList.map((o) => o.user_id))];
    if (userIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id, email, full_name").in("id", userIds);
      const map: Record<string, any> = {};
      (profs || []).forEach((p: any) => { map[p.id] = { email: p.email, full_name: p.full_name }; });
      setProfiles(map);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Order updated"); load(); }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Order deleted"); load(); }
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.id.includes(s) || profiles[o.user_id]?.email?.toLowerCase().includes(s) || o.paytabs_tran_ref?.toLowerCase().includes(s);
  });

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Input placeholder="Search by email or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40">
              <tr><th className="text-left p-4">Date</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Amount</th><th className="text-left p-4">PayTabs Ref</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/20">
                  <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-4"><div className="font-medium">{profiles[o.user_id]?.full_name || "—"}</div><div className="text-xs text-muted-foreground">{profiles[o.user_id]?.email}</div></td>
                  <td className="p-4 font-semibold">${o.amount} {o.currency}</td>
                  <td className="p-4 font-mono text-xs">{o.paytabs_tran_ref || "—"}</td>
                  <td className="p-4">
                    <Badge variant={o.status === "paid" ? "default" : o.status === "failed" ? "destructive" : "secondary"}>{o.status}</Badge>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                      <SelectTrigger className="w-32 inline-flex"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => deleteOrder(o.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
