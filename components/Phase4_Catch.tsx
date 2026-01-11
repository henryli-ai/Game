import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store';
import { BallType } from '../types';

export const Phase4_Catch: React.FC = () => {
  const { currentEnemy, setCaughtPokemon, setPhase } = useGameStore();
  const [spinning, setSpinning] = useState(true);
  const [angle, setAngle] = useState(0);
  const reqRef = useRef<number>();
  const [resultBall, setResultBall] = useState<BallType | null>(null);

  useEffect(() => {
    if (spinning) {
      const animate = () => {
        setAngle(prev => (prev + 15) % 360); // Fast spin
        reqRef.current = requestAnimationFrame(animate);
      };
      reqRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(reqRef.current!);
    }
    return () => cancelAnimationFrame(reqRef.current!);
  }, [spinning]);

  const throwBall = () => {
    setSpinning(false);
    
    // Determine ball based on angle (Visual simulation)
    // 0-90: Poke (Red), 90-180: Great (Blue), 180-270: Ultra (Black), 270-360: Master (Purple)
    // Actually, let's make Master ball rare (small slice)
    
    // Let's just pick one for this prototype logic:
    let ball: BallType = 'poke';
    if (angle > 330 || angle < 30) ball = 'master';
    else if (angle > 200 && angle < 330) ball = 'ultra';
    else if (angle > 100 && angle < 200) ball = 'great';
    
    setResultBall(ball);
    
    // Animation delay then success
    setTimeout(() => {
      setCaughtPokemon(currentEnemy);
      setPhase('RESULT');
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-between p-8">
      <div className="text-white text-3xl font-bold">CATCH ROULETTE!</div>
      
      {/* Visual representation of enemy */}
      <img src={currentEnemy?.imageUrl} className="w-40 h-40 opacity-50 grayscale" alt="target" />

      {/* Wheel */}
      <div className="relative w-64 h-64 rounded-full border-8 border-white overflow-hidden shadow-[0_0_20px_#fff]">
         {/* Zones */}
         <div className="absolute inset-0" style={{ background: 'conic-gradient(#FF0000 0deg 100deg, #0000FF 100deg 200deg, #FFFF00 200deg 330deg, #800080 330deg 360deg)' }}></div>
         
         {/* Center */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full z-10"></div>
         
         {/* Needle */}
         <div 
            className="absolute top-0 left-0 w-full h-full transition-none origin-center"
            style={{ transform: `rotate(${angle}deg)` }}
         >
             <div className="w-1 h-1/2 bg-black mx-auto mt-0 origin-bottom" style={{ transformOrigin: '50% 100%' }}></div>
             <div className="w-4 h-4 bg-white rounded-full mx-auto -mt-2 shadow-md"></div>
         </div>
      </div>
      
      {/* Feedback Text */}
      {resultBall && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            className="text-4xl font-bold text-mezastar-gold"
          >
            {resultBall.toUpperCase()} BALL!
          </motion.div>
      )}

      <button
        onClick={throwBall}
        disabled={!spinning}
        className="bg-red-600 w-full max-w-sm py-6 rounded-2xl border-b-8 border-red-800 text-3xl font-bold text-white active:border-b-0 active:translate-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        THROW!
      </button>
    </div>
  );
};