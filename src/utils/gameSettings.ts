// Game settings management for multi-screen flow
export type GameMode = "ai" | "friend";
export type Difficulty = "easy" | "medium" | "hard";

export interface GameSettings {
  player1Name: string;
  player1Emoji: string;
  player1Color: string;
  player2Name: string;
  player2Emoji: string;
  player2Color: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  theme: string;
}

const DEFAULT_SETTINGS: GameSettings = {
  player1Name: "Player 1",
  player1Emoji: "😊",
  player1Color: "hsl(14 100% 65%)",
  player2Name: "AI",
  player2Emoji: "🤖",
  player2Color: "hsl(189 95% 55%)",
  gameMode: "ai",
  difficulty: "hard",
  theme: "dark",
};

export const saveGameSettings = (settings: Partial<GameSettings>) => {
  const current = loadGameSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem("tic-tac-legend-settings", JSON.stringify(updated));
};

export const loadGameSettings = (): GameSettings => {
  try {
    const saved = localStorage.getItem("tic-tac-legend-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
  return DEFAULT_SETTINGS;
};

export const resetGameSettings = () => {
  localStorage.removeItem("tic-tac-legend-settings");
};
