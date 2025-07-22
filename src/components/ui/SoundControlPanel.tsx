import React from 'react';
import { SoundButton } from './SoundButton';
import { Card } from './card';
import { useGameifiedSounds } from '@/hooks/useGameifiedSounds';

export const SoundControlPanel: React.FC = () => {
  const { soundEnabled, volumeLevel, setVolume, toggleSound, playSound } = useGameifiedSounds();

  return (
    <Card className="p-4 bg-gradient-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">🔊 Controles de Som</h3>
          <SoundButton
            onClick={toggleSound}
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            className="min-w-[100px]"
          >
            {soundEnabled ? "🔊 Ligado" : "🔇 Desligado"}
          </SoundButton>
        </div>

        {soundEnabled && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Volume: {Math.round(volumeLevel * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumeLevel}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SoundButton
                onClick={() => playSound('correct')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                ✅ Teste Acerto
              </SoundButton>
              <SoundButton
                onClick={() => playSound('incorrect')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                ❌ Teste Erro
              </SoundButton>
              <SoundButton
                onClick={() => playSound('level-up')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🎉 Teste Progresso
              </SoundButton>
              <SoundButton
                onClick={() => playSound('time-alert')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                ⏰ Teste Alerta
              </SoundButton>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};