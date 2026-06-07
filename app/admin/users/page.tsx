import { clerkClient } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Users — Admin" };

export default async function AdminUsersPage() {
  const { data: users } = await clerkClient.users.getUserList({ limit: 100 });

  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/40">
            <tr>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdmin = u.publicMetadata?.role === "admin";
              return (
                <tr key={u.id} className="border-b border-border/20">
                  <td className="p-4">{u.emailAddresses[0]?.emailAddress || "—"}</td>
                  <td className="p-4">{u.firstName} {u.lastName}</td>
                  <td className="p-4">
                    {isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="secondary">User</Badge>}
                  </td>
                  <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No users</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        To grant admin: Clerk Dashboard → Users → Edit → Public metadata → <code className="text-primary">{`{"role": "admin"}`}</code>
      </p>
    </div>
  );
}
