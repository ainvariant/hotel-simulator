import React, { useState } from 'react';
import { DailyLog, MBTI } from '../types';
import { Button } from './Button';
import { MBTI_DATA, MBTI_TYPES } from '../constants';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DailyLog[];
  isDarkMode: boolean;
}

export const DebugModal: React.FC<DebugModalProps> = ({ isOpen, onClose, logs, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'WIKI'>('WIKI');
  const [selectedWikiMBTI, setSelectedWikiMBTI] = useState<MBTI | null>(null);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? "bg-neutral-900" : "bg-white";
  const textColor = isDarkMode ? "text-red-300" : "text-red-900";
  const borderColor = isDarkMode ? "border-red-700" : "border-red-900";
  const activeTabClass = isDarkMode ? "bg-red-900 text-white" : "bg-red-900 text-white";
  const inactiveTabClass = isDarkMode ? "bg-neutral-800 text-red-500" : "bg-red-100 text-red-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 font-serif">
      <div className={`w-full max-w-4xl h-[85vh] flex flex-col border-4 border-double ${borderColor} ${bgColor} shadow-2xl relative`}>
        
        {/* Header */}
        <div className={`p-4 border-b-2 ${borderColor} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold uppercase tracking-widest ${textColor}`}>디버그 모드</h2>
          <button onClick={onClose} className={`text-2xl font-bold ${textColor} hover:opacity-70`}>
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-red-900">
            <button 
                className={`flex-1 py-3 font-bold ${activeTab === 'WIKI' ? activeTabClass : inactiveTabClass}`}
                onClick={() => setActiveTab('WIKI')}
            >
                MBTI 위키
            </button>
            <button 
                className={`flex-1 py-3 font-bold ${activeTab === 'LOGS' ? activeTabClass : inactiveTabClass}`}
                onClick={() => setActiveTab('LOGS')}
            >
                시뮬레이션 로그
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* WIKI TAB */}
            {activeTab === 'WIKI' && (
                <div className="flex flex-col h-full">
                    <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        * 각 MBTI를 클릭하여 사전에 정의된 행동 패턴을 확인하세요. 시뮬레이션 시 이 중 하나가 랜덤하게 발생합니다.
                    </p>
                    
                    {/* MBTI Bar (List) */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {MBTI_TYPES.map(mbti => (
                            <button
                                key={mbti}
                                onClick={() => setSelectedWikiMBTI(mbti)}
                                className={`px-3 py-1 border text-sm font-bold transition-all ${
                                    selectedWikiMBTI === mbti
                                    ? (isDarkMode ? 'bg-red-600 text-white border-red-500' : 'bg-red-800 text-white border-red-900')
                                    : (isDarkMode ? 'bg-neutral-800 text-red-400 border-red-800 hover:bg-neutral-700' : 'bg-white text-red-800 border-red-200 hover:bg-red-50')
                                }`}
                            >
                                {mbti}
                            </button>
                        ))}
                    </div>

                    {/* Wiki Detail View */}
                    {selectedWikiMBTI ? (
                        <div className={`p-4 border ${isDarkMode ? 'border-red-800 bg-black/30' : 'border-red-100 bg-red-50/50'}`}>
                             <h3 className={`text-2xl font-bold mb-4 ${textColor} border-b ${isDarkMode ? 'border-red-800' : 'border-red-200'} pb-2`}>
                                 {selectedWikiMBTI}
                             </h3>
                             
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>행동 패턴 (5개)</h4>
                                     <ul className={`list-disc pl-5 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].behaviors.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>상호작용 패턴 (5개)</h4>
                                     <ul className={`list-disc pl-5 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].interactions.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    ) : (
                        <div className={`flex items-center justify-center h-40 border-2 border-dashed ${isDarkMode ? 'border-red-900 text-red-500' : 'border-red-200 text-red-300'}`}>
                            MBTI를 선택하여 상세 정보를 확인하세요.
                        </div>
                    )}
                </div>
            )}

            {/* LOGS TAB */}
            {activeTab === 'LOGS' && (
                <div className="space-y-8">
                    {logs.length === 0 ? (
                        <div className={`text-center italic opacity-60 ${textColor}`}>생성된 시뮬레이션 데이터가 없습니다.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.day} className={`border-b ${isDarkMode ? 'border-red-900/50' : 'border-red-200'} pb-6`}>
                                <h3 className={`text-lg font-bold mb-2 ${textColor}`}>{log.day}일차 기록</h3>
                                <div className={`text-sm mb-3 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.summary}</div>
                                
                                <div className="space-y-2 font-mono text-sm">
                                    {log.characterActions.map((act, i) => (
                                        <div key={`char-${i}`} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="font-bold text-xs">[{act.guestName}]</span> {act.action}
                                        </div>
                                    ))}
                                    {log.interactions.map((int, i) => (
                                        <div key={`int-${i}`} className={`${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                            <span className="font-bold text-xs">[상호작용: {int.participants.join(', ')}]</span> {int.scenario}
                                        </div>
                                    ))}
                                    {log.hotelEvents.map((evt, i) => (
                                        <div key={`evt-${i}`} className={`${isDarkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>
                                            <span className="font-bold text-xs">[사건]</span> {evt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t-2 ${borderColor} flex justify-end`}>
            <Button onClick={onClose} isDarkMode={isDarkMode}>닫기</Button>
        </div>
      </div>
    </div>
  );
};