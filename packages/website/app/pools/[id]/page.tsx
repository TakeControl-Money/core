import PoolPageCode from "./index";

export default async function PoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PoolPageCode id={id} />;
}
