import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAdvancedGameSounds, SoundType } from '@/hooks/useAdvancedGameSounds';

export interface GameSoundButtonProps extends ButtonProps {
  playSound?: boolean;
  soundType?: SoundType;
  soundIntensity?: number;
  spatialPosition?: { x: number; y: number; z: number };
  onSoundComplete?: () => void;
}

export const GameSoundButton = React.memo(React.forwardRef<HTMLButtonElement, GameSoundButtonProps>(
  ({ 
    onClick, 
    playSound = true, 
    soundType = 'button-click',
    soundIntensity = 1.0,
    spatialPosition,
    onSoundComplete,
    className = '',
    children,
    ...props 
  }, ref) => {
    const { playGameSound, soundEnabled } = useAdvancedGameSounds();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Executar som primeiro para feedback imediato
      if (playSound && soundEnabled) {
        try {
          await playGameSound(soundType, soundIntensity, spatialPosition);
          onSoundComplete?.();
        } catch (error) {
          console.warn('Erro ao reproduzir som do botão:', error);
        }
      }
      
      // Executar click handler original
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <Button 
        ref={ref} 
        onClick={handleClick} 
        className={`transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        {...props}
      >
        {children}
      </Button>
    );
  }
));

GameSoundButton.displayName = 'GameSoundButton';