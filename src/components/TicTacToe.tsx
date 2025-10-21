import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import GameEndDialog from "./GameEndDialog";
import { playMoveSound, playWinSound, playTieSound } from "@/utils/audioUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Player = "X" | "O" | null;
type GameResult = "X" | "O" | "tie" | null;
type Board = Player[];
type Difficulty = "easy" | "medium" | "hard";

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<GameResult>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-score");
    return saved ? JSON.parse(saved) : { player: 0, computer: 0, ties: 0 };
  });
  const [gameOver, setGameOver] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O");

  useEffect(() => {
    localStorage.setItem("tic-tac-toe-score", JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    // Random start: 50% chance AI goes first
    const aiGoesFirst = Math.random() < 0.5;
    if (aiGoesFirst) {
      setPlayerSymbol("O");
      setAiSymbol("X");
      setIsPlayerTurn(false);
      setTimeout(() => makeComputerMove(Array(9).fill(null), "X"), 500);
    } else {
      setPlayerSymbol("X");
      setAiSymbol("O");
      setIsPlayerTurn(true);
    }
  }, []);

  const checkWinner = (currentBoard: Board): { winner: GameResult; line: number[] } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line: combination };
      }
    }
    
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: "tie", line: [] };
    }
    
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
          const score = minimax(currentBoard, depth + 1, false, aiSym, playerSym);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = playerSym;
          const score = minimax(currentBoard, depth + 1, true, aiSym, playerSym);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getRandomMove = (currentBoard: Board): number => {
    const available = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null) as number[];
    return available[Math.floor(Math.random() * available.length)];
  };

  const getMediumMove = (currentBoard: Board, aiSym: Player, playerSym: Player): number => {
    // Check if AI can win
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

    // Check if need to block player
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

    // Otherwise random
    return getRandomMove(currentBoard);
  };

  const makeComputerMove = (currentBoard: Board, aiSym: Player) => {
    if (checkWinner(currentBoard).winner || !currentBoard.some(cell => cell === null)) {
      return;
    }

    let bestMove = -1;

    if (difficulty === "easy") {
      bestMove = getRandomMove(currentBoard);
    } else if (difficulty === "medium") {
      bestMove = getMediumMove(currentBoard, aiSym, playerSymbol);
    } else {
      // Hard mode: minimax
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
      playMoveSound();
      
      const result = checkWinner(newBoard);
      if (result.winner) {
        handleGameEnd(result.winner, result.line);
      } else {
        setIsPlayerTurn(true);
      }
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameOver || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    playMoveSound();
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeComputerMove(newBoard, aiSymbol), 500);
    }
  };

  const handleGameEnd = (gameWinner: GameResult, line: number[]) => {
    setWinner(gameWinner);
    setWinningLine(line);
    setGameOver(true);
    setShowDialog(true);
    
    if (gameWinner === playerSymbol) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      playWinSound();
      toast.success("You won! 🎉");
    } else if (gameWinner === aiSymbol) {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      playWinSound();
      toast.error("Computer wins!");
    } else {
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
      playTieSound();
      toast.info("It's a tie!");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setGameOver(false);
    setShowDialog(false);

    // Random start again
    const aiGoesFirst = Math.random() < 0.5;
    if (aiGoesFirst) {
      setPlayerSymbol("O");
      setAiSymbol("X");
      setIsPlayerTurn(false);
      setTimeout(() => makeComputerMove(Array(9).fill(null), "X"), 500);
    } else {
      setPlayerSymbol("X");
      setAiSymbol("O");
      setIsPlayerTurn(true);
    }
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0, ties: 0 });
    localStorage.setItem("tic-tac-toe-score", JSON.stringify({ player: 0, computer: 0, ties: 0 }));
    toast.success("Score reset!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)]">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent">
            TicTacLegend
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {gameOver 
              ? winner === "tie" ? "Game Over - Tie!" : `${winner === playerSymbol ? "You" : "AI"} Won!`
              : isPlayerTurn ? `Your turn (${playerSymbol})` : "AI thinking..."}
          </p>
        </div>

        {/* Difficulty Selector */}
        <Card className="p-4 bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium">Difficulty:</label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Score Board */}
        <Card className="p-6 bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[hsl(14,100%,65%)]">{score.player}</div>
              <div className="text-xs md:text-sm text-muted-foreground">You ({playerSymbol})</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-muted-foreground">{score.ties}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Ties</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[hsl(189,95%,55%)]">{score.computer}</div>
              <div className="text-xs md:text-sm text-muted-foreground">AI ({aiSymbol})</div>
            </div>
          </div>
          <Button
            onClick={resetScore}
            variant="outline"
            className="w-full mt-4 text-xs md:text-sm"
          >
            Reset Score
          </Button>
        </Card>

        {/* Game Board */}
        <Card className="p-4 md:p-6 bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isPlayerTurn || gameOver || cell !== null}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold
                  transition-all duration-300 ease-out
                  ${cell === null ? 'bg-[hsl(240,20%,15%)] hover:bg-[hsl(240,20%,18%)]' : 'bg-[hsl(240,20%,15%)]'}
                  ${cell === null && isPlayerTurn && !gameOver ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  ${winningLine.includes(index) ? 'winning-cell bg-[hsl(262,83%,58%)]' : ''}
                  ${cell === playerSymbol ? 'text-[hsl(14,100%,65%)]' : cell === aiSymbol ? 'text-[hsl(189,95%,55%)]' : ''}
                  disabled:opacity-50
                `}
              >
                {cell && (
                  <span className="cell-pop">
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* New Game Button */}
        <Button
          onClick={resetGame}
          className="w-full h-12 text-base md:text-lg font-semibold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:opacity-90 transition-opacity shadow-[0_4px_14px_hsl(262,83%,58%/0.4)]"
        >
          New Game
        </Button>
      </div>

      <GameEndDialog
        open={showDialog}
        winner={winner}
        onPlayAgain={resetGame}
      />
    </div>
  );
};

export default TicTacToe;
