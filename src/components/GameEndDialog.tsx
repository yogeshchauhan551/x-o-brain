import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameEndDialogProps {
  open: boolean;
  winner: "X" | "O" | "tie" | null;
  gameMode: "ai" | "friend";
  onPlayAgain: () => void;
}

const GameEndDialog = ({ open, winner, gameMode, onPlayAgain }: GameEndDialogProps) => {
  const getTitle = () => {
    if (gameMode === "friend") {
      if (winner === "X") return "🎉 Player 1 Wins!";
      if (winner === "O") return "💜 Player 2 Wins!";
      return "🤝 It's a Tie!";
    } else {
      if (winner === "X") return "🎉 You Won!";
      if (winner === "O") return "💻 AI Wins!";
      return "🤝 It's a Tie!";
    }
  };

  const getMessage = () => {
    if (gameMode === "friend") {
      if (winner === "X") return "Congratulations Player 1! 🎊";
      if (winner === "O") return "Congratulations Player 2! 💖";
      return "Well played friends! 🌟";
    } else {
      if (winner === "X") return "Congratulations! You beat the AI!";
      if (winner === "O") return "Better luck next time!";
      return "Well played! Nobody wins this round.";
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className={`sm:max-w-md border ${
        gameMode === "friend" 
          ? "bg-white/95 border-[hsl(280,60%,80%)]"
          : "bg-card border-border"
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-3xl text-center bg-gradient-to-r bg-clip-text text-transparent ${
            gameMode === "friend"
              ? "from-[hsl(320,80%,60%)] via-[hsl(280,90%,65%)] to-[hsl(220,80%,65%)]"
              : "from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)]"
          }`}>
            {getTitle()}
          </DialogTitle>
          <DialogDescription className={`text-center text-lg pt-4 ${
            gameMode === "friend" ? "text-[hsl(280,50%,40%)]" : ""
          }`}>
            {getMessage()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button
            onClick={onPlayAgain}
            className={`w-full transition-opacity ${
              gameMode === "friend"
                ? "bg-gradient-to-r from-[hsl(320,80%,60%)] via-[hsl(280,90%,65%)] to-[hsl(220,80%,65%)] hover:opacity-90"
                : "bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:opacity-90"
            }`}
          >
            Play Again {gameMode === "friend" && "💝"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndDialog;
