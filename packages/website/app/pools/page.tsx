import { PoolList } from "@/components/pool-list";
import { PoolFilters } from "@/components/pool-filters";

export default function PoolsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">Explore Pools</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <PoolFilters />
        </div>
        <div className="md:col-span-3">
          <PoolList />
        </div>
      </div>
    </div>
  );
}
