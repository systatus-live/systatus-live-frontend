import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

type Props = {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Sun size={14} className={!isDark ? "text-foreground" : ""} />
      <Switch checked={isDark} onCheckedChange={onToggle} />
      <Moon size={14} className={isDark ? "text-foreground" : ""} />
    </div>
  );
}
