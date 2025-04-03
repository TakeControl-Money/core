import { CreatePoolForm } from "@/components/create-pool-form";

export default function CreatePoolPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-8 text-4xl font-bold">Create a New Pool</h1>
      <CreatePoolForm />
    </div>
  );
}
