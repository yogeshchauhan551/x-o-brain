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
      {/* Animated gradient background with hologram effect */}
      <div className="absolute inset-0 gradient-shift hologram-flicker" style={{
        background: 'var(--gradient-moving)'
      }} />
      
      {/* Cinematic volumetric light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-primary/40 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-0 right-1/3 w-40 h-full bg-gradient-to-b from-accent/30 via-accent/10 to-transparent blur-3xl" />
        <div className="absolute top-0 left-1/2 w-24 h-full bg-gradient-to-b from-pink-500/20 via-pink-500/5 to-transparent blur-2xl" />
      </div>
      
      {/* Floating particles - mix of orbs, petals, and stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neon orbs */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full blur-sm float-particle bloom-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-3 h-3 bg-accent rounded-full blur-sm float-particle bloom-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-primary rounded-full blur-sm float-particle" style={{ animationDelay: '6s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-accent rounded-full blur-md float-particle bloom-pulse" style={{ animationDelay: '9s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary rounded-full blur-sm float-particle" style={{ animationDelay: '12s' }} />
        
        {/* Anime petals */}
        <div className="absolute top-0 left-1/5 text-2xl opacity-60 petal-fall" style={{ animationDelay: '0s' }}>🌸</div>
        <div className="absolute top-0 right-1/4 text-xl opacity-50 petal-fall" style={{ animationDelay: '2s' }}>🌸</div>
        <div className="absolute top-0 left-2/3 text-lg opacity-40 petal-fall" style={{ animationDelay: '4s' }}>🌸</div>
        
        {/* Sparkle stars */}
        <div className="absolute top-1/4 left-1/3 text-xl star-twinkle" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-2/3 right-1/5 text-lg star-twinkle" style={{ animationDelay: '3s' }}>⭐</div>
        <div className="absolute bottom-1/3 left-1/4 text-sm star-twinkle" style={{ animationDelay: '5s' }}>💫</div>
      </div>

      {/* Atmospheric light streaks - thinner, more elegant */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-50" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent opacity-50" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent opacity-40" />
      </div>

      {/* Animated TicTacToe board background with hologram effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none board-pulse">
        <div className="grid grid-cols-3 gap-4 opacity-5 scale-[2.5] rotate-12 cinematic-depth">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-20 h-20 border-2 rounded-lg flex items-center justify-center text-4xl font-bold hologram-glass"
              style={{ 
                animationDelay: `${i * 0.5}s`,
                borderColor: i % 2 === 0 ? 'hsl(262 83% 58% / 0.4)' : 'hsl(280 90% 50% / 0.4)',
                boxShadow: i % 2 === 0 ? '0 0 30px hsl(262 83% 58% / 0.3)' : '0 0 30px hsl(280 90% 50% / 0.3)',
                transform: `translateZ(${i * 10}px)`
              }}
            >
              {i % 3 === 0 ? 'X' : i % 3 === 1 ? 'O' : ''}
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtle hologram mascot shadow (low opacity) */}
      <div className="absolute bottom-10 right-10 pointer-events-none opacity-10 hologram-flicker">
        <div className="text-9xl">👾</div>
        <div className="absolute inset-0 text-9xl blur-xl opacity-50">👾</div>
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
          {/* Main Title with cinematic neon + anime sparkle edges */}
          <div className="relative cinematic-depth">
            {/* Anime sparkle effects */}
            <div className="absolute -top-4 -right-4 text-3xl star-twinkle opacity-80">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl star-twinkle opacity-60" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute top-1/2 -right-8 text-xl star-twinkle opacity-70" style={{ animationDelay: '1s' }}>💫</div>
            
            {/* Cinematic bloom layer */}
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-quicksand hero-glow drop-shadow-2xl bloom-pulse relative z-10">
              TicTacLegend
            </h1>
            
            {/* Holographic depth layers */}
            <h1 className="absolute inset-0 text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 bg-clip-text text-transparent font-quicksand blur-sm translate-x-1 translate-y-1">
              TicTacLegend
            </h1>
            <h1 className="absolute inset-0 text-7xl md:text-9xl font-bold bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 bg-clip-text text-transparent font-quicksand blur-md translate-x-2 translate-y-2">
              TicTacLegend
            </h1>
            
            {/* Anime outline glow */}
            <div className="absolute inset-0 text-7xl md:text-9xl font-bold font-quicksand opacity-30 blur-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              TicTacLegend
            </div>
          </div>
          
          {/* Tagline with neon glow */}
          <p className="text-2xl md:text-4xl text-foreground/90 animate-in fade-in delay-300 duration-700 font-bold tracking-wide relative">
            <span className="relative z-10">Outsmart the AI. Claim your legend.</span>
            <span className="absolute inset-0 blur-lg opacity-50 text-primary">Outsmart the AI. Claim your legend.</span>
          </p>

          {/* Subtitle with soft pastel glow */}
          <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in delay-500 duration-700 max-w-2xl mx-auto relative">
            <span className="relative z-10">Enter a world where strategy meets style. Every move counts.</span>
            <span className="absolute inset-0 blur-md opacity-30 text-pink-300">Enter a world where strategy meets style. Every move counts.</span>
          </p>
        </div>

        {/* Premium Play Button - Glossy neon glass with cinematic + anime effects */}
        <div className="animate-in scale-in delay-700 duration-500">
          <Button
            onClick={() => {
              playHoverSound();
              navigate("/setup");
            }}
            onMouseEnter={playHoverSound}
            size="lg"
            className="group relative h-20 px-16 text-3xl font-bold bg-gradient-to-r from-primary to-accent hover:scale-110 transition-all duration-300 button-glow-pulse overflow-hidden hologram-glass cinematic-depth"
          >
            {/* Cinematic reflection sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shimmer-sweep" />
            
            {/* Anime sparkle burst on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-1/4 left-1/4 text-xl star-twinkle">✨</div>
              <div className="absolute bottom-1/4 right-1/4 text-lg star-twinkle" style={{ animationDelay: '0.2s' }}>⭐</div>
              <div className="absolute top-1/2 right-1/3 text-sm star-twinkle" style={{ animationDelay: '0.4s' }}>💫</div>
            </div>
            
            {/* Glass depth layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-md" />
            
            <Gamepad2 className="w-8 h-8 mr-4 relative z-10 group-hover:anime-bounce" />
            <span className="relative z-10 group-hover:anime-bounce">Play Now</span>
            <Zap className="w-6 h-6 ml-3 relative z-10 animate-pulse group-hover:star-twinkle" />
            
            {/* Bloom glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl bg-gradient-to-r from-primary to-accent transition-opacity duration-500" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-in fade-in delay-1000 duration-700">
          {/* AI Mode Card - Enhanced with hologram + cinematic depth */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-primary/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden hologram-glass cinematic-depth"
            style={{ boxShadow: 'var(--shadow-cinematic)' }}
          >
            {/* Cinematic glow sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bloom-pulse" />
            
            {/* Anime sparkle line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 shimmer-sweep" />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:bloom-pulse hologram-glass">
                <Brain className="w-8 h-8 text-primary-foreground group-hover:anime-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-foreground anime-sparkle">AI Mode</h3>
              <p className="text-muted-foreground">
                Challenge the algorithm
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/50 hologram-glass">
                  Easy
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/50 hologram-glass">
                  Hard
                </span>
              </div>
            </div>
          </Card>

          {/* Multiplayer Card - Enhanced with hologram + cinematic depth */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-accent/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden hologram-glass cinematic-depth"
            style={{ boxShadow: 'var(--shadow-anime-soft)', animationDelay: '0.3s' }}
          >
            {/* Cinematic glow sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bloom-pulse" />
            
            {/* Anime sparkle line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 shimmer-sweep" style={{ animationDelay: '0.3s' }} />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:bloom-pulse hologram-glass">
                <Users className="w-8 h-8 text-primary-foreground group-hover:anime-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-foreground anime-sparkle">Multiplayer</h3>
              <p className="text-muted-foreground">
                Play with a friend
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold border border-accent/50 hologram-glass">
                  Local PvP
                </span>
              </div>
            </div>
          </Card>

          {/* Impossible Mode Card - Enhanced with hologram + cinematic depth */}
          <Card className="group relative backdrop-blur-xl bg-card/30 border-2 border-destructive/30 pulse-border-anim p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden hologram-glass cinematic-depth"
            style={{ boxShadow: 'var(--shadow-cinematic)', animationDelay: '0.6s' }}
          >
            {/* Cinematic glow sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bloom-pulse" />
            
            {/* Anime sparkle line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-0 group-hover:opacity-100 shimmer-sweep" style={{ animationDelay: '0.6s' }} />
            
            <div className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-destructive to-primary flex items-center justify-center group-hover:bloom-pulse hologram-glass">
                <Zap className="w-8 h-8 text-primary-foreground group-hover:anime-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-foreground anime-sparkle">Impossible</h3>
              <p className="text-muted-foreground">
                AI never loses
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-semibold border border-destructive/50 animate-pulse bloom-pulse hologram-glass">
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
