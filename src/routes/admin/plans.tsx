import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/plans")({
  head: () => ({ meta: [{ title: "Challenges — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PlansPage,
});

type Plan = {
  id?: string; slug: string; name: string; account_size: number; price: number;
  profit_split: number; profit_target: number; max_daily_loss: number; max_total_loss: number;
  duration_days: number | null; is_active: boolean; sort_order: number;
};

const empty: Plan = { slug: "", name: "", account_size: 0, price: 0, profit_split: 80, profit_target: 10, max_daily_loss: 5, max_total_loss: 10, duration_days: null, is_active: true, sort_order: 0 };

function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("plans").select("*").order("sort_order");
    setPlans((data as Plan[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() { setEditing({ ...empty }); setOpen(true); }
  function openEdit(p: Plan) { setEditing({ ...p }); setOpen(true); }

  async function save() {
    if (!editing) return;
    const payload = { ...editing };
    delete (payload as any).id;
    const { error } = editing.id
      ? await supabase.from("plans").update(payload).eq("id", editing.id)
      : await supabase.from("plans").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setOpen(false); load();
  }

  async function del(id: string) {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  async function toggleActive(p: Plan) {
    await supabase.from("plans").update({ is_active: !p.is_active }).eq("id", p.id!);
    load();
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New plan</Button>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40"><tr><th className="text-left p-4">Order</th><th className="text-left p-4">Slug</th><th className="text-left p-4">Name</th><th className="text-left p-4">Account</th><th className="text-left p-4">Price</th><th className="text-left p-4">Split</th><th className="text-left p-4">Active</th><th className="text-right p-4">Actions</th></tr></thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-border/20">
                  <td className="p-4">{p.sort_order}</td>
                  <td className="p-4 font-mono text-xs">{p.slug}</td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">${Number(p.account_size).toLocaleString()}</td>
                  <td className="p-4 font-semibold">${p.price}</td>
                  <td className="p-4">{p.profit_split}%</td>
                  <td className="p-4"><Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} /></td>
                  <td className="p-4 text-right space-x-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => del(p.id!)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit plan" : "New plan"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Account size</Label><Input type="number" value={editing.account_size} onChange={(e) => setEditing({ ...editing, account_size: +e.target.value })} /></div>
              <div><Label>Price ($)</Label><Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} /></div>
              <div><Label>Profit split (%)</Label><Input type="number" value={editing.profit_split} onChange={(e) => setEditing({ ...editing, profit_split: +e.target.value })} /></div>
              <div><Label>Profit target (%)</Label><Input type="number" value={editing.profit_target} onChange={(e) => setEditing({ ...editing, profit_target: +e.target.value })} /></div>
              <div><Label>Max daily loss (%)</Label><Input type="number" value={editing.max_daily_loss} onChange={(e) => setEditing({ ...editing, max_daily_loss: +e.target.value })} /></div>
              <div><Label>Max total loss (%)</Label><Input type="number" value={editing.max_total_loss} onChange={(e) => setEditing({ ...editing, max_total_loss: +e.target.value })} /></div>
              <div><Label>Duration (days)</Label><Input type="number" value={editing.duration_days ?? ""} onChange={(e) => setEditing({ ...editing, duration_days: e.target.value ? +e.target.value : null })} /></div>
              <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })} /></div>
              <div className="col-span-2 flex items-center gap-3"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
              <Button onClick={save} className="col-span-2 bg-gradient-primary text-primary-foreground">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
