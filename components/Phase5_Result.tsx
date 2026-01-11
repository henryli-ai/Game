import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import { useGameStore } from '../store';
import { Download } from 'lucide-react';

export const Phase5_Result: React.FC = () => {
  const { caughtPokemon, resetHp, setPhase } = useGameStore();
  const printRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const handleCapture = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      setCaptured(canvas.toDataURL());
    }
  };

  const handleRestart = () => {
    resetHp();
    setPhase('INIT');
  };

  if (!caughtPokemon) return null;

  return (
    <div className="w-full h-full bg-black flex flex-col items-center overflow-hidden">
      {!captured ? (
        <>
          <div ref={printRef} className="relative w-full h-[70vh] bg-gray-900">
             <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
             />
             {/* Overlay */}
             <div className="absolute bottom-4 right-4 animate-bounce">
                <img src={caughtPokemon.imageUrl} alt="Caught" className="w-48 h-48 drop-shadow-[0_0_10px_white]" />
             </div>
             {/* Frame UI */}
             <div className="absolute top-4 left-4 bg-mezastar-gold px-4 py-2 rounded-lg border-2 border-white shadow-lg">
                <h1 className="text-2xl font-black text-purple-900">{caughtPokemon.name} GET!</h1>
                <div className="flex text-yellow-900">
                   {[...Array(caughtPokemon.starLevel)].map((_,i) => <span key={i}>★</span>)}
                </div>
             </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center gap-4 bg-mezastar-purple">
            <button 
                onClick={handleCapture}
                className="bg-white text-mezastar-purple font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-2"
            >
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                SNAP PHOTO
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-slate-900 p-8">
            <h2 className="text-3xl text-mezastar-gold font-bold">NICE SHOT!</h2>
            <img src={captured} alt="Result" className="w-full max-w-md border-4 border-white rounded-lg shadow-2xl" />
            <a 
                href={captured} 
                download={`pokemath-${Date.now()}.jpg`}
                className="flex items-center gap-2 text-white bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-500"
            >
                <Download size={20} /> Save Image
            </a>
            <button 
                onClick={handleRestart}
                className="text-gray-400 hover:text-white underline mt-4"
            >
                Play Again
            </button>
        </div>
      )}
    </div>
  );
};