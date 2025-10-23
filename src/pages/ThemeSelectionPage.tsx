import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { themes, ThemeName } from "@/utils/themeUtils";
import { saveGameSettings, loadGameSettings } from "@/utils/gameSettings";
import { playHoverSound, playClickSound } from "@/utils/soundUtils";

const ThemeSelectionPage = () => {
  const navigate = useNavigate();
  const settings = loadGameSettings();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(settings.theme as ThemeName || "dark");

  const handleThemeSelect = (themeName: ThemeName) => {
    setSelectedTheme(themeName);
    playClickSound();
  };

  const handleStart = () => {
    playClickSound();
    saveGameSettings({ theme: selectedTheme });
    navigate("/game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)] animate-fade-in">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center space-y-2 animate-in slide-in-from-top duration-500">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent font-quicksand">
            Choose Your Theme
          </h1>
          <p className="text-muted-foreground">Pick the style that speaks to you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 animate-in scale-in delay-200 duration-500">
          {Object.values(themes).filter(theme => ["dark", "pastel", "cyber"].includes(theme.name)).map((theme) => {
            const isSelected = selectedTheme === theme.name;
            return (
              <Card
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                onMouseEnter={playHoverSound}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden ${
                  isSelected ? "ring-4 ring-primary shadow-[0_0_40px_rgba(167,139,250,0.6)]" : ""
                }`}
                style={{ 
                  background: theme.cardBg,
                  transform: isSelected ? "scale(1.05)" : "scale(1)"
                }}
              >
                <div className="p-6 space-y-4">
                  {/* Theme header */}
                  <div className="text-center">
                    <div className="text-5xl mb-2">{theme.emoji}</div>
                    <h3 className="text-2xl font-bold font-quicksand" style={{ color: theme.textPrimary }}>
                      {theme.label}
                    </h3>
                  </div>

                  {/* Mini game board preview */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: theme.background }}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {["X", "O", "X", "O", "X", "O", "", "", ""].map((cell, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all"
                          style={{
                            background: i === 4 ? theme.winningCell : theme.cellBg,
                            color: cell === "X" ? theme.playerX : cell === "O" ? theme.playerO : "transparent",
                            boxShadow: i === 4 ? `0 0 15px ${theme.glowColor}` : "none"
                          }}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theme description */}
                  <p className="text-center text-sm" style={{ color: theme.textSecondary }}>
                    {theme.name === "dark" && "Classic elegance with deep purples"}
                    {theme.name === "pastel" && "Soft, dreamy colors that soothe"}
                    {theme.name === "cyber" && "Futuristic neon that electrifies"}
                  </p>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold animate-pulse">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => navigate("/setup")}
            onMouseEnter={playHoverSound}
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-lg"
          >
            ← Back
          </Button>
          <Button
            onClick={handleStart}
            onMouseEnter={playHoverSound}
            size="lg"
            className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:scale-105 transition-transform shadow-[0_0_40px_rgba(167,139,250,0.6)]"
          >
            Start Game 🎮
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionPage;
