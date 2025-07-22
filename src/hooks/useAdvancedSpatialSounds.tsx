import { useCallback, useRef, useState, useEffect } from 'react';

export type SpatialSoundType = 
  | 'correct-advanced'
  | 'incorrect-encouraging'
  | 'perfect-streak-epic'
  | 'achievement-fanfare'
  | 'milestone-celebration'
  | 'completion-victory'
  | 'countdown-urgent'
  | 'time-alert-intense'
  | 'button-futuristic'
  | 'page-transition-smooth'
  | 'roulette-spinning'
  | 'confetti-celebration'
  | 'prize-victory';

interface Position3D {
  x: number;
  y: number;
  z: number;
}

interface SpatialSoundConfig {
  frequencies: number[];
  waveType: OscillatorType;
  duration: number;
  volume: number;
  position: Position3D;
  modulation?: boolean;
}

interface SpatialSoundState {
  audioContext: AudioContext | null;
  soundEnabled: boolean;
  volumeLevel: number;
  masterGainNode: GainNode | null;
}

const SPATIAL_SOUND_CONFIGS: Record<SpatialSoundType, SpatialSoundConfig> = {
  'correct-advanced': {
    frequencies: [523.25, 659.25, 783.99, 1046.50],
    waveType: 'sine',
    duration: 0.12,
    volume: 1.2,
    position: { x: 1, y: 0, z: 0 },
    modulation: true
  },
  'incorrect-encouraging': {
    frequencies: [280, 350],
    waveType: 'triangle',
    duration: 0.15,
    volume: 0.6,
    position: { x: -0.5, y: 0, z: 0 }
  },
  'perfect-streak-epic': {
    frequencies: [440, 554.37, 659.25, 783.99, 987.77],
    waveType: 'sine',
    duration: 0.8,
    volume: 1.5,
    position: { x: 0, y: 0.5, z: 0 },
    modulation: true
  },
  'achievement-fanfare': {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51],
    waveType: 'triangle',
    duration: 1.2,
    volume: 1.4,
    position: { x: 0, y: 1, z: 0 },
    modulation: true
  },
  'milestone-celebration': {
    frequencies: [440, 523.25, 659.25, 783.99],
    waveType: 'sine',
    duration: 1.0,
    volume: 1.3,
    position: { x: 0.5, y: 0.5, z: -0.2 },
    modulation: true
  },
  'completion-victory': {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
    waveType: 'sine',
    duration: 2.5,
    volume: 1.8,
    position: { x: 0, y: 0, z: 0 },
    modulation: true
  },
  'countdown-urgent': {
    frequencies: [220, 246.94],
    waveType: 'sawtooth',
    duration: 0.3,
    volume: 1.0,
    position: { x: 0, y: -0.5, z: 0.5 }
  },
  'time-alert-intense': {
    frequencies: [174.61, 196.00],
    waveType: 'square',
    duration: 0.5,
    volume: 1.1,
    position: { x: -1, y: 0, z: 0 }
  },
  'button-futuristic': {
    frequencies: [800, 1000],
    waveType: 'sine',
    duration: 0.1,
    volume: 0.8,
    position: { x: 0.3, y: 0, z: 0 }
  },
  'page-transition-smooth': {
    frequencies: [440, 554.37, 659.25],
    waveType: 'sine',
    duration: 0.6,
    volume: 1.0,
    position: { x: 0, y: 0, z: -0.5 },
    modulation: true
  },
  'roulette-spinning': {
    frequencies: [250, 300, 350, 400, 450],
    waveType: 'sine',
    duration: 3.0,
    volume: 1.2,
    position: { x: 0, y: 0, z: 0 },
    modulation: true
  },
  'confetti-celebration': {
    frequencies: [600, 650, 700, 750],
    waveType: 'triangle',
    duration: 1.5,
    volume: 1.4,
    position: { x: 0, y: 1, z: -0.5 },
    modulation: true
  },
  'prize-victory': {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51],
    waveType: 'sine',
    duration: 2.0,
    volume: 1.8,
    position: { x: 0, y: 0.5, z: 0 },
    modulation: true
  }
};

