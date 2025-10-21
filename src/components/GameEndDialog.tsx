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
  onPlayAgain: () => void;
}

const GameEndDialog = ({ open, winner, onPlayAgain }: GameEndDialogProps) => {
  const getTitle = () => {
    if (winner === "X") return "🎉 You Won!";
    if (winner === "O") return "💻 AI Wins!";
    return "🤝 It's a Tie!";
  };

  const getMessage = () => {
    if (winner === "X") return "Congratulations! You beat the AI!";
    if (winner === "O") return "Better luck next time!";
    return "Well played! Nobody wins this round.";
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-4">
            {getMessage()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:opacity-90 transition-opacity"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndDialog;
