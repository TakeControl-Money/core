import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { PoolList } from "@/components/pool-list";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Top Performing Pools</h2>
          <Link href="/pools">
            <Button variant="outline">View All Pools</Button>
          </Link>
        </div>
        <PoolList limit={3} />
      </div>
      <HowItWorks />
    </div>
  );
}
