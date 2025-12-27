import React, { useState } from 'react';
import { MBTI, Job } from '../types';
import { Button } from './Button';
import { MBTI_DATA, MBTI_TYPES, JOB_DATA, INTERACTIVE_EVENTS } from '../constants';

interface WikiModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const WikiModal: React.FC<WikiModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'MBTI_WIKI' | 'JOB_WIKI' | 'EVENTS'>('MBTI_WIKI');
  const [selectedWikiMBTI, setSelectedWikiMBTI] = useState<MBTI | null>(null);
  const [selectedWikiJob, setSelectedWikiJob] = useState<Job | null>(null);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? "bg-neutral-900" : "bg-white";
  const textColor = isDarkMode ? "text-red-300" : "text-red-900";
  const borderColor = isDarkMode ? "border-red-700" : "border-red-900";
  const activeTabClass = isDarkMode ? "bg-red-900 text-white" : "bg-red-900 text-white";
  const inactiveTabClass = isDarkMode ? "bg-neutral-800 text-red-500" : "bg-red-100 text-red-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 font-serif">
      <div className={`w-full max-w-5xl h-[85vh] flex flex-col border-4 border-double ${borderColor} ${bgColor} shadow-2xl relative`}>
        
        {/* Header */}
        <div className={`p-4 border-b-2 ${borderColor} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold uppercase tracking-widest ${textColor}`}>호텔 백과사전</h2>
          <button onClick={onClose} className={`text-2xl font-bold ${textColor} hover:opacity-70`}>
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-red-900 text-xs md:text-sm overflow-x-auto shrink-0">
            <button 
                className={`flex-1 min-w-[100px] py-3 font-bold ${activeTab === 'MBTI_WIKI' ? activeTabClass : inactiveTabClass}`}
                onClick={() => { setActiveTab('MBTI_WIKI'); setSelectedWikiMBTI(null); }}
            >
                MBTI별 반응
            </button>
            <button 
                className={`flex-1 min-w-[100px] py-3 font-bold ${activeTab === 'JOB_WIKI' ? activeTabClass : inactiveTabClass}`}
                onClick={() => { setActiveTab('JOB_WIKI'); setSelectedWikiJob(null); }}
            >
                직업별 반응
            </button>
            <button 
                className={`flex-1 min-w-[100px] py-3 font-bold ${activeTab === 'EVENTS' ? activeTabClass : inactiveTabClass}`}
                onClick={() => setActiveTab('EVENTS')}
            >
                이벤트 목록
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* MBTI WIKI TAB */}
            {activeTab === 'MBTI_WIKI' && (
                <div className="flex flex-col h-full">
                    {!selectedWikiMBTI ? (
                         <>
                            <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                * 각 MBTI를 클릭하여 행동/상호작용 패턴을 확인하세요.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {MBTI_TYPES.map(mbti => (
                                    <button
                                        key={mbti}
                                        onClick={() => setSelectedWikiMBTI(mbti)}
                                        className={`px-3 py-1 border text-sm font-bold transition-all ${
                                            isDarkMode ? 'bg-neutral-800 text-red-400 border-red-800 hover:bg-neutral-700' : 'bg-white text-red-800 border-red-200 hover:bg-red-50'
                                        }`}
                                    >
                                        {mbti}
                                    </button>
                                ))}
                            </div>
                         </>
                    ) : (
                        <div className={`p-4 border ${isDarkMode ? 'border-red-800 bg-black/30' : 'border-red-100 bg-red-50/50'}`}>
                             <div className="flex justify-between items-center mb-4 border-b pb-2">
                                 <h3 className={`text-2xl font-bold ${textColor}`}>
                                     {selectedWikiMBTI}
                                 </h3>
                                 <Button onClick={() => setSelectedWikiMBTI(null)} isDarkMode={isDarkMode} className="text-xs py-1">
                                     목록으로
                                 </Button>
                             </div>
                             
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>일반 행동</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].behaviors.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>일반 상호작용</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].interactions.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>이상현상 행동</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].anomalyBehaviors.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>이상현상 상호작용</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {MBTI_DATA[selectedWikiMBTI].anomalyInteractions.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* JOB WIKI TAB */}
            {activeTab === 'JOB_WIKI' && (
                <div className="flex flex-col h-full">
                    {!selectedWikiJob ? (
                        <>
                            <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                * 각 직업을 클릭하여 행동/상호작용 패턴을 확인하세요.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {(Object.keys(JOB_DATA) as Job[]).map(job => (
                                    <button
                                        key={job}
                                        onClick={() => setSelectedWikiJob(job)}
                                        className={`px-3 py-1 border text-sm font-bold transition-all ${
                                            isDarkMode ? 'bg-neutral-800 text-blue-400 border-blue-800 hover:bg-neutral-700' : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
                                        }`}
                                    >
                                        {job}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={`p-4 border ${isDarkMode ? 'border-blue-900 bg-black/30' : 'border-blue-100 bg-blue-50/50'}`}>
                             <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                                    {selectedWikiJob}
                                </h3>
                                <Button onClick={() => setSelectedWikiJob(null)} isDarkMode={isDarkMode} className="text-xs py-1">
                                    목록으로
                                </Button>
                             </div>
                             
                             <div className="grid md:grid-cols-2 gap-6">
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>직업 행동 (일반)</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {JOB_DATA[selectedWikiJob].behaviors.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>직업 상호작용 (일반)</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {JOB_DATA[selectedWikiJob].interactions.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                                 <div>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>직업 행동 (이상현상)</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {JOB_DATA[selectedWikiJob].anomalyBehaviors.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                     <h4 className={`font-bold mb-2 uppercase text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>직업 상호작용 (이상현상)</h4>
                                     <ul className={`list-disc pl-5 space-y-1 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                         {JOB_DATA[selectedWikiJob].anomalyInteractions.map((text, idx) => (
                                             <li key={idx}>{text}</li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'EVENTS' && (
              <div className="space-y-6">
                  <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    * 게임 중 랜덤하게 발생하는 이벤트 목록입니다. 선택에 따라 체력과 정신력이 변동될 수 있습니다.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {INTERACTIVE_EVENTS.map(event => (
                      <div key={event.id} className={`p-4 border-2 ${event.type === 'ANOMALY' ? 'border-purple-800 bg-purple-900/10' : (isDarkMode ? 'border-gray-700' : 'border-gray-300')}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-lg ${textColor}`}>{event.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded border ${event.type === 'ANOMALY' ? 'border-purple-500 text-purple-500' : 'border-green-500 text-green-500'}`}>
                            {event.type === 'ANOMALY' ? '이상현상' : '일반'}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>"{event.description}"</p>
                        <p className={`text-xs mb-3 font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>대상: {event.targetType === 'ALL' ? '전체' : (event.targetType === 'RANDOM_SUBSET' ? '무작위 다수' : '랜덤 1인')}</p>
                        
                        <div className="text-sm space-y-2">
                           <p className="font-bold text-xs uppercase opacity-70">선택지:</p>
                           {event.options.map((opt, i) => (
                             <div key={i} className={`pl-2 border-l-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                               <div className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>{opt.label}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
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