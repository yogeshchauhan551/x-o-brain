import { useEffect, useState } from "react";

interface ConfettiEffectProps {
  show: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  duration: number;
}

const emojis = ["🎉", "💜", "✨", "🎊", "⭐", "💫", "🌟"];

const ConfettiEffect = ({ show }: ConfettiEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-3xl animate-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `fall ${particle.duration}s linear`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;
