import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Theme } from "@/utils/themeUtils";

interface GameEndDialogProps {
  open: boolean;
  winner: "X" | "O" | "tie" | null;
  gameMode: "ai" | "friend";
  player1Name: string;
  player2Name: string;
  player1Emoji: string;
  player2Emoji: string;
  playerSymbol: "X" | "O";
  onPlayAgain: () => void;
  theme: Theme;
}

const GameEndDialog = ({ open, winner, gameMode, player1Name, player2Name, player1Emoji, player2Emoji, playerSymbol, onPlayAgain, theme }: GameEndDialogProps) => {
  const getTitle = () => {
    if (gameMode === "friend") {
      if (winner === "X") return `${player1Emoji} ${player1Name} Wins!`;
      if (winner === "O") return `${player2Emoji} ${player2Name} Wins!`;
      return "🤝 It's a Tie!";
    } else {
      if (winner === playerSymbol) return `${player1Emoji} ${player1Name} Won!`;
      return winner === (playerSymbol === "X" ? "O" : "X") ? `${player2Emoji} ${player2Name} Wins!` : "🤝 It's a Tie!";
    }
  };

  const getMessage = () => {
    if (winner === "tie") return "Well played! 🌟";
    if (gameMode === "friend") return winner === "X" ? `Congrats ${player1Name}! 🎊` : `Congrats ${player2Name}! 💖`;
    return winner === playerSymbol ? `Congrats ${player1Name}!` : `${player2Name} wins!`;
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md border-2 font-quicksand" style={{ background: theme.cardBg, borderColor: theme.glowColor }}>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-bold" style={{ backgroundImage: theme.buttonGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{getTitle()}</DialogTitle>
          <DialogDescription className="text-center text-lg pt-4" style={{ color: theme.textSecondary }}>{getMessage()}</DialogDescription>
        </DialogHeader>
        <Button onClick={onPlayAgain} className="w-full font-semibold hover:scale-105" style={{ background: theme.buttonGradient, boxShadow: `0 4px 14px ${theme.glowColor}` }}>Play Again 🔁</Button>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndDialog;
