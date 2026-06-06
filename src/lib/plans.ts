export type Plan = {
  id: string;
  size: number;
  label: string;
  price: number;
  profitTarget: number;
  maxDrawdown: number;
  dailyDrawdown: number;
  profitShare: number;
};

export const PLANS: Plan[] = [
  { id: "5k", size: 5000, label: "$5K", price: 49, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 80 },
  { id: "10k", size: 10000, label: "$10K", price: 89, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 80 },
  { id: "25k", size: 25000, label: "$25K", price: 179, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 85 },
  { id: "50k", size: 50000, label: "$50K", price: 299, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 85 },
  { id: "100k", size: 100000, label: "$100K", price: 499, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 90 },
  { id: "200k", size: 200000, label: "$200K", price: 949, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, profitShare: 90 },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
