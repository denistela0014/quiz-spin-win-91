import React, { useState, useEffect } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { GameSoundButton } from './GameSoundButton';
import { Clock, Gift, Star, Zap } from 'lucide-react';

interface ProgressiveDiscountBannerProps {
  progressPercentage: number;
  className?: string;
}

export const ProgressiveDiscountBanner: React.FC<ProgressiveDiscountBannerProps> = ({
  progressPercentage,
  className = ''
}) => {
  const [currentDiscount, setCurrentDiscount] = useState(10);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [isUrgent, setIsUrgent] = useState(false);

  // Lógica de desconto progressivo baseado no progresso
  useEffect(() => {
    if (progressPercentage >= 75) {
      setCurrentDiscount(25);
    } else if (progressPercentage >= 50) {
      setCurrentDiscount(20);
    } else if (progressPercentage >= 25) {
      setCurrentDiscount(15);
    } else {
      setCurrentDiscount(10);
    }
  }, [progressPercentage]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 60) setIsUrgent(true);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Gift className="h-6 w-6 text-primary" />
            {isUrgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-ping" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-primary/20 text-primary font-bold">
                {currentDiscount}% OFF
              </Badge>
              <Badge variant="outline" className={isUrgent ? 'animate-pulse text-destructive' : ''}>
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {progressPercentage < 25 ? (
                "Continue para desbloquear descontos maiores!"
              ) : progressPercentage < 50 ? (
                "🎉 Desbloqueou 15% de desconto! Continue para mais!"
              ) : progressPercentage < 75 ? (
                "🚀 Incrível! 20% de desconto ativo!"
              ) : (
                "⭐ MÁXIMO! 25% de desconto especial desbloqueado!"
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Pessoas completaram hoje:</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary" />
            <span className="text-sm font-bold text-primary">2,847</span>
          </div>
        </div>
      </div>

      {isUrgent && (
        <div className="mt-3 pt-3 border-t border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-destructive animate-pulse">
              ⚠️ Última chance! Oferta expira em breve!
            </p>
            <GameSoundButton
              variant="destructive"
              size="sm"
              soundType="time-alert"
              soundIntensity={1.2}
              className="animate-cta-glow"
            >
              <Zap className="h-3 w-3 mr-1" />
              Garantir Desconto
            </GameSoundButton>
          </div>
        </div>
      )}
    </Card>
  );
};