import React from 'react';
import { useGameStore } from './store';
import { Phase1_Init } from './components/Phase1_Init';
import { Phase2_SceneSelector } from './components/Phase2_SceneSelector';
import { Phase3_Battle } from './components/Phase3_Battle';
import { Phase4_Catch } from './components/Phase4_Catch';
import { Phase5_Result } from './components/Phase5_Result';

export default function App() {
  const { phase } = useGameStore();

  return (
    <div className="w-screen h-screen overflow-hidden select-none">
      {phase === 'INIT' && <Phase1_Init />}
      {phase === 'SCENE_SELECT' && <Phase2_SceneSelector />}
      {phase === 'BATTLE' && <Phase3_Battle />}
      {phase === 'CATCH' && <Phase4_Catch />}
      {phase === 'RESULT' && <Phase5_Result />}
    </div>
  );
}