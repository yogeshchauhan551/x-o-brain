import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveGameSettings, loadGameSettings, GameMode, Difficulty } from "@/utils/gameSettings";
import { playHoverSound, playClickSound } from "@/utils/soundUtils";

const EMOJI_OPTIONS = ["😊", "😎", "🤩", "😈", "🤖", "👾", "🎮", "⚡", "🔥", "💫", "🌟", "💜"];

const COLOR_OPTIONS = [
  { label: "Red", value: "hsl(14 100% 65%)" },
  { label: "Blue", value: "hsl(189 95% 55%)" },
  { label: "Purple", value: "hsl(262 83% 58%)" },
  { label: "Green", value: "hsl(140 70% 50%)" },
  { label: "Orange", value: "hsl(25 90% 55%)" },
  { label: "Pink", value: "hsl(320 80% 60%)" },
  { label: "Cyan", value: "hsl(180 100% 50%)" },
  { label: "Yellow", value: "hsl(50 100% 50%)" },
];

const PlayerSetupPage = () => {
  const navigate = useNavigate();
  const settings = loadGameSettings();
  
  const [player1Name, setPlayer1Name] = useState(settings.player1Name);
  const [player1Emoji, setPlayer1Emoji] = useState(settings.player1Emoji);
  const [player1Color, setPlayer1Color] = useState(settings.player1Color);
  const [player2Name, setPlayer2Name] = useState(settings.player2Name);
  const [player2Emoji, setPlayer2Emoji] = useState(settings.player2Emoji);
  const [player2Color, setPlayer2Color] = useState(settings.player2Color);
  const [gameMode, setGameMode] = useState<GameMode>(settings.gameMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(settings.difficulty);

  const handleContinue = () => {
    playClickSound();
    saveGameSettings({
      player1Name: player1Name.trim() || "Player 1",
      player1Emoji,
      player1Color,
      player2Name: gameMode === "ai" ? "AI" : (player2Name.trim() || "Player 2"),
      player2Emoji: gameMode === "ai" ? "🤖" : player2Emoji,
      player2Color,
      gameMode,
      difficulty,
    });
    navigate("/theme");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)] animate-fade-in">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2 animate-in slide-in-from-top duration-500">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent font-quicksand">
            Setup Your Game
          </h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <Card className="p-6 bg-[hsl(240,20%,12%)] border-[hsl(240,20%,20%)] space-y-6 animate-in scale-in delay-200 duration-500">
          {/* Game Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Game Mode</label>
            <Select value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">🤖 Play vs AI</SelectItem>
                <SelectItem value="friend">💝 Play vs Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty (AI mode only) */}
          {gameMode === "ai" && (
            <div className="space-y-2 animate-in slide-in-from-left duration-300">
              <label className="text-sm font-medium text-foreground">AI Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Perfect for beginners 😊</SelectItem>
                  <SelectItem value="medium">Medium - Smart moves 🎯</SelectItem>
                  <SelectItem value="hard">Hard - Unbeatable 🤖</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Player 1 */}
          <div className="space-y-4 p-4 bg-[hsl(240,20%,15%)] rounded-lg">
            <h3 className="font-semibold text-lg">Player 1 (X)</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Enter name"
                maxLength={15}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { setPlayer1Emoji(emoji); playClickSound(); }}
                    className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                      player1Emoji === emoji ? "bg-primary/20 ring-2 ring-primary" : "bg-[hsl(240,20%,18%)]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => { setPlayer1Color(color.value); playClickSound(); }}
                    className={`h-12 rounded-lg transition-all hover:scale-105 ${
                      player1Color === color.value ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    <span className="text-white font-semibold text-xs">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player 2 (Friend mode only) */}
          {gameMode === "friend" && (
            <div className="space-y-4 p-4 bg-[hsl(240,20%,15%)] rounded-lg animate-in slide-in-from-right duration-300">
              <h3 className="font-semibold text-lg">Player 2 (O)</h3>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Enter name"
                  maxLength={15}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setPlayer2Emoji(emoji); playClickSound(); }}
                      className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                        player2Emoji === emoji ? "bg-primary/20 ring-2 ring-primary" : "bg-[hsl(240,20%,18%)]"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => { setPlayer2Color(color.value); playClickSound(); }}
                      className={`h-12 rounded-lg transition-all hover:scale-105 ${
                        player2Color === color.value ? "ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      <span className="text-white font-semibold text-xs">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/")}
            onMouseEnter={playHoverSound}
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-lg"
          >
            ← Back
          </Button>
          <Button
            onClick={handleContinue}
            onMouseEnter={playHoverSound}
            size="lg"
            className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:scale-105 transition-transform"
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetupPage;
