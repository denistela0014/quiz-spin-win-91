import React, { useState, useEffect } from 'react';
import { SoundButton } from '@/components/ui/SoundButton';
import { cn } from '@/lib/utils';

export interface EnhancedCTAProps {
  onClick: () => void;
  text: string;
  variant?: 'default' | 'sticky' | 'floating' | 'pulse' | 'gradient';
  size?: 'sm' | 'lg'; // Alinhado com ButtonProps do ShadCN
  position?: 'relative' | 'fixed-bottom' | 'fixed-top' | 'sticky-bottom';
  showAfterSeconds?: number;
  icon?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export const EnhancedCTA: React.FC<EnhancedCTAProps> = ({
  onClick,
  text,
  variant = 'default',
  size = 'lg',
  position = 'relative',
  showAfterSeconds = 0,
  icon = '▶️',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [isVisible, setIsVisible] = useState(showAfterSeconds === 0);

  useEffect(() => {
    if (showAfterSeconds > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showAfterSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [showAfterSeconds]);

  if (!isVisible || disabled) return null;

  const baseClasses = 'font-bold transition-smooth transform hover:scale-105 active:scale-95 shadow-glow';
  
  const variantClasses = {
    default: 'bg-gradient-primary hover:bg-primary/90 text-primary-foreground',
    sticky: 'bg-gradient-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow',
    floating: 'bg-gradient-primary hover:bg-primary/90 text-primary-foreground shadow-elegant hover:shadow-glow',
    pulse: 'bg-gradient-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow',
    gradient: 'bg-gradient-accent hover:opacity-90 text-accent-foreground'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    lg: 'px-6 py-3 text-lg'
  };

  const positionClasses = {
    relative: 'relative',
    'fixed-bottom': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
    'fixed-top': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    'sticky-bottom': 'sticky bottom-4 z-40'
  };

  return (
    <div 
      className={cn(
        positionClasses[position],
        position === 'fixed-bottom' || position === 'fixed-top' ? 'animate-fade-in' : ''
      )}
    >
      <SoundButton
        onClick={onClick}
        size={size}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'rounded-full',
          className
        )}
        aria-label={ariaLabel || `${text}: Clique para continuar`}
      >
        <span className="flex items-center gap-2">
          {text}
          <span className="animate-bounce">{icon}</span>
        </span>
      </SoundButton>
    </div>
  );
};

// Hook personalizado para gerenciar CTAs múltiplos
export const useCTAManager = (totalCTAs: number = 1) => {
  const [activeCTA, setActiveCTA] = useState<number | null>(null);
  const [ctaHistory, setCTAHistory] = useState<number[]>([]);

  const showCTA = (ctaIndex: number) => {
    setActiveCTA(ctaIndex);
    setCTAHistory(prev => [...prev, ctaIndex]);
  };

  const hideCTA = () => {
    setActiveCTA(null);
  };

  const nextCTA = () => {
    if (activeCTA !== null && activeCTA < totalCTAs - 1) {
      showCTA(activeCTA + 1);
    }
  };

  const previousCTA = () => {
    if (activeCTA !== null && activeCTA > 0) {
      showCTA(activeCTA - 1);
    }
  };

  return {
    activeCTA,
    showCTA,
    hideCTA,
    nextCTA,
    previousCTA,
    ctaHistory,
    isFirstCTA: activeCTA === 0,
    isLastCTA: activeCTA === totalCTAs - 1
  };
};