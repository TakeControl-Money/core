import { UserPools } from "@/components/user-pools";
import { UserInvestments } from "@/components/user-investments";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Link href="/create-pool">
          <Button>Create New Pool</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Your Pools</h2>
          <UserPools />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Your Investments</h2>
          <UserInvestments />
        </div>
      </div>
    </div>
  );
}
