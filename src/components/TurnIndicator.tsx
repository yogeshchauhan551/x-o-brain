interface TurnIndicatorProps {
  currentPlayer: string;
  playerEmoji: string;
  isAI?: boolean;
  className?: string;
}

const TurnIndicator = ({ currentPlayer, playerEmoji, isAI, className }: TurnIndicatorProps) => {
  return (
    <div className={`text-center transition-all duration-300 ${className}`}>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full animate-pulse">
        <span className="text-2xl">{playerEmoji}</span>
        <span className="font-semibold">
          {currentPlayer}'s Turn {isAI && "🤖"}
        </span>
      </div>
    </div>
  );
};

export default TurnIndicator;
