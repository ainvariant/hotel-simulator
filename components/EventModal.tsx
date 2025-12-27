import React, { useState, useEffect } from 'react';
import { GameEvent, GameEventOption, GameEventOutcome } from '../types';
import { Button } from './Button';

interface EventModalProps {
  isOpen: boolean;
  event: GameEvent | null;
  targetName: string | null; // New prop to display who is targeted
  onComplete: (outcome: GameEventOutcome) => void;
  isDarkMode: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, event, targetName, onComplete, isDarkMode }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<GameEventOutcome | null>(null);

  // Reset state when a new event opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOutcome(null);
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleOptionClick = (option: GameEventOption) => {
    // Pick random outcome
    const randomOutcome = option.outcomes[Math.floor(Math.random() * option.outcomes.length)];
    setSelectedOutcome(randomOutcome);
  };

  const handleClose = () => {
    if (selectedOutcome) {
      onComplete(selectedOutcome);
    }
  };

  const bgColor = isDarkMode ? "bg-neutral-900" : "bg-white";
  const textColor = isDarkMode ? "text-red-300" : "text-red-900";
  const borderColor = isDarkMode ? "border-red-700" : "border-red-900";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 p-4 font-serif">
      <div className={`w-full max-w-lg border-4 border-double ${borderColor} ${bgColor} shadow-2xl relative p-6 flex flex-col items-center text-center animate-fade-in`}>
        
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 uppercase tracking-widest ${textColor}`}>
          {event.title}
        </h2>

        {/* Target Display */}
        <div className={`mb-4 px-3 py-1 rounded text-sm font-bold ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}`}>
             대상: {targetName || '알 수 없음'}
        </div>

        {!selectedOutcome ? (
          <>
            <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {event.description}
            </p>
            <div className="flex flex-col w-full gap-4">
              {event.options.map((option, idx) => (
                <Button 
                  key={idx} 
                  isDarkMode={isDarkMode} 
                  onClick={() => handleOptionClick(option)}
                  className="w-full py-4 text-lg"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-fade-in w-full">
            <div className={`text-lg mb-6 p-4 border ${isDarkMode ? 'border-red-800 bg-black/50' : 'border-red-200 bg-red-50'}`}>
              <p className={`mb-2 font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>결과:</p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>{selectedOutcome.description}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-bold">
                {selectedOutcome.healthChange !== 0 && (
                  <span className={selectedOutcome.healthChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    체력 {selectedOutcome.healthChange > 0 ? '+' : ''}{selectedOutcome.healthChange}
                  </span>
                )}
                {selectedOutcome.sanityChange !== 0 && (
                  <span className={selectedOutcome.sanityChange > 0 ? 'text-blue-500' : 'text-purple-500'}>
                    정신력 {selectedOutcome.sanityChange > 0 ? '+' : ''}{selectedOutcome.sanityChange}
                  </span>
                )}
                {selectedOutcome.isVictory && (
                    <span className="text-yellow-500 animate-pulse">✨ 탈출 성공! ✨</span>
                )}
              </div>
            </div>
            
            <Button onClick={handleClose} isDarkMode={isDarkMode} className="w-full">
              확인
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};