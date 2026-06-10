import { useUser } from "@clerk/clerk-react";
import { UserCircle, Mail, Calendar } from "lucide-react";

export default function DashboardProfile() {
  const { user } = useUser();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
  const email = user?.primaryEmailAddress?.emailAddress || "—";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1.5">Your account details.</p>
      </div>

      <div className="glass-hover rounded-2xl p-6 flex items-center gap-5">
        {user?.imageUrl
          ? <img src={user.imageUrl} alt={name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/30" />
          : <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
              <UserCircle className="h-8 w-8 text-[hsl(222,47%,8%)]" />
            </div>
        }
        <div>
          <div className="font-display font-bold text-xl">{name}</div>
          <div className="text-muted-foreground text-sm mt-0.5">{email}</div>
        </div>
      </div>

      <div className="glass rounded-2xl divide-y divide-white/5">
        {[
          { icon: UserCircle, label: "Full name", value: name },
          { icon: Mail, label: "Email address", value: email },
          { icon: Calendar, label: "Member since", value: joined },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-4 px-6 py-4">
            <row.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">{row.label}</div>
              <div className="text-sm font-medium truncate">{row.value}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        To update your name or profile picture, visit your account settings.
      </p>
    </div>
  );
}
