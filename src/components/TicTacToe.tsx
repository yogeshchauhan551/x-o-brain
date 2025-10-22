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
type GameMode = "ai" | "friend";

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
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  
  const [scoreAI, setScoreAI] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-score-ai");
    return saved ? JSON.parse(saved) : { player: 0, computer: 0, ties: 0 };
  });
  
  const [scoreFriend, setScoreFriend] = useState(() => {
    const saved = localStorage.getItem("tic-tac-toe-score-friend");
    return saved ? JSON.parse(saved) : { player1: 0, player2: 0, ties: 0 };
  });
  
  const [gameOver, setGameOver] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O");

  useEffect(() => {
    localStorage.setItem("tic-tac-toe-score-ai", JSON.stringify(scoreAI));
  }, [scoreAI]);

  useEffect(() => {
    localStorage.setItem("tic-tac-toe-score-friend", JSON.stringify(scoreFriend));
  }, [scoreFriend]);

  useEffect(() => {
    if (gameMode === "ai") {
      // Random start: 50% chance AI goes first
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
      // Friend mode: always start with X (Player 1)
      setCurrentPlayer("X");
      setIsPlayerTurn(true);
    }
  }, [gameMode]);

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
    if (board[index] || gameOver || winner) return;

    if (gameMode === "ai") {
      // AI mode logic
      if (!isPlayerTurn) return;
      
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
    } else {
      // Friend mode logic
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      playMoveSound();
      
      const result = checkWinner(newBoard);
      if (result.winner) {
        handleGameEnd(result.winner, result.line);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  };

  const handleGameEnd = (gameWinner: GameResult, line: number[]) => {
    setWinner(gameWinner);
    setWinningLine(line);
    setGameOver(true);
    setShowDialog(true);
    
    if (gameMode === "ai") {
      if (gameWinner === playerSymbol) {
        setScoreAI(prev => ({ ...prev, player: prev.player + 1 }));
        playWinSound();
        toast.success("You won! 🎉");
      } else if (gameWinner === aiSymbol) {
        setScoreAI(prev => ({ ...prev, computer: prev.computer + 1 }));
        playWinSound();
        toast.error("Computer wins!");
      } else {
        setScoreAI(prev => ({ ...prev, ties: prev.ties + 1 }));
        playTieSound();
        toast.info("It's a tie!");
      }
    } else {
      // Friend mode
      if (gameWinner === "X") {
        setScoreFriend(prev => ({ ...prev, player1: prev.player1 + 1 }));
        playWinSound();
        toast.success("Player 1 Wins 🎉");
      } else if (gameWinner === "O") {
        setScoreFriend(prev => ({ ...prev, player2: prev.player2 + 1 }));
        playWinSound();
        toast.success("Player 2 Wins 💜");
      } else {
        setScoreFriend(prev => ({ ...prev, ties: prev.ties + 1 }));
        playTieSound();
        toast.info("It's a tie! 🤝");
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setGameOver(false);
    setShowDialog(false);

    if (gameMode === "ai") {
      // Random start again
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
      // Friend mode: always start with X (Player 1)
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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
      gameMode === "friend" 
        ? "bg-gradient-to-br from-[hsl(280,70%,92%)] via-[hsl(262,80%,90%)] to-[hsl(220,70%,92%)]"
        : "bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)]"
    }`}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            gameMode === "friend"
              ? "from-[hsl(320,80%,60%)] via-[hsl(280,90%,65%)] to-[hsl(220,80%,65%)]"
              : "from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)]"
          }`}>
            TicTacLegend {gameMode === "friend" && "💖"}
          </h1>
          <p className={`text-sm md:text-base ${gameMode === "friend" ? "text-[hsl(280,50%,40%)]" : "text-muted-foreground"}`}>
            {gameOver 
              ? winner === "tie" ? "Game Over - Tie! 🤝" : gameMode === "ai" 
                ? `${winner === playerSymbol ? "You" : "AI"} Won!`
                : `Player ${winner === "X" ? "1" : "2"} Won! ${winner === "X" ? "🎉" : "💜"}`
              : gameMode === "ai"
                ? isPlayerTurn ? `Your turn (${playerSymbol})` : "AI thinking..."
                : `Player ${currentPlayer === "X" ? "1" : "2"}'s turn (${currentPlayer})`}
          </p>
        </div>

        {/* Mode Selector */}
        <Card className={`p-4 border shadow-lg ${
          gameMode === "friend" 
            ? "bg-white/80 border-[hsl(280,60%,80%)]"
            : "bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]"
        }`}>
          <div className="flex items-center justify-between gap-4">
            <label className={`text-sm font-medium flex items-center gap-2 ${
              gameMode === "friend" ? "text-[hsl(280,60%,40%)]" : ""
            }`}>
              Game Mode:
            </label>
            <Select value={gameMode} onValueChange={(v) => {
              setGameMode(v as GameMode);
              setBoard(Array(9).fill(null));
              setWinner(null);
              setWinningLine([]);
              setGameOver(false);
              setShowDialog(false);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">🤖 Play vs AI</SelectItem>
                <SelectItem value="friend">💝 Play vs Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Difficulty Selector - Only for AI mode */}
        {gameMode === "ai" && (
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
        )}

        {/* Score Board */}
        <Card className={`p-6 border shadow-lg ${
          gameMode === "friend" 
            ? "bg-white/80 border-[hsl(280,60%,80%)]"
            : "bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]"
        }`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            {gameMode === "ai" ? (
              <>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[hsl(14,100%,65%)]">{scoreAI.player}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    You ({playerSymbol})
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-muted-foreground">
                    {scoreAI.ties}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Ties
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[hsl(189,95%,55%)]">{scoreAI.computer}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    AI ({aiSymbol})
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[hsl(320,80%,60%)]">{scoreFriend.player1}</div>
                  <div className="text-xs md:text-sm text-[hsl(280,50%,40%)]">Player 1 (X)</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[hsl(280,60%,50%)]">{scoreFriend.ties}</div>
                  <div className="text-xs md:text-sm text-[hsl(280,50%,40%)]">Ties 🤝</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[hsl(220,80%,65%)]">{scoreFriend.player2}</div>
                  <div className="text-xs md:text-sm text-[hsl(280,50%,40%)]">Player 2 (O)</div>
                </div>
              </>
            )}
          </div>
          <Button
            onClick={resetScore}
            variant="outline"
            className={`w-full mt-4 text-xs md:text-sm ${
              gameMode === "friend" 
                ? "border-[hsl(280,60%,70%)] text-[hsl(280,60%,40%)] hover:bg-[hsl(280,60%,95%)]"
                : ""
            }`}
          >
            Reset Score
          </Button>
        </Card>

        {/* Game Board */}
        <Card className={`p-4 md:p-6 border shadow-lg ${
          gameMode === "friend" 
            ? "bg-white/80 border-[hsl(280,60%,80%)]"
            : "bg-card border-border shadow-[0_10px_40px_hsl(240,30%,3%/0.5)]"
        }`}>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameOver || cell !== null || (gameMode === "ai" && !isPlayerTurn)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-4xl md:text-5xl font-bold
                  transition-all duration-300 ease-out
                  ${gameMode === "friend" 
                    ? cell === null 
                      ? 'bg-gradient-to-br from-[hsl(280,70%,95%)] to-[hsl(260,70%,92%)] hover:from-[hsl(280,70%,90%)] hover:to-[hsl(260,70%,87%)] shadow-inner'
                      : 'bg-gradient-to-br from-[hsl(280,70%,95%)] to-[hsl(260,70%,92%)]'
                    : cell === null 
                      ? 'bg-[hsl(240,20%,15%)] hover:bg-[hsl(240,20%,18%)]'
                      : 'bg-[hsl(240,20%,15%)]'
                  }
                  ${cell === null && !gameOver ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  ${winningLine.includes(index) 
                    ? gameMode === "friend"
                      ? 'winning-cell bg-gradient-to-r from-[hsl(320,80%,70%)] to-[hsl(280,80%,70%)]'
                      : 'winning-cell bg-[hsl(262,83%,58%)]'
                    : ''
                  }
                  ${gameMode === "friend"
                    ? cell === "X" 
                      ? 'text-[hsl(320,80%,55%)]'
                      : cell === "O"
                        ? 'text-[hsl(220,80%,60%)]'
                        : ''
                    : cell === playerSymbol 
                      ? 'text-[hsl(14,100%,65%)]'
                      : cell === aiSymbol 
                        ? 'text-[hsl(189,95%,55%)]'
                        : ''
                  }
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
          className={`w-full h-12 text-base md:text-lg font-semibold transition-all ${
            gameMode === "friend"
              ? "bg-gradient-to-r from-[hsl(320,80%,60%)] via-[hsl(280,90%,65%)] to-[hsl(220,80%,65%)] hover:opacity-90 shadow-[0_4px_14px_hsl(280,80%,60%/0.4)]"
              : "bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:opacity-90 shadow-[0_4px_14px_hsl(262,83%,58%/0.4)]"
          }`}
        >
          New Game {gameMode === "friend" && "🎮"}
        </Button>
      </div>

      <GameEndDialog
        open={showDialog}
        winner={winner}
        gameMode={gameMode}
        onPlayAgain={resetGame}
      />
    </div>
  );
};

export default TicTacToe;