export const useAdvancedSpatialSounds = () => {
  const [state, setState] = useState<SpatialSoundState>({
    audioContext: null,
    soundEnabled: true,
    volumeLevel: 0.7,
    masterGainNode: null
  });

  const lastPlayTime = useRef<Record<string, number>>({});
  const activeOscillators = useRef<Set<OscillatorNode>>(new Set());

  // Inicialização do contexto de áudio
  useEffect(() => {
    const initAudioContext = () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const masterGain = context.createGain();
        masterGain.connect(context.destination);
        
        setState(prev => ({
          ...prev,
          audioContext: context,
          masterGainNode: masterGain
        }));
      } catch (error) {
        console.warn('Erro ao inicializar contexto de áudio:', error);
      }
    };

    initAudioContext();
    
    return () => {
      activeOscillators.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Ignorar erros de osciladores já parados
        }
      });
      activeOscillators.current.clear();
    };
  }, []);

  // Função principal para criar som espacial futurista
  const createFuturisticSpatialSound = useCallback((
    config: SpatialSoundConfig,
    frequencyIndex: number = 0
  ) => {
    if (!state.audioContext || !state.soundEnabled || !state.masterGainNode) return null;

    const frequency = config.frequencies[frequencyIndex] || config.frequencies[0];
    const oscillator = state.audioContext.createOscillator();
    const gainNode = state.audioContext.createGain();
    const panner = state.audioContext.createPanner();

    // Configuração avançada de áudio espacial 3D com HRTF
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'exponential';
    panner.refDistance = 1;
    panner.maxDistance = 10;
    panner.rolloffFactor = 1;

    // Posicionamento espacial
    if (panner.positionX) {
      panner.positionX.setValueAtTime(config.position.x, state.audioContext.currentTime);
      panner.positionY.setValueAtTime(config.position.y, state.audioContext.currentTime);
      panner.positionZ.setValueAtTime(config.position.z, state.audioContext.currentTime);
    }

    // Configuração do oscilador
    oscillator.type = config.waveType;
    oscillator.frequency.setValueAtTime(frequency, state.audioContext.currentTime);

    // Modulação avançada para sons épicos
    if (config.modulation) {
      const lfoOscillator = state.audioContext.createOscillator();
      const lfoGain = state.audioContext.createGain();
      
      lfoOscillator.frequency.setValueAtTime(5, state.audioContext.currentTime);
      lfoOscillator.type = 'sine';
      lfoGain.gain.setValueAtTime(10, state.audioContext.currentTime);
      
      lfoOscillator.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfoOscillator.start(state.audioContext.currentTime);
      lfoOscillator.stop(state.audioContext.currentTime + config.duration);
    }

    // Configuração do volume com envelope suave
    const adjustedVolume = (config.volume * state.volumeLevel) / 10;
    gainNode.gain.setValueAtTime(0, state.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(adjustedVolume, state.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, state.audioContext.currentTime + config.duration);

    // Conexão da cadeia de áudio
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(state.masterGainNode);

    // Controle de ciclo de vida
    activeOscillators.current.add(oscillator);
    oscillator.onended = () => {
      activeOscillators.current.delete(oscillator);
    };

    oscillator.start(state.audioContext.currentTime);
    oscillator.stop(state.audioContext.currentTime + config.duration);

    return { oscillator, gainNode, panner };
  }, [state.audioContext, state.soundEnabled, state.volumeLevel, state.masterGainNode]);

  // Função para tocar som espacial com throttling
  const playSpatialSound = useCallback(async (
    soundType: SpatialSoundType,
    intensity: number = 1.0,
    customPosition?: Position3D
  ) => {
    try {
      const now = Date.now();
      const lastPlay = lastPlayTime.current[soundType] || 0;
      if (now - lastPlay < 100) return;
      lastPlayTime.current[soundType] = now;

      if (state.audioContext?.state === 'suspended') {
        await state.audioContext.resume();
      }

      const config = { ...SPATIAL_SOUND_CONFIGS[soundType] };
      config.volume *= intensity;
      if (customPosition) {
        config.position = customPosition;
      }

      if (config.frequencies.length > 1) {
        config.frequencies.forEach((_, index) => {
          setTimeout(() => {
            createFuturisticSpatialSound(config, index);
          }, index * 30);
        });
      } else {
        createFuturisticSpatialSound(config);
      }

    } catch (error) {
      console.warn('Erro ao reproduzir som espacial:', error);
    }
  }, [createFuturisticSpatialSound, state.audioContext]);

  // Controles de som
  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volumeLevel: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const stopAllSounds = useCallback(() => {
    activeOscillators.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Ignorar erros de osciladores já parados
      }
    });
    activeOscillators.current.clear();
  }, []);

  // Funções de feedback dinâmico baseado no comportamento
  const playAnswerFeedback = useCallback((isCorrect: boolean, isStreak: boolean = false, responseTime?: number) => {
    if (isCorrect) {
      if (isStreak) {
        playSpatialSound('perfect-streak-epic', 1.5);
      } else {
        const intensity = responseTime && responseTime < 2000 ? 1.4 : 1.0;
        const position = responseTime && responseTime < 2000 ? { x: 1, y: 0, z: 0 } : { x: 0.5, y: 0, z: 0 };
        playSpatialSound('correct-advanced', intensity, position);
      }
    } else {
      playSpatialSound('incorrect-encouraging', 0.8, { x: -0.8, y: 0, z: 0.3 });
    }
  }, [playSpatialSound]);

  const playMilestone = useCallback((milestoneType: 'achievement' | 'completion' | 'celebration') => {
    switch (milestoneType) {
      case 'achievement':
        playSpatialSound('achievement-fanfare', 1.3);
        break;
      case 'completion':
        playSpatialSound('completion-victory', 1.8);
        break;
      case 'celebration':
        playSpatialSound('confetti-celebration', 1.5);
        break;
    }
  }, [playSpatialSound]);

  const playPageTransition = useCallback(() => {
    playSpatialSound('page-transition-smooth', 1.0);
  }, [playSpatialSound]);

  const playUrgencyAlert = useCallback((intensity: 'low' | 'medium' | 'high') => {
    const soundIntensity = intensity === 'high' ? 1.5 : intensity === 'medium' ? 1.2 : 1.0;
    const soundType = intensity === 'high' ? 'time-alert-intense' : 'countdown-urgent';
    playSpatialSound(soundType, soundIntensity);
  }, [playSpatialSound]);

  return {
    soundEnabled: state.soundEnabled,
    volumeLevel: state.volumeLevel,
    playSpatialSound,
    toggleSound,
    setVolume,
    stopAllSounds,
    playAnswerFeedback,
    playMilestone,
    playPageTransition,
    playUrgencyAlert
  };
};