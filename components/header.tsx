"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@/components/connect-wallet";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Pools", href: "/pools" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">TakeControl.Money</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-foreground/80",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
