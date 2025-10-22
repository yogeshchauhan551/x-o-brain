export type ThemeName = "dark" | "pastel" | "nature" | "cyber";

export interface Theme {
  name: ThemeName;
  label: string;
  emoji: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  playerX: string;
  playerO: string;
  cellBg: string;
  cellHover: string;
  winningCell: string;
  buttonGradient: string;
  glowColor: string;
}

export const themes: Record<ThemeName, Theme> = {
  dark: {
    name: "dark",
    label: "Classic Dark",
    emoji: "🌙",
    background: "linear-gradient(180deg, hsl(240 30% 8%), hsl(240 30% 6%))",
    cardBg: "hsl(240 20% 12%)",
    textPrimary: "hsl(0 0% 98%)",
    textSecondary: "hsl(240 5% 65%)",
    playerX: "hsl(14 100% 65%)",
    playerO: "hsl(189 95% 55%)",
    cellBg: "hsl(240 20% 15%)",
    cellHover: "hsl(240 20% 18%)",
    winningCell: "hsl(262 83% 58%)",
    buttonGradient: "linear-gradient(135deg, hsl(262 83% 58%), hsl(280 90% 50%))",
    glowColor: "hsl(262 83% 58% / 0.4)",
  },
  pastel: {
    name: "pastel",
    label: "Soft Pastel",
    emoji: "🌸",
    background: "linear-gradient(135deg, hsl(280 70% 92%), hsl(262 80% 90%), hsl(220 70% 92%))",
    cardBg: "hsl(0 0% 100% / 0.8)",
    textPrimary: "hsl(280 60% 30%)",
    textSecondary: "hsl(280 50% 40%)",
    playerX: "hsl(320 80% 55%)",
    playerO: "hsl(220 80% 60%)",
    cellBg: "linear-gradient(135deg, hsl(280 70% 95%), hsl(260 70% 92%))",
    cellHover: "linear-gradient(135deg, hsl(280 70% 90%), hsl(260 70% 87%))",
    winningCell: "linear-gradient(135deg, hsl(320 80% 70%), hsl(280 80% 70%))",
    buttonGradient: "linear-gradient(135deg, hsl(320 80% 60%), hsl(280 90% 65%), hsl(220 80% 65%))",
    glowColor: "hsl(280 80% 60% / 0.4)",
  },
  nature: {
    name: "nature",
    label: "Nature Green",
    emoji: "🌿",
    background: "linear-gradient(135deg, hsl(160 60% 85%), hsl(190 70% 88%), hsl(140 50% 82%))",
    cardBg: "hsl(0 0% 100% / 0.85)",
    textPrimary: "hsl(160 60% 25%)",
    textSecondary: "hsl(160 40% 40%)",
    playerX: "hsl(25 90% 55%)",
    playerO: "hsl(190 85% 45%)",
    cellBg: "linear-gradient(135deg, hsl(160 50% 92%), hsl(180 50% 90%))",
    cellHover: "linear-gradient(135deg, hsl(160 50% 85%), hsl(180 50% 83%))",
    winningCell: "linear-gradient(135deg, hsl(140 60% 60%), hsl(160 70% 55%))",
    buttonGradient: "linear-gradient(135deg, hsl(140 70% 50%), hsl(160 80% 45%), hsl(180 75% 50%))",
    glowColor: "hsl(160 70% 50% / 0.4)",
  },
  cyber: {
    name: "cyber",
    label: "Neon Cyber",
    emoji: "⚡",
    background: "linear-gradient(135deg, hsl(220 40% 15%), hsl(200 50% 10%), hsl(210 45% 12%))",
    cardBg: "hsl(220 30% 18% / 0.9)",
    textPrimary: "hsl(180 100% 80%)",
    textSecondary: "hsl(180 60% 60%)",
    playerX: "hsl(330 100% 65%)",
    playerO: "hsl(180 100% 50%)",
    cellBg: "hsl(220 30% 20%)",
    cellHover: "hsl(220 30% 25%)",
    winningCell: "hsl(180 100% 50%)",
    buttonGradient: "linear-gradient(135deg, hsl(180 100% 40%), hsl(200 100% 45%), hsl(220 100% 50%))",
    glowColor: "hsl(180 100% 50% / 0.5)",
  },
};

export const getTheme = (name: ThemeName): Theme => themes[name];

export const saveTheme = (theme: ThemeName) => {
  localStorage.setItem("tic-tac-toe-theme", theme);
};

export const loadTheme = (): ThemeName => {
  const saved = localStorage.getItem("tic-tac-toe-theme");
  return (saved as ThemeName) || "dark";
};
