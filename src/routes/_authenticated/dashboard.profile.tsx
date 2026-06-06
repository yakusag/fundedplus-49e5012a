import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Route as AuthRoute } from "./route";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — FundedPlus" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = AuthRoute.useRouteContext();
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name || "");
      setCountry(data?.country || "");
      setPhone(data?.phone || "");
      setLoading(false);
    });
  }, [user.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, country, phone }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  if (loading) return <div className="p-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={user.email || ""} disabled />
        </div>
        <div>
          <Label htmlFor="fn">Full name</Label>
          <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="co">Country</Label>
          <Input id="co" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ph">Phone</Label>
          <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
