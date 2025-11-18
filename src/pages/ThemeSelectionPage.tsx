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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)] animate-fade-in relative overflow-hidden">
      {/* Floating anime particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 text-xl opacity-30 star-twinkle" style={{ animationDelay: '0s' }}>⭐</div>
        <div className="absolute bottom-20 right-1/4 text-2xl opacity-40 petal-fall" style={{ animationDelay: '1s' }}>🌸</div>
        <div className="absolute top-1/3 right-1/5 text-lg opacity-35 star-twinkle" style={{ animationDelay: '2s' }}>✨</div>
      </div>
      
      <div className="w-full max-w-5xl space-y-6 relative z-10">
        <div className="text-center space-y-2 animate-in slide-in-from-top duration-500 cinematic-zoom">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent font-quicksand hero-glow anime-sparkle relative">
            Choose Your Theme
          </h1>
          <p className="text-muted-foreground relative">
            <span className="relative z-10">Pick the style that speaks to you</span>
            <span className="absolute inset-0 blur-md opacity-20 text-pink-300">Pick the style that speaks to you</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 animate-in scale-in delay-200 duration-500">
          {Object.values(themes).filter(theme => ["dark", "pastel", "cyber"].includes(theme.name)).map((theme) => {
            const isSelected = selectedTheme === theme.name;
            return (
            <Card
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                onMouseEnter={playHoverSound}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden hologram-glass cinematic-depth relative group ${
                  isSelected ? "ring-4 ring-primary bloom-pulse" : ""
                }`}
                style={{ 
                  background: theme.cardBg,
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  boxShadow: isSelected ? 'var(--shadow-cinematic)' : 'var(--shadow-hologram)'
                }}
              >
                {/* Cinematic glow sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20 shimmer-sweep" />
                </div>
                
                {/* Anime sparkle trail */}
                <div className="absolute top-2 right-2 text-sm opacity-0 group-hover:opacity-100 star-twinkle" style={{ animationDelay: '0.2s' }}>✨</div>
                
                {/* Neon ring for selected */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse" style={{ boxShadow: '0 0 20px hsl(262 83% 58%)' }} />
                    <div className="absolute -top-2 -right-2 text-2xl star-twinkle">⭐</div>
                  </>
                )}
                <div className="p-6 space-y-4 relative z-10">
                  {/* Theme header */}
                  <div className="text-center relative">
                    <div className="text-5xl mb-2 group-hover:anime-bounce inline-block">{theme.emoji}</div>
                    <h3 className="text-2xl font-bold font-quicksand anime-sparkle" style={{ color: theme.textPrimary }}>
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

                  {/* Selection indicator - Enhanced with star burst */}
                  {isSelected && (
                    <div className="text-center relative">
                      <span className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold bloom-pulse hologram-glass relative">
                        ✓ Selected
                        <div className="absolute -top-1 -left-1 text-xs star-twinkle">💫</div>
                        <div className="absolute -bottom-1 -right-1 text-xs star-twinkle" style={{ animationDelay: '0.5s' }}>✨</div>
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
            className="flex-1 h-14 text-lg hologram-glass hover:bloom-pulse hover:anime-bounce relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">← Back</span>
          </Button>
          <Button
            onClick={handleStart}
            onMouseEnter={playHoverSound}
            size="lg"
            className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:scale-105 transition-transform button-glow-pulse hologram-glass relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shimmer-sweep" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-0 group-hover:opacity-100 star-twinkle">✨</div>
            <span className="relative z-10">Start Game 🎮</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectionPage;
