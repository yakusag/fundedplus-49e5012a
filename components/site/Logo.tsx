import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
        <span className="font-display text-base font-bold text-[hsl(222,47%,11%)]">F+</span>
      </div>
      <span className="font-display text-xl font-bold tracking-tight">
        Funded<span className="text-gradient">Plus</span>
      </span>
    </Link>
  );
}
