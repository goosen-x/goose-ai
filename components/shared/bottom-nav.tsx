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
    <nav className="flex shrink-0 items-center justify-around border-t bg-background px-2 py-2">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-colors",
              isActive
                ? "text-foreground bg-secondary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
