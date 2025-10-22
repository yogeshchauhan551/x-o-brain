export interface GameStats {
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  currentStreak: number;
  bestStreak: number;
  lastResult: "win" | "loss" | "tie" | null;
}

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

const STORAGE_KEY_AI = "tic-tac-toe-stats-ai";
const STORAGE_KEY_FRIEND = "tic-tac-toe-stats-friend";

export const loadStats = (mode: "ai" | "friend"): GameStats => {
  const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FRIEND;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : {
    totalWins: 0,
    totalLosses: 0,
    totalTies: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastResult: null,
  };
};

export const saveStats = (mode: "ai" | "friend", stats: GameStats) => {
  const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FRIEND;
  localStorage.setItem(key, JSON.stringify(stats));
};

export const updateStats = (
  mode: "ai" | "friend",
  result: "win" | "loss" | "tie"
): { stats: GameStats; achievements: Achievement[] } => {
  const stats = loadStats(mode);
  const achievements: Achievement[] = [];

  if (result === "win") {
    stats.totalWins++;
    stats.currentStreak = stats.lastResult === "win" ? stats.currentStreak + 1 : 1;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }

    // Check achievements
    if (stats.currentStreak === 3) {
      achievements.push({
        id: "streak_3",
        title: "🔥 3 Wins in a Row!",
        emoji: "🔥",
        description: "You're on fire!",
      });
    }
    if (stats.currentStreak === 5) {
      achievements.push({
        id: "streak_5",
        title: "🏆 Perfect Streak!",
        emoji: "🏆",
        description: "Unstoppable champion!",
      });
    }
    if (stats.totalWins === 10) {
      achievements.push({
        id: "wins_10",
        title: "⭐ 10 Total Wins!",
        emoji: "⭐",
        description: "Expert player!",
      });
    }
  } else if (result === "loss") {
    stats.totalLosses++;
    stats.currentStreak = 0;
  } else {
    stats.totalTies++;
    stats.currentStreak = 0;
  }

  stats.lastResult = result;
  saveStats(mode, stats);

  return { stats, achievements };
};

export const resetStats = (mode: "ai" | "friend") => {
  const key = mode === "ai" ? STORAGE_KEY_AI : STORAGE_KEY_FRIEND;
  localStorage.removeItem(key);
};
