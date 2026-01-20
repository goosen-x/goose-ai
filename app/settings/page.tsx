import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <Settings className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Настройки</h1>
      <p className="text-muted-foreground text-center">
        Здесь будут настройки приложения
      </p>
    </div>
  );
}
