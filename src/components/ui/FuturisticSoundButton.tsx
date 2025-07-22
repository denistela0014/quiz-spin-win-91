import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAdvancedSpatialSounds, SpatialSoundType } from '@/hooks/useAdvancedSpatialSounds';

export interface FuturisticSoundButtonProps extends ButtonProps {
  playSound?: boolean;
  soundType?: SpatialSoundType;
  soundIntensity?: number;
  spatialPosition?: { x: number; y: number; z: number };
  onSoundComplete?: () => void;
  enableHapticFeedback?: boolean;
}

export const FuturisticSoundButton = React.memo(React.forwardRef<HTMLButtonElement, FuturisticSoundButtonProps>(
  ({ 
    onClick, 
    playSound = true, 
    soundType = 'button-futuristic',
    soundIntensity = 1.0,
    spatialPosition,
    onSoundComplete,
    enableHapticFeedback = true,
    className = '',
    children,
    ...props 
  }, ref) => {
    const { playSpatialSound, soundEnabled } = useAdvancedSpatialSounds();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Feedback háptico (vibração) para dispositivos móveis
      if (enableHapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Som espacial futurista
      if (playSound && soundEnabled) {
        try {
          await playSpatialSound(soundType, soundIntensity, spatialPosition);
          onSoundComplete?.();
        } catch (error) {
          console.warn('Erro ao reproduzir som futurista:', error);
        }
      }
      
      // Executar handler original
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Button 
        ref={ref} 
        onClick={handleClick} 
        className={`
          relative overflow-hidden
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-lg hover:shadow-primary/25
          active:scale-95 active:shadow-inner
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-transparent before:via-white/10 before:to-transparent
          before:translate-x-[-100%] before:transition-transform before:duration-600
          hover:before:translate-x-[100%]
          ${className}
        `}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Efeito de brilho futurista */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Partículas de energia (apenas em hover) */}
        <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/60 rounded-full animate-ping"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </Button>
    );
  }
));

FuturisticSoundButton.displayName = 'FuturisticSoundButton';