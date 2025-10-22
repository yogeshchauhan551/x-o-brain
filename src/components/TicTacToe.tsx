import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import GameEndDialog from "./GameEndDialog";
import ThemeSelector from "./ThemeSelector";
import PlayerNameInput from "./PlayerNameInput";
import AchievementNotification from "./AchievementNotification";
import ConfettiEffect from "./ConfettiEffect";
import StatsPanel from "./StatsPanel";
import TurnIndicator from "./TurnIndicator";
import SoundToggle from "./SoundToggle";
import { getTheme, saveTheme, loadTheme, ThemeName } from "@/utils/themeUtils";
import { playClickSound, playHoverSound, playWinSound, playDrawSound, saveMuteState, loadMuteState } from "@/utils/soundUtils";
import { updateStats, loadStats, GameStats, Achievement } from "@/utils/statsUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Player = "X" | "O" | null;
type GameResult = "X" | "O" | "tie" | null;
type Board = Player[];
type Difficulty = "easy" | "medium" | "hard";
type GameMode = "ai" | "friend";

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const DIFFICULTY_HINTS = {
  easy: "Easy – plays simple 😊",
  medium: "Medium – blocks & attacks 🎯",
  hard: "Hard – predicts 2 steps ahead 🤖"
};

const FRIENDLY_MESSAGES = ["Nice Move! 🎯", "Good thinking! 💭", "Smart play! 🧠", "So Close! 😊", "Keep going! 💪", "You got this! 🌟"];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<GameResult>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O");
  const [gameOver, setGameOver] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(loadTheme());
  const [isMuted, setIsMuted] = useState(loadMuteState());
  const [stats, setStats] = useState<GameStats>(loadStats(gameMode));
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player1Emoji, setPlayer1Emoji] = useState("😊");
  const [player2Name, setPlayer2Name] = useState("AI");
  const [player2Emoji, setPlayer2Emoji] = useState("🤖");

  const [scoreAI, setScoreAI] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-score-ai");
    return saved ? JSON.parse(saved) : { player: 0, computer: 0, ties: 0 };
  });
  
  const [scoreFriend, setScoreFriend] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-score-friend");
    return saved ? JSON.parse(saved) : { player1: 0, player2: 0, ties: 0 };
  });

  const theme = getTheme(currentTheme);

  useEffect(() => localStorage.setItem("tic-tac-toe-score-ai", JSON.stringify(scoreAI)), [scoreAI]);
  useEffect(() => localStorage.setItem("tic-tac-toe-score-friend", JSON.stringify(scoreFriend)), [scoreFriend]);
  useEffect(() => setStats(loadStats(gameMode)), [gameMode]);

  useEffect(() => {
    const saved1Name = localStorage.getItem("player1-name");
    const saved1Emoji = localStorage.getItem("player1-emoji");
    if (saved1Name) setPlayer1Name(saved1Name);
    if (saved1Emoji) setPlayer1Emoji(saved1Emoji);
    if (!saved1Name) setShowNameInput(true);
    
    if (gameMode === "friend") {
      const saved2Name = localStorage.getItem("player2-name");
      const saved2Emoji = localStorage.getItem("player2-emoji");
      if (saved2Name) setPlayer2Name(saved2Name);
      if (saved2Emoji) setPlayer2Emoji(saved2Emoji);
    } else {
      setPlayer2Name("AI");
      setPlayer2Emoji("🤖");
    }
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
        setScoreAI(prev => ({ ...prev, player: prev.player + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${player1Name} Won! 🎉`);
        result = "win";
      } else if (gameWinner === aiSymbol) {
        setScoreAI(prev => ({ ...prev, computer: prev.computer + 1 }));
        playWinSound();
        toast.error("AI Wins!");
        result = "loss";
      } else {
        setScoreAI(prev => ({ ...prev, ties: prev.ties + 1 }));
        playDrawSound();
        toast.info("It's a tie!");
        result = "tie";
      }
    } else {
      if (gameWinner === "X") {
        setScoreFriend(prev => ({ ...prev, player1: prev.player1 + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${player1Name} Wins 🎉`);
        result = "win";
      } else if (gameWinner === "O") {
        setScoreFriend(prev => ({ ...prev, player2: prev.player2 + 1 }));
        playWinSound();
        setShowConfetti(true);
        toast.success(`${player2Name} Wins 💜`);
        result = "win";
      } else {
        setScoreFriend(prev => ({ ...prev, ties: prev.ties + 1 }));
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

  const resetScore = () => {
    if (gameMode === "ai") {
      setScoreAI({ player: 0, computer: 0, ties: 0 });
      localStorage.setItem("tic-tac-toe-score-ai", JSON.stringify({ player: 0, computer: 0, ties: 0 }));
    } else {
      setScoreFriend({ player1: 0, player2: 0, ties: 0 });
      localStorage.setItem("tic-tac-toe-score-friend", JSON.stringify({ player1: 0, player2: 0, ties: 0 }));
    }
    toast.success("Score reset!");
  };

  const score = gameMode === "ai" ? scoreAI : scoreFriend;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-all duration-700 font-poppins" style={{ background: theme.background }}>
      <SoundToggle isMuted={isMuted} onToggle={() => { setIsMuted(!isMuted); saveMuteState(!isMuted); }} />
      <ConfettiEffect show={showConfetti} />
      <AchievementNotification achievement={currentAchievement} onClose={() => setCurrentAchievement(null)} />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold font-quicksand" style={{ backgroundImage: theme.buttonGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            TicTacLegend {gameMode === "friend" && "💖"}
          </h1>
          {!gameOver && <TurnIndicator currentPlayer={gameMode === "ai" ? (isPlayerTurn ? player1Name : player2Name) : (currentPlayer === "X" ? player1Name : player2Name)} playerEmoji={gameMode === "ai" ? (isPlayerTurn ? player1Emoji : player2Emoji) : (currentPlayer === "X" ? player1Emoji : player2Emoji)} isAI={gameMode === "ai" && !isPlayerTurn} />}
        </div>

        <Card className="p-4" style={{ background: theme.cardBg }}><ThemeSelector currentTheme={currentTheme} onThemeChange={(t) => { setCurrentTheme(t); saveTheme(t); }} /></Card>
        
        <Card className="p-4" style={{ background: theme.cardBg }}>
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium" style={{ color: theme.textPrimary }}>Mode:</label>
            <Select value={gameMode} onValueChange={(v) => { setGameMode(v as GameMode); resetGame(); setShowNameInput(true); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">🤖 AI</SelectItem>
                <SelectItem value="friend">💝 Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {gameMode === "ai" && (
          <Card className="p-4" style={{ background: theme.cardBg }}>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs mt-2 text-center" style={{ color: theme.textSecondary }}>{DIFFICULTY_HINTS[difficulty]}</p>
          </Card>
        )}

        <StatsPanel stats={stats} style={{ background: theme.cardBg }} />

        <Card className="p-6" style={{ background: theme.cardBg }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            {gameMode === "ai" ? (
              <>
                <div><div className="text-3xl font-bold" style={{ color: theme.playerX }}>{scoreAI.player}</div><div className="text-sm">{player1Emoji} {player1Name}</div></div>
                <div><div className="text-3xl font-bold">{scoreAI.ties}</div><div className="text-sm">Ties</div></div>
                <div><div className="text-3xl font-bold" style={{ color: theme.playerO }}>{scoreAI.computer}</div><div className="text-sm">{player2Emoji} {player2Name}</div></div>
              </>
            ) : (
              <>
                <div><div className="text-3xl font-bold" style={{ color: theme.playerX }}>{scoreFriend.player1}</div><div className="text-sm">{player1Emoji} {player1Name}</div></div>
                <div><div className="text-3xl font-bold">{scoreFriend.ties}</div><div className="text-sm">Ties</div></div>
                <div><div className="text-3xl font-bold" style={{ color: theme.playerO }}>{scoreFriend.player2}</div><div className="text-sm">{player2Emoji} {player2Name}</div></div>
              </>
            )}
          </div>
          <Button onClick={resetScore} variant="outline" className="w-full mt-4" onMouseEnter={playHoverSound}>Reset Score</Button>
        </Card>

        <Card className="p-6" style={{ background: theme.cardBg }}>
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, i) => (
              <button key={i} onClick={() => handleCellClick(i)} onMouseEnter={playHoverSound} disabled={gameOver || cell !== null || (gameMode === "ai" && !isPlayerTurn)} className="aspect-square rounded-lg text-5xl font-bold transition-all hover:scale-105" style={{ background: winningLine.includes(i) ? theme.winningCell : theme.cellBg, color: cell === "X" ? theme.playerX : cell === "O" ? theme.playerO : 'transparent', boxShadow: winningLine.includes(i) ? `0 0 20px ${theme.glowColor}` : 'none' }}>
                {cell && <span className="cell-pop">{cell}</span>}
              </button>
            ))}
          </div>
        </Card>

        <Button onClick={resetGame} onMouseEnter={playHoverSound} className="w-full h-12 text-lg font-semibold hover:scale-105" style={{ background: theme.buttonGradient, boxShadow: `0 4px 14px ${theme.glowColor}` }}>Play Again 🔁</Button>
        <Button onClick={() => setShowNameInput(true)} variant="outline" className="w-full">Change Names ✏️</Button>
      </div>

      <GameEndDialog open={showDialog} winner={winner} gameMode={gameMode} player1Name={player1Name} player2Name={player2Name} player1Emoji={player1Emoji} player2Emoji={player2Emoji} playerSymbol={playerSymbol} onPlayAgain={resetGame} theme={theme} />
      <PlayerNameInput open={showNameInput} gameMode={gameMode} onSubmit={(p1, e1, p2, e2) => { setPlayer1Name(p1); setPlayer1Emoji(e1); localStorage.setItem("player1-name", p1); localStorage.setItem("player1-emoji", e1); if (gameMode === "friend" && p2 && e2) { setPlayer2Name(p2); setPlayer2Emoji(e2); localStorage.setItem("player2-name", p2); localStorage.setItem("player2-emoji", e2); } setShowNameInput(false); }} />
    </div>
  );
};

export default TicTacToe;

