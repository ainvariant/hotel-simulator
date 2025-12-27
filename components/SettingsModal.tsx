import React, { useState } from 'react';
import { DailyLog, Guest } from '../types';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: DailyLog[];
  isDarkMode: boolean;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onSaveRoster: () => void;
  onLoadRoster: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    logs, 
    isDarkMode, 
    onSaveGame,
    onLoadGame,
    onSaveRoster,
    onLoadRoster
}) => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'LOGS'>('SYSTEM');

  if (!isOpen) return null;

  const bgColor = isDarkMode ? "bg-neutral-900" : "bg-white";
  const textColor = isDarkMode ? "text-red-300" : "text-red-900";
  const borderColor = isDarkMode ? "border-red-700" : "border-red-900";
  const activeTabClass = isDarkMode ? "bg-red-900 text-white" : "bg-red-900 text-white";
  const inactiveTabClass = isDarkMode ? "bg-neutral-800 text-red-500" : "bg-red-100 text-red-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 font-serif">
      <div className={`w-full max-w-2xl h-[85vh] flex flex-col border-4 border-double ${borderColor} ${bgColor} shadow-2xl relative`}>
        
        {/* Header */}
        <div className={`p-4 border-b-2 ${borderColor} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold uppercase tracking-widest ${textColor}`}>설정</h2>
          <button onClick={onClose} className={`text-2xl font-bold ${textColor} hover:opacity-70`}>
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-red-900 text-sm overflow-x-auto shrink-0">
            <button 
                className={`flex-1 py-3 font-bold ${activeTab === 'SYSTEM' ? activeTabClass : inactiveTabClass}`}
                onClick={() => setActiveTab('SYSTEM')}
            >
                저장 / 불러오기
            </button>
            <button 
                className={`flex-1 py-3 font-bold ${activeTab === 'LOGS' ? activeTabClass : inactiveTabClass}`}
                onClick={() => setActiveTab('LOGS')}
            >
                전체 로그
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* SYSTEM TAB */}
            {activeTab === 'SYSTEM' && (
                <div className="space-y-8">
                    <div className={`p-6 border-2 ${isDarkMode ? 'border-red-800 bg-neutral-900/50' : 'border-red-200 bg-red-50'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${textColor} border-b pb-2 ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
                            현재 상황 저장/불러오기
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            현재 진행 중인 날짜, 생존자 상태, 로그를 모두 저장합니다. 불러오기 시 저장된 시점부터 이어서 진행합니다.
                        </p>
                        <div className="flex gap-4">
                            <Button onClick={onSaveGame} isDarkMode={isDarkMode} className="flex-1">
                                게임 저장
                            </Button>
                            <Button onClick={onLoadGame} isDarkMode={isDarkMode} className="flex-1">
                                게임 불러오기
                            </Button>
                        </div>
                    </div>

                    <div className={`p-6 border-2 ${isDarkMode ? 'border-blue-900 bg-neutral-900/50' : 'border-blue-200 bg-blue-50'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} border-b pb-2 ${isDarkMode ? 'border-blue-900' : 'border-blue-200'}`}>
                            고객 명단 저장/불러오기
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            현재 생성된 고객 리스트만 저장합니다. 불러오기 시 1일차부터 다시 시작합니다. (새 게임)
                        </p>
                        <div className="flex gap-4">
                            <Button onClick={onSaveRoster} isDarkMode={isDarkMode} variant="secondary" className="flex-1 !border-blue-500 !text-blue-500 hover:!bg-blue-900/20">
                                명단 저장
                            </Button>
                            <Button onClick={onLoadRoster} isDarkMode={isDarkMode} variant="secondary" className="flex-1 !border-blue-500 !text-blue-500 hover:!bg-blue-900/20">
                                명단 불러오기 (새 게임)
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* LOGS TAB */}
            {activeTab === 'LOGS' && (
                <div className="space-y-8">
                    {logs.length === 0 ? (
                        <div className={`text-center italic opacity-60 ${textColor}`}>생성된 기록이 없습니다.</div>
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