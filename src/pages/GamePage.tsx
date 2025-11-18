import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import GameEndDialog from "@/components/GameEndDialog";
import AchievementNotification from "@/components/AchievementNotification";
import ConfettiEffect from "@/components/ConfettiEffect";
import StatsPanel from "@/components/StatsPanel";
import TurnIndicator from "@/components/TurnIndicator";
import SoundToggle from "@/components/SoundToggle";
import { getTheme, ThemeName } from "@/utils/themeUtils";
import { playClickSound, playHoverSound, playWinSound, playDrawSound, saveMuteState, loadMuteState } from "@/utils/soundUtils";
import { updateStats, loadStats, GameStats, Achievement } from "@/utils/statsUtils";
import { loadGameSettings } from "@/utils/gameSettings";

type Player = "X" | "O" | null;
type GameResult = "X" | "O" | "tie" | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const FRIENDLY_MESSAGES = ["Nice Move! 🎯", "Good thinking! 💭", "Smart play! 🧠", "You're a Legend! 💫", "Keep going! 💪", "Amazing! 🌟"];

const GamePage = () => {
  const navigate = useNavigate();
  const settings = loadGameSettings();
  
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<GameResult>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O");
  const [gameOver, setGameOver] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(loadMuteState());
  const [stats, setStats] = useState<GameStats>(loadStats(settings.gameMode));
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const [score, setScore] = useState(() => {
    const key = `tic-tac-legend-score-${settings.gameMode}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : 
      settings.gameMode === "ai" 
        ? { player: 0, computer: 0, ties: 0 }
        : { player1: 0, player2: 0, ties: 0 };
  });

  const theme = getTheme(settings.theme as ThemeName || "dark");
  const gameMode = settings.gameMode;
  const difficulty = settings.difficulty;

  useEffect(() => {
    const key = `tic-tac-legend-score-${gameMode}`;
    localStorage.setItem(key, JSON.stringify(score));
  }, [score, gameMode]);

  useEffect(() => {
    setStats(loadStats(gameMode));
  }, [gameMode]);

  const checkWinner = (currentBoard: Board): { winner: GameResult; line: number[] } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combination };
      }
    }
    if (currentBoard.every(cell => cell !== null)) return { winner: "tie", line: [] };
    return { winner: null, line: [] };
  };

  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean, aiSym: Player, playerSym: Player): number => {
    const result = checkWinner(currentBoard);
    if (result.winner === aiSym) return 10 - depth;
    if (result.winner === playerSym) return depth - 10;
    if (result.winner === "tie") return 0;
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = aiSym;
          bestScore = Math.max(minimax(currentBoard, depth + 1, false, aiSym, playerSym), bestScore);
          currentBoard[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = playerSym;
          bestScore = Math.min(minimax(currentBoard, depth + 1, true, aiSym, playerSym), bestScore);
          currentBoard[i] = null;
        }
      }
      return bestScore;
    }
  };

  const getRandomMove = (currentBoard: Board): number => {
    const available = currentBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null) as number[];
    return available[Math.floor(Math.random() * available.length)];
  };

  const getMediumMove = (currentBoard: Board, aiSym: Player, playerSym: Player): number => {
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = aiSym;
        if (checkWinner(currentBoard).winner === aiSym) {
          currentBoard[i] = null;
          return i;
        }
        currentBoard[i] = null;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = playerSym;
        if (checkWinner(currentBoard).winner === playerSym) {
          currentBoard[i] = null;
          return i;
        }
        currentBoard[i] = null;
      }
    }
    return getRandomMove(currentBoard);
  };

  const makeComputerMove = (currentBoard: Board, aiSym: Player) => {
    if (checkWinner(currentBoard).winner || !currentBoard.some(cell => cell === null)) return;
    let bestMove = -1;
    if (difficulty === "easy") {
      bestMove = getRandomMove(currentBoard);
    } else if (difficulty === "medium") {
      bestMove = getMediumMove(currentBoard, aiSym, playerSymbol);
    } else {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = aiSym;
          const score = minimax(currentBoard, 0, false, aiSym, playerSymbol);
          currentBoard[i] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
    }
    if (bestMove !== -1) {
      const newBoard = [...currentBoard];
      newBoard[bestMove] = aiSym;
      setBoard(newBoard);
      playClickSound();
      const result = checkWinner(newBoard);
      if (result.winner) {
        handleGameEnd(result.winner, result.line);
      } else {
        setIsPlayerTurn(true);
        if (Math.random() < 0.3) toast.info(FRIENDLY_MESSAGES[Math.floor(Math.random() * FRIENDLY_MESSAGES.length)]);
      }
    }
  };

  useEffect(() => {
    if (gameMode === "ai") {
      const aiGoesFirst = Math.random() < 0.5;
      if (aiGoesFirst) {
        setPlayerSymbol("O");
        setAiSymbol("X");
        setIsPlayerTurn(false);
        setCurrentPlayer("X");
        setTimeout(() => makeComputerMove(Array(9).fill(null), "X"), 500);
      } else {
        setPlayerSymbol("X");
        setAiSymbol("O");
        setIsPlayerTurn(true);
        setCurrentPlayer("X");
      }
    } else {
      setCurrentPlayer("X");
      setIsPlayerTurn(true);
    }
  }, [gameMode]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver || winner) return;
    if (gameMode === "ai") {
      if (!isPlayerTurn) return;
      const newBoard = [...board];
      newBoard[index] = playerSymbol;
      setBoard(newBoard);
      playClickSound();
      const result = checkWinner(newBoard);
      if (result.winner) {
        handleGameEnd(result.winner, result.line);
      } else {
        setIsPlayerTurn(false);
        setTimeout(() => makeComputerMove(newBoard, aiSymbol), 500);
      }
    } else {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      playClickSound();
      const result = checkWinner(newBoard);
      if (result.winner) {
        handleGameEnd(result.winner, result.line);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        if (Math.random() < 0.3) toast.info(FRIENDLY_MESSAGES[Math.floor(Math.random() * FRIENDLY_MESSAGES.length)]);
      }
    }
  };

  const handleGameEnd = (gameWinner: GameResult, line: number[]) => {
    setWinner(gameWinner);
    setWinningLine(line);
    setGameOver(true);
    setShowDialog(true);
    let result: "win" | "loss" | "tie";
    
    if (gameMode === "ai") {
      if (gameWinner === playerSymbol) {
        setScore((prev: any) => ({ ...prev, player: prev.player + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${settings.player1Name} Won! You're a Legend 💫`);
        result = "win";
      } else if (gameWinner === aiSymbol) {
        setScore((prev: any) => ({ ...prev, computer: prev.computer + 1 }));
        playWinSound();
        toast.error("AI Wins!");
        result = "loss";
      } else {
        setScore((prev: any) => ({ ...prev, ties: prev.ties + 1 }));
        playDrawSound();
        toast.info("It's a tie!");
        result = "tie";
      }
    } else {
      if (gameWinner === "X") {
        setScore((prev: any) => ({ ...prev, player1: prev.player1 + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${settings.player1Name} Wins! 🎉 You're a Legend 💫`);
        result = "win";
      } else if (gameWinner === "O") {
        setScore((prev: any) => ({ ...prev, player2: prev.player2 + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${settings.player2Name} Wins! 💜 You're a Legend 💫`);
        result = "win";
      } else {
        setScore((prev: any) => ({ ...prev, ties: prev.ties + 1 }));
        playDrawSound();
        toast.info("It's a tie! 🤝");
        result = "tie";
      }
    }
    
    const { stats: newStats, achievements } = updateStats(gameMode, result);
    setStats(newStats);
    if (achievements.length > 0) {
      setTimeout(() => setCurrentAchievement(achievements[0]), 1000);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setGameOver(false);
    setShowDialog(false);
    setShowConfetti(false);
    
    if (gameMode === "ai") {
      const aiGoesFirst = Math.random() < 0.5;
      if (aiGoesFirst) {
        setPlayerSymbol("O");
        setAiSymbol("X");
        setIsPlayerTurn(false);
        setCurrentPlayer("X");
        setTimeout(() => makeComputerMove(Array(9).fill(null), "X"), 500);
      } else {
        setPlayerSymbol("X");
        setAiSymbol("O");
        setIsPlayerTurn(true);
        setCurrentPlayer("X");
      }
    } else {
      setCurrentPlayer("X");
      setIsPlayerTurn(true);
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-700 font-poppins animate-fade-in relative overflow-hidden" 
      style={{ background: theme.background }}
    >
      {/* Parallax neon grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(262 83% 58% / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(262 83% 58% / 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) translateZ(-100px)'
        }} />
      </div>
      
      {/* Floating anime particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 text-2xl opacity-30 petal-fall" style={{ animationDelay: '0s' }}>🌸</div>
        <div className="absolute top-1/3 right-1/4 text-xl opacity-40 star-twinkle" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-1/3 left-1/3 text-lg opacity-35 star-twinkle" style={{ animationDelay: '2s' }}>⭐</div>
        <div className="absolute top-2/3 right-1/5 text-sm opacity-25 star-twinkle" style={{ animationDelay: '3s' }}>💫</div>
      </div>
      
      {/* Volumetric light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-24 h-full bg-gradient-to-b from-primary/30 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute top-0 right-1/3 w-32 h-full bg-gradient-to-b from-accent/20 via-accent/5 to-transparent blur-3xl" />
      </div>
      
      <SoundToggle isMuted={isMuted} onToggle={() => { setIsMuted(!isMuted); saveMuteState(!isMuted); }} />
      <ConfettiEffect show={showConfetti} />
      <AchievementNotification achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2 animate-in slide-in-from-top duration-500 cinematic-zoom">
          <h1 className="text-4xl md:text-5xl font-bold font-quicksand hero-glow anime-sparkle relative" style={{ backgroundImage: theme.buttonGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            TicTacLegend {gameMode === "friend" && "💖"}
            <div className="absolute -top-2 -right-2 text-xl star-twinkle opacity-60">✨</div>
          </h1>
          {!gameOver && (
            <TurnIndicator 
              currentPlayer={gameMode === "ai" ? (isPlayerTurn ? settings.player1Name : settings.player2Name) : (currentPlayer === "X" ? settings.player1Name : settings.player2Name)} 
              playerEmoji={gameMode === "ai" ? (isPlayerTurn ? settings.player1Emoji : settings.player2Emoji) : (currentPlayer === "X" ? settings.player1Emoji : settings.player2Emoji)} 
              isAI={gameMode === "ai" && !isPlayerTurn} 
            />
          )}
        </div>

        <StatsPanel stats={stats} style={{ background: theme.cardBg }} />

        <Card className="p-6 hologram-glass cinematic-depth relative overflow-hidden" style={{ background: theme.cardBg, boxShadow: 'var(--shadow-hologram)' }}>
          {/* Anime glow line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shimmer-sweep" />
          
          <div className="grid grid-cols-3 gap-4 text-center relative z-10">
            {gameMode === "ai" ? (
              <>
                <div className="anime-sparkle">
                  <div className="text-3xl font-bold bloom-pulse" style={{ color: settings.player1Color, textShadow: `0 0 10px ${settings.player1Color}50` }}>{score.player}</div>
                  <div className="text-sm">{settings.player1Emoji} {settings.player1Name}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{ score.ties}</div>
                  <div className="text-sm">Ties</div>
                </div>
                <div className="anime-sparkle">
                  <div className="text-3xl font-bold bloom-pulse" style={{ color: settings.player2Color, textShadow: `0 0 10px ${settings.player2Color}50` }}>{score.computer}</div>
                  <div className="text-sm">{settings.player2Emoji} AI</div>
                </div>
              </>
            ) : (
              <>
                <div className="anime-sparkle">
                  <div className="text-3xl font-bold bloom-pulse" style={{ color: settings.player1Color, textShadow: `0 0 10px ${settings.player1Color}50` }}>{score.player1}</div>
                  <div className="text-sm">{settings.player1Emoji} {settings.player1Name}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{score.ties}</div>
                  <div className="text-sm">Ties</div>
                </div>
                <div className="anime-sparkle">
                  <div className="text-3xl font-bold bloom-pulse" style={{ color: settings.player2Color, textShadow: `0 0 10px ${settings.player2Color}50` }}>{score.player2}</div>
                  <div className="text-sm">{settings.player2Emoji} {settings.player2Name}</div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 3D Neon Game Board with cinematic + anime effects */}
        <Card className="p-6 hologram-glass cinematic-depth relative overflow-hidden" style={{ 
          background: theme.cardBg, 
          boxShadow: 'var(--shadow-cinematic)',
          transform: 'perspective(1000px)'
        }}>
          {/* Hologram grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{
            backgroundImage: 'linear-gradient(hsl(262 83% 58% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(262 83% 58% / 0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          
          {/* Neon beam for winning line */}
          {winningLine.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent neon-beam" 
                style={{ boxShadow: '0 0 20px hsl(262 83% 58%), 0 0 40px hsl(262 83% 58%)' }} 
              />
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {board.map((cell, i) => (
              <button 
                key={i} 
                onClick={() => handleCellClick(i)} 
                onMouseEnter={playHoverSound} 
                disabled={gameOver || cell !== null || (gameMode === "ai" && !isPlayerTurn)} 
                className="aspect-square rounded-lg text-5xl font-bold transition-all hover:scale-105 hover:anime-bounce animate-in scale-in duration-300 relative group cinematic-depth" 
                style={{ 
                  background: winningLine.includes(i) ? theme.winningCell : theme.cellBg, 
                  color: cell === "X" ? settings.player1Color : cell === "O" ? settings.player2Color : 'transparent', 
                  boxShadow: winningLine.includes(i) 
                    ? `0 0 30px ${theme.glowColor}, 0 0 60px ${theme.glowColor}40, inset 0 0 20px ${theme.glowColor}20` 
                    : '0 4px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.05)',
                  animationDelay: `${i * 50}ms`,
                  transform: winningLine.includes(i) ? 'translateZ(20px)' : 'translateZ(0)',
                  border: '1px solid hsl(0 0% 100% / 0.1)'
                }}
              >
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg pointer-events-none" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                
                {/* Cell content with energy burst animation */}
                {cell && (
                  <span className="animate-in zoom-in-50 duration-200 relative inline-block">
                    {cell}
                    {/* Energy burst effect on new placement */}
                    <span className="absolute inset-0 energy-burst pointer-events-none" 
                      style={{ 
                        background: `radial-gradient(circle, ${cell === "X" ? settings.player1Color : settings.player2Color}40, transparent)`,
                        borderRadius: '50%'
                      }} 
                    />
                  </span>
                )}
                
                {/* Anime sparkles on winning cells */}
                {winningLine.includes(i) && (
                  <>
                    <div className="absolute top-2 right-2 text-sm star-twinkle opacity-80">✨</div>
                    <div className="absolute bottom-2 left-2 text-xs star-twinkle opacity-60" style={{ animationDelay: '0.5s' }}>⭐</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={handleExit} 
            onMouseEnter={playHoverSound}
            variant="outline" 
            size="lg"
            className="flex-1 h-14 text-lg"
          >
            Exit 🚪
          </Button>
          <Button 
            onClick={resetGame} 
            onMouseEnter={playHoverSound} 
            size="lg"
            className="flex-1 h-14 text-lg font-semibold hover:scale-105" 
            style={{ background: theme.buttonGradient, boxShadow: `0 4px 14px ${theme.glowColor}` }}
          >
            Restart 🔁
          </Button>
        </div>
      </div>

      <GameEndDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onPlayAgain={resetGame}
        winner={winner}
        player1Name={settings.player1Name}
        player1Emoji={settings.player1Emoji}
        player2Name={settings.player2Name}
        player2Emoji={settings.player2Emoji}
        gameMode={gameMode}
        theme={theme}
      />
    </div>
  );
};

export default GamePage;
