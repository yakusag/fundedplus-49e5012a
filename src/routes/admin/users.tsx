import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { adminListUsers, adminToggleAdminRole, adminDeleteUser } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: UsersPage,
});

function UsersPage() {
  const listFn = useServerFn(adminListUsers);
  const toggleFn = useServerFn(adminToggleAdminRole);
  const delFn = useServerFn(adminDeleteUser);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    try {
      await toggleFn({ data: { userId, makeAdmin: !isAdmin } });
      toast.success(isAdmin ? "Admin removed" : "Admin granted");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) { toast.error(e.message); }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await delFn({ data: { userId } });
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) { toast.error(e.message); }
  }

  const filtered = users.filter((u: any) =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Users</h1>
        <Input placeholder="Search by email or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40">
              <tr><th className="text-left p-4">Email</th><th className="text-left p-4">Name</th><th className="text-left p-4">Country</th><th className="text-left p-4">Role</th><th className="text-left p-4">Joined</th><th className="text-right p-4">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => {
                const isAdmin = u.roles?.includes("admin");
                return (
                  <tr key={u.id} className="border-b border-border/20">
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.full_name || "—"}</td>
                    <td className="p-4">{u.country || "—"}</td>
                    <td className="p-4">{isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="secondary">User</Badge>}</td>
                    <td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => toggleAdmin(u.id, isAdmin)}>
                        <Shield className="h-3 w-3 mr-1" />{isAdmin ? "Revoke admin" : "Make admin"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteUser(u.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
