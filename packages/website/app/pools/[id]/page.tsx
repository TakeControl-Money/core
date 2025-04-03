import { PoolHeader } from "@/components/pool-header";
import { PoolStats } from "@/components/pool-stats";
import { PoolActions } from "@/components/pool-actions";
import { PoolTransactions } from "@/components/pool-transactions";
import { PoolAssets } from "@/components/pool-assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <PoolHeader id={id} />
      <PoolStats id={id} />
      <div className="mt-8">
        <Tabs defaultValue="assets">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="mt-6">
            <PoolAssets id={id} />
          </TabsContent>
          <TabsContent value="transactions" className="mt-6">
            <PoolTransactions id={id} />
          </TabsContent>
          <TabsContent value="investors" className="mt-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-medium">Pool Investors</h3>
              {/* Investor list component would go here */}
            </div>
          </TabsContent>
          <TabsContent value="actions" className="mt-6">
            <PoolActions id={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
