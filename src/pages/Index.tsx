import { useState } from "react";
import TicTacToe from "@/components/TicTacToe";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <TicTacToe />;
};

export default Index;
