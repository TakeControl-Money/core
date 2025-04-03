import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-30" />
      <div className="mx-auto container relative flex min-h-[70vh] flex-col items-center justify-center gap-8 py-16 text-center">
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Take Control of Your{" "}
          <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Money
          </span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Create or join decentralized money management pools. Invest USDC, earn
          pool share tokens, and let expert managers grow your assets.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pools">
            <Button size="lg">Explore Pools</Button>
          </Link>
          <Link href="/create-pool">
            <Button size="lg" variant="outline">
              Create a Pool
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
