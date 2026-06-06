import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
        <span className="font-display text-base font-bold text-primary-foreground">F+</span>
      </div>
      <span className="font-display text-xl font-bold tracking-tight">
        Funded<span className="text-gradient">Plus</span>
      </span>
    </Link>
  );
}
