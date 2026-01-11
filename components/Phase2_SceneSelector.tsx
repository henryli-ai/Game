import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';
import { SceneType } from '../types';
import { generateQuestion } from '../services/openaiService';

export const Phase2_SceneSelector: React.FC = () => {
  const { selectScene, setPhase, setQuestion, setEnemy } = useGameStore();
  const [zoomed, setZoomed] = useState<SceneType | null>(null);

  const handleSelect = async (scene: SceneType) => {
    setZoomed(scene);
    selectScene(scene);

    // Prefetch Data during animation
    const qPromise = generateQuestion('math', 'hard');
    
    // Mock Enemy Data
    const mockEnemy = {
      id: Math.floor(Math.random() * 100),
      name: scene === 'mountain' ? 'Charizard' : scene === 'forest' ? 'Venusaur' : 'Greninja',
      nameZh: scene === 'mountain' ? '噴火龍' : scene === 'forest' ? '妙蛙花' : '甲賀忍蛙',
      starLevel: 5 as 4|5|6,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${scene === 'mountain' ? 6 : scene === 'forest' ? 3 : 658}.png`,
      type: scene === 'mountain' ? 'fire' : scene === 'forest' ? 'grass' : 'water' as any,
    };
    
    setEnemy(mockEnemy);
    
    const [q] = await Promise.all([qPromise, new Promise(r => setTimeout(r, 1500))]); // Ensure animation plays
    setQuestion(q);
    setPhase('BATTLE');
  };

  // Clip Paths
  // Top (Mountain): Triangle pointing down to center
  const clipTop = "polygon(0 0, 100% 0, 50% 50%)";
  // Left (Swamp): Triangle pointing right to center + bottom corner
  const clipLeft = "polygon(0 0, 0 100%, 50% 100%, 50% 50%)"; 
  // Right (Forest): Triangle pointing left to center + bottom corner
  const clipRight = "polygon(100% 0, 100% 100%, 50% 100%, 50% 50%)";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Mountain - Top */}
      <motion.div
        className="absolute inset-0 bg-stone-800 cursor-pointer hover:bg-stone-700 transition-colors z-10 flex items-start justify-center pt-20"
        style={{ clipPath: clipTop }}
        onClick={() => handleSelect('mountain')}
        whileHover={{ scale: 1.02, zIndex: 20 }}
      >
         <div className="text-center pointer-events-none">
           <h2 className="text-4xl font-bold text-mezastar-gold drop-shadow-lg">MOUNTAIN</h2>
           <p className="text-white">山頂 (Fire)</p>
         </div>
      </motion.div>

      {/* Swamp - Bottom Left */}
      <motion.div
        className="absolute inset-0 bg-indigo-900 cursor-pointer hover:bg-indigo-800 transition-colors z-10 flex items-end justify-start pb-20 pl-20"
        style={{ clipPath: clipLeft }}
        onClick={() => handleSelect('swamp')}
        whileHover={{ scale: 1.02, zIndex: 20 }}
      >
        <div className="text-center pointer-events-none ml-10 mb-10">
           <h2 className="text-4xl font-bold text-mezastar-gold drop-shadow-lg">SWAMP</h2>
           <p className="text-white">沼澤 (Water)</p>
         </div>
      </motion.div>

      {/* Forest - Bottom Right */}
      <motion.div
        className="absolute inset-0 bg-emerald-900 cursor-pointer hover:bg-emerald-800 transition-colors z-10 flex items-end justify-end pb-20 pr-20"
        style={{ clipPath: clipRight }}
        onClick={() => handleSelect('forest')}
        whileHover={{ scale: 1.02, zIndex: 20 }}
      >
        <div className="text-center pointer-events-none mr-10 mb-10">
           <h2 className="text-4xl font-bold text-mezastar-gold drop-shadow-lg">FOREST</h2>
           <p className="text-white">森林 (Grass)</p>
         </div>
      </motion.div>

      {/* Center Decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-mezastar-gold rounded-full z-30 shadow-[0_0_30px_#FFD700] flex items-center justify-center border-4 border-white">
        <span className="font-bold text-black text-xs text-center leading-tight">SELECT<br/>AREA</span>
      </div>
      
      {zoomed && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 bg-white z-50 flex items-center justify-center"
        >
          <h1 className="text-6xl text-black font-bold animate-pulse">ENCOUNTER!</h1>
        </motion.div>
      )}
    </div>
  );
};