import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useGameSounds } from '@/hooks/useGameSounds';

export interface SoundButtonProps extends ButtonProps {
  playSound?: boolean;
}

// Otimização: React.memo para evitar re-renders desnecessários
export const SoundButton = React.memo(React.forwardRef<HTMLButtonElement, SoundButtonProps>(
  ({ onClick, playSound = true, ...props }, ref) => {
    const { playButtonClick } = useGameSounds();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (playSound) {
        playButtonClick();
      }
      if (onClick) {
        onClick(event);
      }
    };

    return <Button ref={ref} onClick={handleClick} {...props} />;
  }
));

SoundButton.displayName = 'SoundButton';