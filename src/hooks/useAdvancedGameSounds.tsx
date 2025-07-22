import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { useAdvancedSpatialSounds } from './useAdvancedSpatialSounds';

export type SoundType = 
  | 'correct' 
  | 'incorrect' 
  | 'level-up' 
  | 'countdown' 
  | 'time-alert' 
  | 'button-click' 
  | 'transition'
  | 'achievement'
  | 'perfect-streak'
  | 'game-start'
  | 'page-transition';

interface GameSoundState {
  soundEnabled: boolean;
  volumeLevel: number;
  audioContext: AudioContext | null;
  isInitialized: boolean;
}

interface SoundFeedback {
  type: 'correct' | 'incorrect' | 'achievement';
  showConfetti?: boolean;
  showShake?: boolean;
  streakCount?: number;
}

interface SpatialPosition {
  x: number;
  y: number;
  z: number;
}

export const useAdvancedGameSounds = () => {
  const { currentPage, progress } = useQuiz();
  const [state, setState] = useState<GameSoundState>({
    soundEnabled: true,
    volumeLevel: 0.6,
    audioContext: null,
    isInitialized: false
  });

  const [feedbackAnimation, setFeedbackAnimation] = useState<string>('');
  const [streakCount, setStreakCount] = useState<number>(0);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayTime = useRef<{ [key: string]: number }>({});

  // Inicializar Web Audio API
  useEffect(() => {
    const initializeAudioContext = async () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Configurar listener 3D para áudio espacial
        if (audioContext.listener) {
          audioContext.listener.positionX?.setValueAtTime(0, audioContext.currentTime);
          audioContext.listener.positionY?.setValueAtTime(0, audioContext.currentTime);
          audioContext.listener.positionZ?.setValueAtTime(1, audioContext.currentTime);
          audioContext.listener.forwardX?.setValueAtTime(0, audioContext.currentTime);
          audioContext.listener.forwardY?.setValueAtTime(0, audioContext.currentTime);
          audioContext.listener.forwardZ?.setValueAtTime(-1, audioContext.currentTime);
          audioContext.listener.upX?.setValueAtTime(0, audioContext.currentTime);
          audioContext.listener.upY?.setValueAtTime(1, audioContext.currentTime);
          audioContext.listener.upZ?.setValueAtTime(0, audioContext.currentTime);
        }

        setState(prev => ({ 
          ...prev, 
          audioContext, 
          isInitialized: true 
        }));
      } catch (error) {
        console.warn('Web Audio API não disponível:', error);
      }
    };

    initializeAudioContext();

    return () => {
      if (state.audioContext && state.audioContext.state !== 'closed') {
        state.audioContext.close();
      }
    };
  }, []);

  // Criar som sintético com áudio espacial 3D
  const createSpatialSound = useCallback((
    frequency: number, 
    duration: number, 
    type: OscillatorType = 'sine',
    position: SpatialPosition = { x: 0, y: 0, z: 0 },
    volume: number = 0.3
  ) => {
    if (!state.audioContext || !state.soundEnabled) return null;

    try {
      const oscillator = state.audioContext.createOscillator();
      const gainNode = state.audioContext.createGain();
      const panner = state.audioContext.createPanner();

      // Configurar panner para áudio 3D
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 10000;
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 0;
      panner.coneOuterGain = 0;

      // Definir posição espacial
      panner.positionX?.setValueAtTime(position.x, state.audioContext.currentTime);
      panner.positionY?.setValueAtTime(position.y, state.audioContext.currentTime);
      panner.positionZ?.setValueAtTime(position.z, state.audioContext.currentTime);

      // Conectar nós
      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(state.audioContext.destination);

      // Configurar oscilador
      oscillator.frequency.setValueAtTime(frequency, state.audioContext.currentTime);
      oscillator.type = type;

      // Configurar envelope de volume
      const adjustedVolume = volume * state.volumeLevel;
      gainNode.gain.setValueAtTime(0, state.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(adjustedVolume, state.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + duration);

      return { oscillator, gainNode, duration };
    } catch (error) {
      console.warn('Erro ao criar som espacial:', error);
      return null;
    }
  }, [state.audioContext, state.soundEnabled, state.volumeLevel]);

  // Sistema inteligente de throttling e controle de sons simultâneos
  const currentPlayingSounds = useRef<Set<string>>(new Set());
  const soundQueue = useRef<{ soundKey: string; callback: () => void }[]>([]);
  
  const shouldPlaySound = useCallback((soundKey: string): boolean => {
    const now = Date.now();
    const lastPlay = lastPlayTime.current[soundKey];
    const throttleTime = 100; // Reduzido para 100ms para feedback mais responsivo

    // Verificar se o mesmo som já está tocando
    if (currentPlayingSounds.current.has(soundKey)) {
      return false;
    }

    // Verificar throttle de tempo
    if (lastPlay && (now - lastPlay) < throttleTime) {
      return false;
    }

    // Limitar número de sons simultâneos (máximo 3)
    if (currentPlayingSounds.current.size >= 3) {
      return false;
    }

    lastPlayTime.current[soundKey] = now;
    return true;
  }, []);

  // Controle de sons em execução
  const markSoundAsPlaying = useCallback((soundKey: string, duration: number) => {
    currentPlayingSounds.current.add(soundKey);
    setTimeout(() => {
      currentPlayingSounds.current.delete(soundKey);
      // Processar próximo som na fila se houver
      if (soundQueue.current.length > 0) {
        const nextSound = soundQueue.current.shift();
        if (nextSound && shouldPlaySound(nextSound.soundKey)) {
          nextSound.callback();
        }
      }
    }, duration);
  }, [shouldPlaySound]);

  // Sons gamificados com feedback adaptativo e controle inteligente
  const playGameSound = useCallback(async (
    soundType: SoundType, 
    intensity: number = 1,
    spatialPosition?: SpatialPosition
  ) => {
    // Verificar se pode tocar o som
    if (!shouldPlaySound(soundType)) {
      // Se não pode tocar agora, adicionar à fila para sons importantes
      if (['correct', 'incorrect', 'achievement'].includes(soundType)) {
        soundQueue.current.push({
          soundKey: soundType,
          callback: () => playGameSound(soundType, intensity, spatialPosition)
        });
      }
      return;
    }

    const position = spatialPosition || { x: 0, y: 0, z: 0 };
    const baseVolume = 0.3 * intensity;

    try {
      switch (soundType) {
        case 'correct':
          // Som de sucesso otimizado - mais claro e impactante
          markSoundAsPlaying(soundType, 300);
          const correctPos = { x: 1, y: 0, z: 0 };
          const correctNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          correctNotes.forEach((note, index) => {
            setTimeout(() => {
              const sound = createSpatialSound(note, 0.12, 'sine', correctPos, baseVolume * 1.2);
              if (sound) {
                sound.oscillator.start(state.audioContext!.currentTime);
                sound.oscillator.stop(state.audioContext!.currentTime + 0.12);
              }
            }, index * 60);
          });
          break;

        case 'incorrect':
          // Som de erro sutil e encorajador - não frustrante
          markSoundAsPlaying(soundType, 250);
          const incorrectPos = { x: -0.5, y: 0, z: 0 };
          const errorSound = createSpatialSound(280, 0.15, 'triangle', incorrectPos, baseVolume * 0.6);
          if (errorSound) {
            // Som único mais suave para não desanimar
            errorSound.oscillator.start(state.audioContext!.currentTime);
            errorSound.oscillator.stop(state.audioContext!.currentTime + 0.15);
          }
          // Adicionar um tom encorajador após o erro
          setTimeout(() => {
            const encourageSound = createSpatialSound(350, 0.1, 'sine', incorrectPos, baseVolume * 0.4);
            if (encourageSound) {
              encourageSound.oscillator.start(state.audioContext!.currentTime);
              encourageSound.oscillator.stop(state.audioContext!.currentTime + 0.1);
            }
          }, 200);
          break;

        case 'level-up':
          // Som de progresso - mais impactante e motivacional
          markSoundAsPlaying(soundType, 700);
          const levelNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 a G5
          levelNotes.forEach((note, index) => {
            setTimeout(() => {
              const dynamicPos = { 
                x: Math.sin(index * 0.8), 
                y: index * 0.1, 
                z: Math.cos(index * 0.8) 
              };
              const sound = createSpatialSound(note, 0.18, 'sine', dynamicPos, baseVolume * 1.4);
              if (sound) {
                sound.oscillator.start(state.audioContext!.currentTime);
                sound.oscillator.stop(state.audioContext!.currentTime + 0.18);
              }
            }, index * 100);
          });
          break;

        case 'perfect-streak':
          // Som épico para sequência perfeita - extremamente recompensador
          markSoundAsPlaying(soundType, 800);
          const streakNotes = [440, 554.37, 659.25, 783.99, 880, 1046.50]; // A4 a C6
          streakNotes.forEach((note, index) => {
            setTimeout(() => {
              const glitterPos = { 
                x: Math.sin(index * 1.5) * 1.5, 
                y: Math.cos(index * 1.2) * 0.8, 
                z: Math.sin(index * 0.9) 
              };
              const sound = createSpatialSound(note, 0.25, 'sine', glitterPos, baseVolume * 1.8);
              if (sound) {
                sound.oscillator.start(state.audioContext!.currentTime);
                sound.oscillator.stop(state.audioContext!.currentTime + 0.25);
              }
            }, index * 80);
          });
          // Efeito extra de brilho no final
          setTimeout(() => {
            const finalGlow = createSpatialSound(1318.51, 0.4, 'sine', { x: 0, y: 1, z: 0 }, baseVolume * 1.5);
            if (finalGlow) {
              finalGlow.oscillator.start(state.audioContext!.currentTime);
              finalGlow.oscillator.stop(state.audioContext!.currentTime + 0.4);
            }
          }, 600);
          break;

        case 'achievement':
          // Som de conquista - fanfarra
          const fanfareNotes = [523.25, 659.25, 783.99, 1046.50]; // C5 a C6
          fanfareNotes.forEach((note, index) => {
            setTimeout(() => {
              const achievementPos = { x: 0, y: 1, z: -0.5 };
              const sound = createSpatialSound(note, 0.4, 'triangle', achievementPos, baseVolume * 1.3);
              if (sound) {
                sound.oscillator.start(state.audioContext!.currentTime);
                sound.oscillator.stop(state.audioContext!.currentTime + 0.4);
              }
            }, index * 100);
          });
          break;

        case 'countdown':
          const tickPos = { x: 0, y: -0.5, z: 0 };
          const sound = createSpatialSound(800, 0.1, 'square', tickPos, baseVolume * 0.8);
          if (sound) {
            sound.oscillator.start(state.audioContext!.currentTime);
            sound.oscillator.stop(state.audioContext!.currentTime + 0.1);
          }
          break;

        case 'time-alert':
          // Alerta de urgência - mais intenso e motivacional
          markSoundAsPlaying(soundType, 500);
          const urgencyBeeps = [1200, 1400, 1600];
          urgencyBeeps.forEach((freq, i) => {
            setTimeout(() => {
              const alertPos = { x: Math.sin(i * 2.5), y: 0.3, z: 0 };
              const alertSound = createSpatialSound(freq, 0.08, 'square', alertPos, baseVolume * 1.5);
              if (alertSound) {
                alertSound.oscillator.start(state.audioContext!.currentTime);
                alertSound.oscillator.stop(state.audioContext!.currentTime + 0.08);
              }
            }, i * 120);
          });
          break;

        case 'button-click':
          const clickPos = position;
          const clickSound = createSpatialSound(600, 0.05, 'sine', clickPos, baseVolume * 0.7);
          if (clickSound) {
            clickSound.oscillator.start(state.audioContext!.currentTime);
            clickSound.oscillator.stop(state.audioContext!.currentTime + 0.05);
          }
          break;

        case 'page-transition':
          // Som de transição suave com movimento espacial
          const transitionNotes = [440, 554.37];
          transitionNotes.forEach((note, index) => {
            setTimeout(() => {
              const transPos = { x: index === 0 ? -1 : 1, y: 0, z: 0 };
              const transSound = createSpatialSound(note, 0.3, 'sine', transPos, baseVolume);
              if (transSound) {
                transSound.oscillator.start(state.audioContext!.currentTime);
                transSound.oscillator.stop(state.audioContext!.currentTime + 0.3);
              }
            }, index * 150);
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.warn(`Erro ao reproduzir som ${soundType}:`, error);
    }
  }, [createSpatialSound, shouldPlaySound, markSoundAsPlaying, state.audioContext]);

  // Sistema inteligente de feedback com otimização de conversão
  const playAnswerFeedback = useCallback((isCorrect: boolean, streakBonus: boolean = false) => {
    // Limpar animação anterior
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    if (isCorrect) {
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      if (newStreak >= 3) {
        // Som épico para streak - recompensa máxima
        playGameSound('perfect-streak', 1.8);
        setFeedbackAnimation('confetti animate-bounce-in animate-cta-glow animate-pulse-glow');
      } else if (newStreak === 2) {
        // Som especial para segunda sequência
        playGameSound('correct', 1.5);
        setFeedbackAnimation('confetti animate-bounce-in animate-cta-glow');
      } else {
        // Som base de acerto com intensidade progressiva
        const intensityBoost = Math.min(1.2 + (progress / 200), 1.8);
        playGameSound('correct', intensityBoost);
        setFeedbackAnimation('confetti animate-bounce-in');
      }
    } else {
      // Reset streak mas manter motivação
      setStreakCount(0);
      playGameSound('incorrect', 0.7);
      setFeedbackAnimation('shake animate-cta-shake');
    }

    // Limpar animação com duração otimizada
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackAnimation('');
    }, 1000);
  }, [playGameSound, streakCount, progress]);

  // Som de progresso com marco de conversão
  const playProgressSound = useCallback((achievementLevel: 'normal' | 'milestone' | 'completion' = 'normal') => {
    switch (achievementLevel) {
      case 'milestone':
        // Som especial para marcos importantes (25%, 50%, 75%)
        playGameSound('achievement', 1.6);
        setTimeout(() => playGameSound('level-up', 1.2), 300);
        break;
      case 'completion':
        // Sequência épica para finalização
        playGameSound('level-up', 1.8);
        setTimeout(() => playGameSound('achievement', 1.5), 400);
        setTimeout(() => playGameSound('perfect-streak', 1.3), 800);
        break;
      default:
        // Som padrão de progresso
        playGameSound('level-up', 1.1);
        break;
    }
  }, [playGameSound]);

  // Sistema inteligente de countdown com urgência progressiva
  const startCountdown = useCallback((
    totalSeconds: number, 
    onTimeAlert?: () => void, 
    onTimeUp?: () => void
  ) => {
    let timeLeft = totalSeconds;
    
    const countdownInterval = setInterval(() => {
      timeLeft--;
      
      // Alertas progressivos mais inteligentes
      if (timeLeft === 30) {
        playGameSound('time-alert', 0.8);
      } else if (timeLeft === 15) {
        playGameSound('time-alert', 1.0);
      } else if (timeLeft <= 10 && timeLeft > 5) {
        const urgency = (10 - timeLeft) / 5;
        playGameSound('countdown', 0.6 + urgency * 0.4);
      } else if (timeLeft <= 5 && timeLeft > 0) {
        // Urgência máxima nos últimos 5 segundos
        playGameSound('time-alert', 1.3 + (5 - timeLeft) * 0.1);
        onTimeAlert?.();
      }
      
      // Fim do tempo com som impactante
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        playGameSound('time-alert', 2.0);
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [playGameSound]);

  // Controles de som
  const setVolume = useCallback((level: number) => {
    setState(prev => ({ ...prev, volumeLevel: Math.max(0, Math.min(1, level)) }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Som de transição entre páginas
  const playPageTransition = useCallback(() => {
    playGameSound('page-transition', 1.0);
  }, [playGameSound]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // Preload som no início de cada página
  useEffect(() => {
    if (state.audioContext && state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }
  }, [currentPage, state.audioContext]);

  return {
    // Estados
    soundEnabled: state.soundEnabled,
    volumeLevel: state.volumeLevel,
    feedbackAnimation,
    streakCount,
    isInitialized: state.isInitialized,
    
    // Controles
    setVolume,
    toggleSound,
    
    // Sons específicos
    playGameSound,
    playAnswerFeedback,
    playProgressSound,
    playPageTransition,
    startCountdown,
    
    // Utilitários
    clearFeedbackAnimation: () => setFeedbackAnimation(''),
    resetStreak: () => setStreakCount(0)
  };
};

// Hook para componentes que precisam apenas do feedback visual/sonoro simples
export const useSimpleSoundFeedback = () => {
  const [animationClass, setAnimationClass] = useState('');

  const triggerFeedback = useCallback((type: 'success' | 'error' | 'achievement') => {
    const animations = {
      success: 'animate-bounce-in animate-cta-glow',
      error: 'animate-cta-shake',
      achievement: 'confetti animate-bounce-in animate-pulse-glow'
    };

    setAnimationClass(animations[type]);
    setTimeout(() => setAnimationClass(''), 1000);
  }, []);

  return {
    animationClass,
    triggerFeedback,
    clearAnimation: () => setAnimationClass('')
  };
};