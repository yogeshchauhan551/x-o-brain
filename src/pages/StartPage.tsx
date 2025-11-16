import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { playHoverSound } from "@/utils/soundUtils";
import { Volume2, VolumeX, Smartphone, Gamepad2, Brain, Users, Zap } from "lucide-react";
import { useState } from "react";

const StartPage = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[hsl(240,30%,4%)]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-shift" style={{
        background: 'var(--gradient-moving)'
      }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full blur-sm float-particle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-3 h-3 bg-accent rounded-full blur-sm float-particle" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-primary rounded-full blur-sm float-particle" style={{ animationDelay: '6s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-accent rounded-full blur-md float-particle" style={{ animationDelay: '9s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary rounded-full blur-sm float-particle" style={{ animationDelay: '12s' }} />
      </div>

      {/* Atmospheric light streaks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      </div>

      {/* Animated TicTacToe board background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none board-pulse">
        <div className="grid grid-cols-3 gap-4 opacity-5 scale-[2.5] rotate-12">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-20 h-20 border-2 border-primary rounded-lg flex items-center justify-center text-4xl font-bold"
              style={{ 
                animationDelay: `${i * 0.5}s`,
                borderColor: i % 2 === 0 ? 'hsl(262 83% 58% / 0.3)' : 'hsl(280 90% 50% / 0.3)'
              }}
            >
              {i % 3 === 0 ? 'X' : i % 3 === 1 ? 'O' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Settings toggles */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="hover:scale-110 transition-transform backdrop-blur-sm bg-card/50 border border-primary/30"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5 text-primary" /> : <Volume2 className="h-5 w-5 text-primary" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVibrationEnabled(!vibrationEnabled)}
          className="hover:scale-110 transition-transform backdrop-blur-sm bg-card/50 border border-primary/30"
          aria-label={vibrationEnabled ? "Disable vibration" : "Enable vibration"}
        >
          <Smartphone className={`h-5 w-5 ${vibrationEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>
      </div>

      <div className="relative z-10 text-center space-y-12 max-w-6xl w-full animate-in fade-in duration-1000">
        {/* Hero Section */}
        <div className="space-y-6">
          {/* Main Title with holographic effect */}
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-quicksand hero-glow drop-shadow-2xl">
              TicTacLegend
            </h1>
            {/* Holographic depth layer */}
            <h1 className="absolute inset-0 text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 bg-clip-text text-transparent font-quicksand blur-sm -z-10 translate-x-1 translate-y-1">
              TicTacLegend
            </h1>
          </div>
          
          {/* Tagline */}
          <p className="text-2xl md:text-4xl text-foreground/90 animate-in fade-in delay-300 duration-700 font-bold tracking-wide">
            Outsmart the AI. Claim your legend.
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in delay-500 duration-700 max-w-2xl mx-auto">
            Enter a world where strategy meets style. Every move counts.
          </p>
        </div>

        {/* Premium Play Button */}
        <div className="animate-in scale-in delay-700 duration-500">
          <Button
            onClick={() => {
              playHoverSound();
              navigate("/setup");
            }}
            onMouseEnter={playHoverSound}
            size="lg"
            className="group relative h-20 px-16 text-3xl font-bold bg-gradient-to-r from-primary to-accent hover:scale-110 transition-all duration-300 button-glow-pulse overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <Gamepad2 className="w-8 h-8 mr-4" />
            <span className="relative z-10">Play Now</span>
            <Zap className="w-6 h-6 ml-3 animate-pulse" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-in fade-in delay-1000 duration-700">
          {/* AI Mode Card */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-primary/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            style={{ boxShadow: 'var(--shadow-glass)' }}
          >
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">AI Mode</h3>
              <p className="text-muted-foreground">
                Challenge the algorithm
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/50">
                  Easy
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/50">
                  Hard
                </span>
              </div>
            </div>
          </Card>

          {/* Multiplayer Card */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-accent/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            style={{ boxShadow: 'var(--shadow-glass)', animationDelay: '0.3s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Multiplayer</h3>
              <p className="text-muted-foreground">
                Play with a friend
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/50">
                  Local PvP
                </span>
              </div>
            </div>
          </Card>

          {/* Impossible Mode Card */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-destructive/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
            style={{ boxShadow: 'var(--shadow-glass)', animationDelay: '0.6s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-destructive to-primary flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Impossible</h3>
              <p className="text-muted-foreground">
                AI never loses
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-semibold border border-destructive/50 animate-pulse">
                  Unbeatable
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Credit */}
        <p className="text-sm text-muted-foreground/60 animate-in fade-in delay-1000 duration-700 pt-8">
          Crafted by Yogesh Chauhan
        </p>
      </div>
    </div>
  );
};

export default StartPage;
