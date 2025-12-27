import React, { useRef, useEffect } from 'react';
import { DailyLog } from '../types';
import { Button } from './Button';

interface SimulationViewerProps {
  logs: DailyLog[];
  isDarkMode: boolean;
  isDebugMode: boolean; 
  onNextDay: () => void;
  isGenerating: boolean;
  hasGuests: boolean;
  gameState: 'PLAYING' | 'GAME_OVER' | 'VICTORY';
  onRestart: () => void;
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({ 
  logs, 
  isDarkMode, 
  onNextDay, 
  isGenerating,
  hasGuests,
  gameState,
  onRestart
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, gameState]);

  const bgColor = isDarkMode ? "bg-black" : "bg-white";
  const borderColor = isDarkMode ? "border-red-800" : "border-red-900";
  const headerColor = isDarkMode ? "text-red-400" : "text-red-900";
  const textColor = isDarkMode ? "text-red-200" : "text-stone-800";
  const secondaryTextColor = isDarkMode ? "text-red-300" : "text-stone-600";
  const dividerColor = isDarkMode ? "bg-red-900" : "bg-red-200";

  return (
    <div className={`h-full flex flex-col border-4 border-double ${borderColor} ${bgColor} shadow-lg transition-colors duration-300 relative`}>
      {logs.length > 0 && (
          <div className={`px-6 py-2 ${isDarkMode ? 'bg-red-950/30' : 'bg-red-50'} border-b ${borderColor} flex justify-end items-center`}>
            <div className={`text-xl font-bold tracking-widest ${headerColor}`}>
               Day {logs[logs.length - 1].day}
            </div>
          </div>
      )}

      {/* Main Content Area with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
        {logs.length === 0 ? (
          <div className={`h-full flex flex-col items-center justify-center italic ${isDarkMode ? 'text-red-400' : 'text-red-800'} opacity-70`}>
            <p className="mb-4 text-lg">기록된 시뮬레이션이 없습니다.</p>
            {hasGuests ? 
              <p>시뮬레이션을 시작하려면 아래 '게임 시작' 버튼을 누르세요.</p> :
              <p>시작하려면 오른쪽 패널에서 고객을 등록해주세요.</p>
            }
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={log.day} className={`animate-fade-in ${index === logs.length - 1 ? 'min-h-[50%]' : ''}`}>
               <div className="flex items-center gap-4 mb-4">
                 <div className={`h-px flex-1 ${dividerColor}`}></div>
                 <h2 className={`text-2xl font-bold uppercase ${headerColor}`}>{log.day}일차</h2>
                 <div className={`h-px flex-1 ${dividerColor}`}></div>
               </div>

               <div className={`p-4 mb-6 italic text-lg border-l-4 ${isDarkMode ? 'border-red-600 bg-neutral-900 text-red-100' : 'border-red-800 bg-red-50 text-red-900'} rounded-r-md`}>
                 "{log.summary}"
               </div>

               <div className="space-y-6">
                   <div className="space-y-3">
                       {log.characterActions.map((char, i) => (
                           <div key={i} className={`flex gap-3 ${textColor}`}>
                               <span className={`font-bold whitespace-nowrap ${isDarkMode ? 'text-red-400' : 'text-red-900'}`}>{char.guestName}:</span>
                               <span>{char.action}</span>
                           </div>
                       ))}
                   </div>

                   {log.interactions.length > 0 && (
                       <div className={`p-4 border ${isDarkMode ? 'border-red-800 bg-neutral-900/50' : 'border-red-100 bg-white'} rounded-sm`}>
                           <h4 className={`text-sm uppercase tracking-widest mb-2 font-bold ${headerColor}`}>상호작용</h4>
                           <ul className="space-y-2">
                               {log.interactions.map((interaction, i) => (
                                   <li key={i} className={secondaryTextColor}>
                                       <span className={`font-bold mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>[{interaction.participants.join(' & ')}]</span>
                                       {interaction.scenario}
                                   </li>
                               ))}
                           </ul>
                       </div>
                   )}

                    <div className={`p-4 border ${isDarkMode ? 'border-red-900 bg-red-950/20' : 'border-red-100 bg-red-50/50'} rounded-sm`}>
                           <h4 className={`text-sm uppercase tracking-widest mb-2 font-bold ${headerColor}`}>호텔 리포트</h4>
                           <ul className="space-y-2 list-disc pl-5">
                               {log.hotelEvents.map((evt, i) => (
                                   <li key={i} className={secondaryTextColor}>
                                       {evt}
                                   </li>
                               ))}
                           </ul>
                       </div>
               </div>
            </div>
          ))
        )}

        {/* Ending Messages */}
        {gameState === 'GAME_OVER' && (
            <div className="mt-8 p-6 text-center border-4 border-double border-gray-500 bg-gray-900 text-gray-300 animate-fade-in">
                <h2 className="text-4xl font-bold mb-4 text-red-600">GAME OVER</h2>
                <p className="mb-4 text-xl">호텔에 남은 투숙객이 아무도 없습니다.</p>
            </div>
        )}
        {gameState === 'VICTORY' && (
            <div className="mt-8 p-6 text-center border-4 border-double border-yellow-500 bg-yellow-900/30 text-yellow-100 animate-fade-in">
                <h2 className="text-4xl font-bold mb-4 text-yellow-400">VICTORY</h2>
                <p className="mb-4 text-xl">탈출에 성공했습니다! 악몽은 끝났습니다.</p>
            </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={`p-4 border-t-2 ${borderColor} flex justify-center bg-opacity-90 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
         {gameState !== 'PLAYING' ? (
             <Button 
                onClick={onRestart} 
                isDarkMode={isDarkMode}
                className="w-full md:w-auto min-w-[200px] border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-600"
             >
                 새로운 시작
             </Button>
         ) : (
            !hasGuests ? (
                <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-800'} opacity-70`}>캐릭터를 먼저 생성해주세요.</div>
            ) : (
                <Button 
                    onClick={onNextDay} 
                    disabled={isGenerating} 
                    isDarkMode={isDarkMode}
                    className="w-full md:w-auto min-w-[200px]"
                >
                    {isGenerating ? '시뮬레이션 중...' : (logs.length === 0 ? '게임 시작' : '다음날')}
                </Button>
            )
         )}
      </div>
    </div>
  );
};