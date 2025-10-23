import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { playHoverSound } from "@/utils/soundUtils";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-fade-in bg-gradient-to-b from-[hsl(240,30%,8%)] to-[hsl(240,30%,6%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[hsl(262,83%,58%)] rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[hsl(280,90%,50%)] rounded-full blur-[140px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg animate-in zoom-in-50 duration-700">
        {/* Animated logo */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] bg-clip-text text-transparent animate-in slide-in-from-top duration-1000 font-quicksand drop-shadow-[0_0_40px_rgba(167,139,250,0.5)]">
            TicTacLegend
          </h1>
          
          <div className="flex justify-center items-center gap-6 text-6xl animate-in slide-in-from-left duration-1000 delay-200">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>✨</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🎮</span>
            <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🏆</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-muted-foreground animate-in fade-in-50 delay-500 duration-700 font-poppins">
          Challenge yourself.<br />Become a legend.
        </p>

        {/* Play button */}
        <Button
          onClick={() => navigate("/setup")}
          onMouseEnter={playHoverSound}
          size="lg"
          className="mt-12 h-16 px-12 text-2xl font-bold animate-in scale-in delay-700 duration-500 bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(280,90%,50%)] hover:scale-110 transition-transform shadow-[0_0_40px_rgba(167,139,250,0.6)] hover:shadow-[0_0_60px_rgba(167,139,250,0.8)]"
        >
          Play Now 🎮
        </Button>

        {/* Credit */}
        <p className="text-sm text-muted-foreground/60 animate-in fade-in-50 delay-1000 duration-700 pt-8">
          Made with 🔥 by Yogesh Chauhan
        </p>
      </div>
    </div>
  );
};

export default StartPage;
