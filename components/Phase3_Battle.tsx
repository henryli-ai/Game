import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store';
import { generateQuestion } from '../services/openaiService';

export const Phase3_Battle: React.FC = () => {
  const { currentEnemy, currentQuestion, playerHp, takeDamage, setPhase, setQuestion } = useGameStore();
  const [isDamaged, setIsDamaged] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  if (!currentEnemy || !currentQuestion) return null;

  const handleAnswer = async (option: string) => {
    if (option === currentQuestion.correctAnswer) {
      // Correct
      setFeedback('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Delay before catch
      setTimeout(() => {
        setPhase('CATCH');
      }, 1500);
    } else {
      // Wrong
      setFeedback('wrong');
      setIsDamaged(true);
      takeDamage(1);
      
      // Flash red screen
      setTimeout(() => {
        setIsDamaged(false);
        setFeedback(null);
        if (playerHp <= 1) {
             // Game Over logic (omitted for spec brevity, usually restart)
             alert("Game Over! Try again.");
             window.location.reload();
        } else {
             // New Question
             generateQuestion(currentQuestion.type, 'easy').then(q => setQuestion(q));
        }
      }, 1000);
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col p-4 transition-colors duration-100 ${isDamaged ? 'bg-red-900' : 'bg-slate-900'}`}>
      {/* Header / HP */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${i < playerHp ? 'bg-green-500 shadow-[0_0_10px_#00FF00]' : 'bg-gray-800'}`} />
           ))}
        </div>
        <div className="text-white font-bold text-xl">{currentEnemy.nameZh} (Lv. 50)</div>
      </div>

      {/* Enemy Area */}
      <div className="flex-1 flex items-center justify-center relative">
        <motion.img 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: isDamaged ? [0, -10, 10, -10, 10, 0] : 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          src={currentEnemy.imageUrl}
          alt={currentEnemy.name}
          className="w-64 h-64 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        />
        {feedback === 'correct' && (
           <motion.div initial={{scale:0}} animate={{scale:1.5}} className="absolute text-green-400 font-black text-6xl drop-shadow-lg">
             GREAT!
           </motion.div>
        )}
        {feedback === 'wrong' && (
           <motion.div initial={{scale:0}} animate={{scale:1.5}} className="absolute text-red-500 font-black text-6xl drop-shadow-lg">
             OUCH!
           </motion.div>
        )}
      </div>

      {/* Question Area */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-mezastar-gold"
      >
        <h3 className="text-3xl text-center font-bold text-white mb-6 font-mono">{currentQuestion.text}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={feedback !== null}
              className="bg-mezastar-purple border-2 border-mezastar-gold text-white text-2xl font-bold py-4 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-[0_4px_0_#000]"
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};