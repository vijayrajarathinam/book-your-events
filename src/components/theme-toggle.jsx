import { useTheme } from "../context/theme-provider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const {
    setTheme, //colorTheme, setColorTheme
  } = useTheme();

  // const colorThemes = [
  //   { name: "Blue", value: "blue", color: "#3b82f6" },
  //   { name: "Green", value: "green", color: "#10b981" },
  //   { name: "Purple", value: "purple", color: "#8b5cf6" },
  //   { name: "Orange", value: "orange", color: "#f97316" },
  //   { name: "Pink", value: "pink", color: "#ec4899" },
  //   { name: "Red", value: "red", color: "#ef4444" },
  // ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel> */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className="mr-2 h-4 w-4">💻</span>
          <span>System</span>
        </DropdownMenuItem>

        {/* <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel> */}

        {/* {colorThemes.map((theme) => (
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
        ))} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
