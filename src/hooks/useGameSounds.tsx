import { useCallback, useRef } from 'react';

export interface GameSound {
  buttonClick: string;
  wheelSpin: string;
  confetti: string;
  prize: string;
}

// URLs dos sons (usando sons de domínio público)
const GAME_SOUNDS: GameSound = {
  buttonClick: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGUfBTOKzfPYhzgJFuO28OOSPwwPUrDo6GwcDjpzuOXOhTEOCl2zz5kXCAgJoQ==',
  wheelSpin: 'data:audio/wav;base64,UklGRk4nAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSonAAA=',
  confetti: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGUfBTOKzfPYhzgJFuO28OOSPwwPUrDo6GwcDjpzuOXOhTEOCl2zz5kXCAgJoQ==',
  prize: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGUfBTOKzfPYhzgJFuO28OOSPwwPUrDo6GwcDjpzuOXOhTEOCl2zz5kXCAgJoQ=='
};

export const useGameSounds = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const lastPlayTime = useRef<{ [key: string]: number }>({});

  // Inicializa os áudios
  const initializeAudio = useCallback((soundKey: keyof GameSound) => {
    if (!audioRefs.current[soundKey]) {
      const audio = new Audio(GAME_SOUNDS[soundKey]);
      audio.volume = 0.3; // Volume moderado
      audio.preload = 'auto';
      audioRefs.current[soundKey] = audio;
    }
    return audioRefs.current[soundKey];
  }, []);

  // Reproduz um som específico
  const playSound = useCallback(async (soundKey: keyof GameSound, volume: number = 0.3) => {
    try {
      // Evita reprodução excessiva (throttling de 200ms)
      const now = Date.now();
      if (lastPlayTime.current[soundKey] && (now - lastPlayTime.current[soundKey]) < 200) {
        return;
      }
      lastPlayTime.current[soundKey] = now;

      const audio = initializeAudio(soundKey);
      audio.volume = Math.min(Math.max(volume, 0), 1); // Clamp entre 0 e 1
      
      // Reset para tocar novamente se já estava tocando
      audio.currentTime = 0;
      
      await audio.play();
    } catch (error) {
      // Silenciar erros de autoplay - comum em navegadores modernos
      console.debug('Audio play failed:', error);
    }
  }, [initializeAudio]);

  // Sons específicos do jogo
  const playButtonClick = useCallback(() => {
    playSound('buttonClick', 0.2);
  }, [playSound]);

  const playWheelSpin = useCallback(() => {
    playSound('wheelSpin', 0.4);
  }, [playSound]);

  const playConfetti = useCallback(() => {
    playSound('confetti', 0.5);
  }, [playSound]);

  const playPrize = useCallback(() => {
    playSound('prize', 0.6);
  }, [playSound]);

  // Pré-carrega todos os sons
  const preloadSounds = useCallback(() => {
    Object.keys(GAME_SOUNDS).forEach(soundKey => {
      initializeAudio(soundKey as keyof GameSound);
    });
  }, [initializeAudio]);

  return {
    playButtonClick,
    playWheelSpin,
    playConfetti,
    playPrize,
    preloadSounds
  };
};