import { useTheme } from "../context/theme-provider";
import { Button } from "./ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  const colorThemes = [
    { name: "Blue", value: "blue", color: "#3b82f6" },
    { name: "Green", value: "green", color: "#10b981" },
    { name: "Purple", value: "purple", color: "#8b5cf6" },
    { name: "Orange", value: "orange", color: "#f97316" },
    { name: "Pink", value: "pink", color: "#ec4899" },
    { name: "Red", value: "red", color: "#ef4444" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setColorTheme(theme.value)}
            className="flex items-center"
          >
            <div
              className="mr-2 h-4 w-4 rounded-full"
              style={{ backgroundColor: theme.color }}
            />
            <span>{theme.name}</span>
            {colorTheme === theme.value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
