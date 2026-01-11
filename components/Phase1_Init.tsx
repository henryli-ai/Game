import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store';
import { generateQuestion } from '../services/openaiService';

export const Phase1_Init: React.FC = () => {
  const { setPhase, setProficiency, setQuestion } = useGameStore();
  const [loading, setLoading] = useState(false);

  const startGame = async () => {
    setLoading(true);
    // Simple proficiency check logic
    const q = await generateQuestion('math', 'easy');
    setQuestion(q);
    setLoading(false);
    // In a full implementation, we'd show the question here. 
    // For this prototype, we'll simulate a "Correct" answer boosting us to expert
    // and moving to Scene Select.
    setProficiency('expert');
    setPhase('SCENE_SELECT');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-mezastar-purple to-black text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-6xl font-black text-mezastar-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] tracking-wider">
          POKÉMATH
        </h1>
        <h2 className="text-4xl font-bold text-white mt-2">ADVENTURE</h2>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        disabled={loading}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-mezastar-gold to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative px-12 py-6 bg-black rounded-full leading-none flex items-center divide-x divide-gray-600">
          <span className="flex items-center space-x-5">
            <span className="pr-6 text-gray-100 text-2xl font-bold">
              {loading ? 'LOADING...' : 'START GAME'}
            </span>
          </span>
        </div>
      </motion.button>
      
      <p className="mt-8 text-gray-400 text-sm">
        Generated Spec available in cursor_spec.md
      </p>
    </div>
  );
};