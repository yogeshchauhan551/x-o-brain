import { themes, ThemeName } from "@/utils/themeUtils";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {Object.values(themes).map((theme) => (
        <Button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          variant={currentTheme === theme.name ? "default" : "outline"}
          className="transition-all hover:scale-105"
          size="sm"
        >
          <span className="mr-1">{theme.emoji}</span>
          {theme.label}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;
