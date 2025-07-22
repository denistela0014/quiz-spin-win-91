import React, { useEffect, useState } from 'react';
import { useAdvancedGameSounds } from '@/hooks/useAdvancedGameSounds';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';
import { useQuiz } from '@/contexts/QuizContext';
import confetti from 'canvas-confetti';

interface GameFeedbackSystemProps {
  children: React.ReactNode;
  enableConfetti?: boolean;
  enableScreenEffects?: boolean;
}

export const GameFeedbackSystem: React.FC<GameFeedbackSystemProps> = ({
  children,
  enableConfetti = true,
  enableScreenEffects = true
}) => {
  const { feedbackAnimation, streakCount, clearFeedbackAnimation } = useAdvancedGameSounds();
  const { playMilestone, playSpatialSound } = useAdvancedSpatialSounds();
  const { progress } = useQuiz();
  const [screenEffect, setScreenEffect] = useState<string>('');

  // Efeitos visuais baseados na animação sonora
  useEffect(() => {
    if (feedbackAnimation) {
      if (feedbackAnimation.includes('confetti') && enableConfetti) {
        // Efeito confetti para acertos
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399']
        });

        // Confetti extra para sequências com som espacial
        if (streakCount >= 3) {
          playSpatialSound('perfect-streak-epic', 1.5); // Som épico espacial
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.4 },
              colors: ['#fbbf24', '#f59e0b', '#d97706']
            });
          }, 300);
        }
      }

      if (enableScreenEffects) {
        if (feedbackAnimation.includes('confetti')) {
          setScreenEffect('success-glow');
        } else if (feedbackAnimation.includes('shake')) {
          setScreenEffect('error-shake');
        }

        // Limpar efeito de tela após animação
        const timeout = setTimeout(() => {
          setScreenEffect('');
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }
  }, [feedbackAnimation, streakCount, enableConfetti, enableScreenEffects]);

  // Efeitos de progresso com som espacial
  useEffect(() => {
    if (progress > 0 && progress % 25 === 0 && enableConfetti) {
      // Celebração a cada 25% de progresso com som espacial
      playMilestone('achievement'); // Som de conquista espacial
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#8b5cf6', '#a855f7', '#c084fc']
      });
    }
  }, [progress, enableConfetti, playMilestone]);

  const getContainerClasses = () => {
    let classes = 'relative transition-all duration-300';
    
    if (screenEffect === 'success-glow') {
      classes += ' animate-pulse-glow';
    } else if (screenEffect === 'error-shake') {
      classes += ' animate-cta-shake';
    }

    return classes;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Overlay de efeitos visuais */}
      {screenEffect && (
        <div 
          className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
            screenEffect === 'success-glow' 
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5' 
              : 'bg-gradient-to-br from-red-500/10 to-rose-500/5'
          }`}
        />
      )}

      {/* Indicador de sequência */}
      {streakCount >= 2 && (
        <div className="absolute top-4 right-4 z-20 animate-bounce-in">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            🔥 Sequência {streakCount}x
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className={feedbackAnimation}>
        {children}
      </div>

      {/* Efeitos de partículas customizados */}
      {feedbackAnimation.includes('confetti') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-in"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: `${12 + Math.random() * 8}px`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}
    </div>
  );
};