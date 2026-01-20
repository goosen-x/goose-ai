import { Wallet } from "lucide-react";

export default function BalancePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Баланс</h1>
      <p className="text-muted-foreground text-center">
        Здесь будет отображаться ваш баланс и история транзакций
      </p>
    </div>
  );
}
