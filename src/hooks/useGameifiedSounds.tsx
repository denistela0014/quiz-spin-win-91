import { useState, useCallback, useRef, useEffect } from 'react';

export type SoundType = 'correct' | 'incorrect' | 'level-up' | 'countdown' | 'time-alert' | 'button-click' | 'transition';

interface GameSoundState {
  soundEnabled: boolean;
  volumeLevel: number;
  sounds: Record<SoundType, HTMLAudioElement | null>;
}

interface SoundFeedback {
  type: 'correct' | 'incorrect';
  showConfetti?: boolean;
  showShake?: boolean;
}

export const useGameifiedSounds = () => {
  const [state, setState] = useState<GameSoundState>({
    soundEnabled: true,
    volumeLevel: 0.5,
    sounds: {
      'correct': null,
      'incorrect': null,
      'level-up': null,
      'countdown': null,
      'time-alert': null,
      'button-click': null,
      'transition': null
    }
  });

  const [feedbackAnimation, setFeedbackAnimation] = useState<string>('');
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar sons usando Web Audio API para melhor compatibilidade
  useEffect(() => {
    const initializeSounds = async () => {
      try {
        // Sons sintéticos usando AudioContext para garantir compatibilidade
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const createSyntheticSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3 * state.volumeLevel, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          return { oscillator, gainNode, duration };
        };

        const playSyntheticSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
          if (!state.soundEnabled) return;
          const { oscillator } = createSyntheticSound(frequency, duration, type);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        };

        // Criar sons sintéticos
        const sounds: Record<SoundType, () => void> = {
          'correct': () => {
            // Som de sucesso - sequência de notas ascendentes
            playSyntheticSound(523.25, 0.1); // C5
            setTimeout(() => playSyntheticSound(659.25, 0.1), 100); // E5
            setTimeout(() => playSyntheticSound(783.99, 0.2), 200); // G5
          },
          'incorrect': () => {
            // Som de erro - frequência descendente
            playSyntheticSound(300, 0.3, 'square');
            setTimeout(() => playSyntheticSound(200, 0.2, 'square'), 100);
          },
          'level-up': () => {
            // Som de nível up - arpejo ascendente
            const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            notes.forEach((note, index) => {
              setTimeout(() => playSyntheticSound(note, 0.15), index * 80);
            });
          },
          'countdown': () => {
            // Som de tick do countdown
            playSyntheticSound(800, 0.1, 'square');
          },
          'time-alert': () => {
            // Som de alerta - beep rápido e alto
            for (let i = 0; i < 3; i++) {
              setTimeout(() => playSyntheticSound(1000, 0.1, 'sine'), i * 200);
            }
          },
          'button-click': () => {
            // Som de clique suave
            playSyntheticSound(600, 0.05, 'sine');
          },
          'transition': () => {
            // Som de transição suave
            playSyntheticSound(440, 0.2);
            setTimeout(() => playSyntheticSound(550, 0.2), 100);
          }
        };

        // Converter funções em "objetos Audio simulados"
        const audioObjects = {} as Record<SoundType, any>;
        Object.keys(sounds).forEach(key => {
          audioObjects[key as SoundType] = {
            play: sounds[key as SoundType],
            volume: state.volumeLevel
          };
        });

        setState(prev => ({ ...prev, sounds: audioObjects }));
      } catch (error) {
        console.warn('Web Audio API não disponível, sons desabilitados:', error);
      }
    };

    initializeSounds();
  }, []);

  // Atualizar volume de todos os sons
  const setVolume = useCallback((level: number) => {
    setState(prev => ({ ...prev, volumeLevel: level }));
  }, []);

  // Toggle de som
  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Tocar som específico
  const playSound = useCallback((type: SoundType) => {
    if (!state.soundEnabled || !state.sounds[type]) return;
    
    try {
      state.sounds[type]?.play();
    } catch (error) {
      console.warn(`Erro ao reproduzir som ${type}:`, error);
    }
  }, [state.soundEnabled, state.sounds]);

  // Feedback de resposta com som e animação
  const playAnswerFeedback = useCallback((isCorrect: boolean) => {
    // Limpar animação anterior
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    if (isCorrect) {
      playSound('correct');
      setFeedbackAnimation('confetti animate-bounce-in');
    } else {
      playSound('incorrect');
      setFeedbackAnimation('shake animate-cta-shake');
    }

    // Limpar animação após duração
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackAnimation('');
    }, 1000);
  }, [playSound]);

  // Som de progresso/transição
  const playProgressSound = useCallback(() => {
    playSound('level-up');
  }, [playSound]);

  // Som de transição entre páginas
  const playTransitionSound = useCallback(() => {
    playSound('transition');
  }, [playSound]);

  // Sistema de countdown com alerta
  const startCountdown = useCallback((totalSeconds: number, onTimeAlert?: () => void, onTimeUp?: () => void) => {
    let timeLeft = totalSeconds;
    
    const countdownInterval = setInterval(() => {
      timeLeft--;
      
      // Som de tick a cada segundo nos últimos 10 segundos
      if (timeLeft <= 10 && timeLeft > 0) {
        playSound('countdown');
      }
      
      // Alerta quando faltam 10 segundos
      if (timeLeft === 10) {
        playSound('time-alert');
        onTimeAlert?.();
      }
      
      // Quando o tempo acabar
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        playSound('time-alert');
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [playSound]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Estados
    soundEnabled: state.soundEnabled,
    volumeLevel: state.volumeLevel,
    feedbackAnimation,
    
    // Controles
    setVolume,
    toggleSound,
    
    // Sons específicos
    playSound,
    playAnswerFeedback,
    playProgressSound,
    playTransitionSound,
    startCountdown,
    
    // Utilitários
    clearFeedbackAnimation: () => setFeedbackAnimation('')
  };
};

// Hook adicional para componentes que precisam apenas do feedback visual
export const useFeedbackAnimations = () => {
  const [animationClass, setAnimationClass] = useState('');

  const triggerAnimation = useCallback((type: 'confetti' | 'shake' | 'glow' | 'bounce') => {
    const animations = {
      confetti: 'animate-bounce-in',
      shake: 'animate-cta-shake',
      glow: 'animate-cta-glow',
      bounce: 'animate-pulse-glow'
    };

    setAnimationClass(animations[type]);
    setTimeout(() => setAnimationClass(''), 1000);
  }, []);

  return {
    animationClass,
    triggerAnimation,
    clearAnimation: () => setAnimationClass('')
  };
};