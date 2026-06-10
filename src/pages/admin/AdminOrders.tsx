import { ShoppingBag, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminOrders() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1.5">All challenge purchases and payment records.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
        <Badge variant="outline">0 orders</Badge>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-muted-foreground">
          <span>Order ID</span><span>User</span><span>Plan</span><span>Amount</span><span>Status</span>
        </div>
        <div className="p-12 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No orders yet. PayTabs webhooks will populate orders here after successful payments.</p>
        </div>
      </div>
    </div>
  );
}
