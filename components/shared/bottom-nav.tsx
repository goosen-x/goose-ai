"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, History, Wallet, Settings } from "lucide-react";

const navItems = [
  { href: "/", icon: MessageSquare, label: "Chat" },
  { href: "/history", icon: History, label: "History" },
  { href: "/balance", icon: Wallet, label: "Balance" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex h-full items-center justify-around max-w-2xl mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 cursor-pointer",
                "transition-colors rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
