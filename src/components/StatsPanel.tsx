import { GameStats } from "@/utils/statsUtils";
import { Card } from "@/components/ui/card";

interface StatsPanelProps {
  stats: GameStats;
  className?: string;
}

const StatsPanel = ({ stats, className }: StatsPanelProps) => {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center mb-3">📊 Your Stats</h3>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-2xl font-bold text-green-500">{stats.totalWins}</div>
          <div className="text-xs text-muted-foreground">Wins</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-500">{stats.totalLosses}</div>
          <div className="text-xs text-muted-foreground">Losses</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">{stats.totalTies}</div>
          <div className="text-xs text-muted-foreground">Ties</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-500">{stats.bestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </div>
      </div>
      {stats.currentStreak > 0 && (
        <div className="mt-3 text-center">
          <div className="text-sm font-medium text-orange-500">
            🔥 Current Streak: {stats.currentStreak}
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatsPanel;
