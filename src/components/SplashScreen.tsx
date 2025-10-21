import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center space-y-8 animate-in zoom-in-50 duration-700">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent glow-animation">
          TicTacLegend
        </h1>
        <div className="text-xl md:text-2xl text-muted-foreground animate-in fade-in-50 delay-300 duration-700">
          Challenge the AI 🎮
        </div>
        <div className="text-lg text-muted-foreground/60 animate-in fade-in-50 delay-500 duration-700 pt-8">
          Made by Yogesh Chauhan 🔥
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
