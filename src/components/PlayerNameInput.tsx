import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PlayerNameInputProps {
  open: boolean;
  gameMode: "ai" | "friend";
  onSubmit: (player1Name: string, player1Emoji: string, player2Name?: string, player2Emoji?: string) => void;
}

const emojiOptions = ["😊", "🎮", "⚡", "🔥", "💜", "🌟", "🚀", "🎯", "💪", "🦄"];

const PlayerNameInput = ({ open, gameMode, onSubmit }: PlayerNameInputProps) => {
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player1Emoji, setPlayer1Emoji] = useState("😊");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [player2Emoji, setPlayer2Emoji] = useState("🎮");

  const handleSubmit = () => {
    onSubmit(
      player1Name || "Player 1",
      player1Emoji,
      gameMode === "friend" ? player2Name || "Player 2" : undefined,
      gameMode === "friend" ? player2Emoji : undefined
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md font-quicksand">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Welcome! 🎮</DialogTitle>
          <DialogDescription className="text-center">
            Let's personalize your game experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Player 1 */}
          <div className="space-y-2">
            <Label htmlFor="player1">{gameMode === "ai" ? "Your Name" : "Player 1 Name"}</Label>
            <Input
              id="player1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder="Enter name"
              maxLength={15}
            />
            <div className="flex gap-2 flex-wrap">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setPlayer1Emoji(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                    player1Emoji === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Player 2 - only for friend mode */}
          {gameMode === "friend" && (
            <div className="space-y-2">
              <Label htmlFor="player2">Player 2 Name</Label>
              <Input
                id="player2"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Enter name"
                maxLength={15}
              />
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setPlayer2Emoji(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                      player2Emoji === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Let's Play! 🚀
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNameInput;
