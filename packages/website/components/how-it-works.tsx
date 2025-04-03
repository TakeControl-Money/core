import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, TrendingUp, BarChart3, Users } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-purple-500" />,
      title: "Create or Join a Pool",
      description:
        "Start your own money management pool or invest USDC in existing pools to receive share tokens.",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-cyan-500" />,
      title: "Execute DeFi Strategies",
      description:
        "Pool managers can swap, lend, stake, and more across various DeFi protocols to grow the pool's value.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-green-500" />,
      title: "Track Performance",
      description:
        "Monitor your pool's performance with detailed analytics and transaction history.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: "Earn Rewards",
      description:
        "Pool managers earn commission on profits, while investors benefit from professional management.",
    },
  ];

  return (
    <div className="bg-muted/50 py-16">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            TakeControl.Money makes decentralized money management simple
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title} className="border-none">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-background p-3">
                  {step.icon}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
