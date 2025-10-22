import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ isMuted, onToggle }: SoundToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 hover:scale-110 transition-transform"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  );
};

export default SoundToggle;
