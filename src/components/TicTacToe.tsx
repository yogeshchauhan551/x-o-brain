import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Player = "X" | "O" | null;
type GameResult = "X" | "O" | "tie" | null;
type Board = Player[];

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
  const [score, setScore] = useState({ player: 0, computer: 0, ties: 0 });
  const [gameOver, setGameOver] = useState(false);


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

  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(currentBoard);
    
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
    if (result.winner === "tie") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = "O";
          const score = minimax(currentBoard, depth + 1, false);
          currentBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = "X";
          const score = minimax(currentBoard, depth + 1, true);
          currentBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const makeComputerMove = (currentBoard: Board) => {
    if (checkWinner(currentBoard).winner || !currentBoard.some(cell => cell === null)) {
      return;
    }

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = "O";
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== -1) {
      const newBoard = [...currentBoard];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      
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
    newBoard[index] = "X";
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeComputerMove(newBoard), 500);
    }
  };

  const handleGameEnd = (gameWinner: GameResult, line: number[]) => {
    setWinner(gameWinner);
    setWinningLine(line);
    setGameOver(true);
    
    if (gameWinner === "X") {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      toast.success("You won! 🎉");
    } else if (gameWinner === "O") {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      toast.error("Computer wins!");
    } else {
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
      toast.info("It's a tie!");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent">
            Tic-Tac-Toe
          </h1>
          <p className="text-muted-foreground">
            {gameOver 
              ? winner === "tie" ? "Game Over - Tie!" : `${winner === "X" ? "You" : "Computer"} Won!`
              : isPlayerTurn ? "Your turn (X)" : "Computer thinking..."}
          </p>
        </div>

        {/* Score Board */}
        <Card className="p-6 bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-[hsl(14,100%,65%)]">{score.player}</div>
              <div className="text-sm text-muted-foreground">You (X)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-muted-foreground">{score.ties}</div>
              <div className="text-sm text-muted-foreground">Ties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[hsl(189,95%,55%)]">{score.computer}</div>
              <div className="text-sm text-muted-foreground">AI (O)</div>
            </div>
          </div>
        </Card>

        {/* Game Board */}
        <Card className="p-6 bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isPlayerTurn || gameOver || cell !== null}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-5xl font-bold
                  transition-all duration-300 ease-out
                  ${cell === null ? 'bg-[hsl(240,20%,15%)] hover:bg-[hsl(240,20%,18%)]' : 'bg-[hsl(240,20%,15%)]'}
                  ${cell === null && isPlayerTurn && !gameOver ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  ${winningLine.includes(index) ? 'bg-[hsl(262,83%,58%)] shadow-[0_0_30px_hsl(262,83%,58%/0.3)] scale-105' : ''}
                  ${cell === "X" ? 'text-[hsl(14,100%,65%)]' : cell === "O" ? 'text-[hsl(189,95%,55%)]' : ''}
                  disabled:opacity-50
                `}
              >
                {cell && (
                  <span className="animate-in zoom-in-50 duration-200">
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Reset Button */}
        <Button
          onClick={resetGame}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:opacity-90 transition-opacity"
        >
          New Game
        </Button>
      </div>
    </div>
  );
};

export default TicTacToe;
