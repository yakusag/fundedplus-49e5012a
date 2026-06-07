import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";

export const metadata = { title: "Profile — FundedPlus" };

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="glass rounded-2xl p-6 mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Email</span>
          <span>{user?.emailAddresses?.[0]?.emailAddress}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Name</span>
          <span>{user?.firstName} {user?.lastName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Member since</span>
          <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
        </div>
      </div>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "glass rounded-2xl border-0 bg-transparent shadow-none",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary: "bg-gradient-primary text-[hsl(222,47%,11%)] hover:opacity-90",
          },
        }}
      />
    </div>
  );
}
