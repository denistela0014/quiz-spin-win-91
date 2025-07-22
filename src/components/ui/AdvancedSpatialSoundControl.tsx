import React from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { useAdvancedSpatialSounds } from '@/hooks/useAdvancedSpatialSounds';

interface AdvancedSpatialSoundControlProps {
  className?: string;
  showTestButtons?: boolean;
}

export const AdvancedSpatialSoundControl: React.FC<AdvancedSpatialSoundControlProps> = ({
  className = '',
  showTestButtons = false
}) => {
  const {
    soundEnabled,
    volumeLevel,
    toggleSound,
    setVolume,
    playSpatialSound,
    playAnswerFeedback,
    playMilestone,
    playPageTransition
  } = useAdvancedSpatialSounds();

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const testSounds = [
    { name: 'Resposta Correta', action: () => playAnswerFeedback(true, false, 1500) },
    { name: 'Streak Épico', action: () => playAnswerFeedback(true, true) },
    { name: 'Marco Alcançado', action: () => playMilestone('achievement') },
    { name: 'Vitória Final', action: () => playMilestone('completion') },
    { name: 'Celebração', action: () => playMilestone('celebration') },
    { name: 'Transição', action: () => playPageTransition() },
    { name: 'Som Futurista', action: () => playSpatialSound('button-futuristic', 1.2) },
    { name: 'Roleta Girando', action: () => playSpatialSound('roulette-spinning', 1.0) },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Botão principal de som */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSound}
        className="h-8 w-8 p-0"
        aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
      >
        {soundEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>

      {/* Controles avançados */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Configurações de som"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Controles de Áudio Espacial</h3>
              
              {/* Controle de volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Volume</label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(volumeLevel * 100)}%
                  </span>
                </div>
                <Slider
                  value={[volumeLevel]}
                  onValueChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={!soundEnabled}
                  className="w-full"
                />
              </div>

              {/* Status do som */}
              <div className="text-xs text-muted-foreground">
                Status: {soundEnabled ? 'Ativado' : 'Desativado'}
              </div>

              {/* Botões de teste (opcional) */}
              {showTestButtons && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Testar Sons:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {testSounds.map((sound, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={sound.action}
                        disabled={!soundEnabled}
                        className="text-xs h-8"
                      >
                        {sound.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações sobre áudio espacial */}
              <div className="text-xs text-muted-foreground border-t pt-2">
                <p>🎧 Use fones de ouvido para melhor experiência espacial</p>
                <p>🔊 Sons se adaptam ao seu desempenho no quiz</p>
              </div>
            </div>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Indicador visual de som ativo */}
      {soundEnabled && (
        <div className="flex space-x-1">
          <div className="w-1 h-4 bg-primary/60 rounded animate-pulse" />
          <div className="w-1 h-4 bg-primary/40 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-4 bg-primary/20 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      )}
    </div>
  );
};