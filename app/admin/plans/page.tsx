import { PLANS } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Challenges — Admin" };

export default function AdminPlansPage() {
  return (
    <div className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-bold">Challenges</h1>
      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/40">
            <tr>
              <th className="text-left p-4">Account</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Profit Target</th>
              <th className="text-left p-4">Max DD</th>
              <th className="text-left p-4">Profit Split</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((p) => (
              <tr key={p.id} className="border-b border-border/20">
                <td className="p-4 font-semibold">{p.label}</td>
                <td className="p-4 text-gradient font-bold">${p.price}</td>
                <td className="p-4">{p.profitTarget}%</td>
                <td className="p-4">{p.maxDrawdown}%</td>
                <td className="p-4">{p.profitShare}%</td>
                <td className="p-4"><Badge>Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
