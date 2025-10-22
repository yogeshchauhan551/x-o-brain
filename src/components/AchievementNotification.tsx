import { useEffect, useState } from "react";
import { Achievement } from "@/utils/statsUtils";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
        <div className="text-3xl text-center mb-1">{achievement.emoji}</div>
        <div className="text-lg font-bold text-center">{achievement.title}</div>
        <div className="text-sm text-center opacity-90">{achievement.description}</div>
      </div>
    </div>
  );
};

export default AchievementNotification;
