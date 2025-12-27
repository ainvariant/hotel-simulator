import React from 'react';
import { Guest } from '../types';

interface GuestListProps {
  guests: Guest[];
  isDarkMode: boolean;
}

export const GuestList: React.FC<GuestListProps> = ({ guests, isDarkMode }) => {
  if (guests.length === 0) return null;

  const containerClass = isDarkMode 
    ? "border-red-800 bg-neutral-900 text-red-200" 
    : "border-red-900 bg-stone-50 text-red-900";

  return (
    <div className={`mt-4 p-5 border-4 border-double ${containerClass} shadow-md`}>
      <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wider border-b border-red-800 pb-2">고객 명단</h3>
      
      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {guests.map(guest => {
           const isDead = guest.status === 'DEAD';
           const isMissing = guest.status === 'MISSING';
           
           let cardClass = isDarkMode 
             ? "border-red-700 bg-neutral-950" 
             : "border-red-200 bg-white";
           
           let opacityClass = "";
           let statusOverlay = null;

           if (isDead) {
               cardClass = "border-gray-600 bg-gray-800 grayscale";
               opacityClass = "opacity-60";
               statusOverlay = (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                       <span className="text-5xl font-bold text-red-600 border-4 border-red-600 p-2 rounded transform -rotate-12 uppercase opacity-80">사망</span>
                   </div>
               );
           } else if (isMissing) {
               cardClass = "border-purple-900 bg-black";
               opacityClass = "opacity-40";
               statusOverlay = (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                       <span className="text-4xl font-bold text-purple-500 border-4 border-purple-500 p-2 rounded transform rotate-6 uppercase opacity-80">실종</span>
                   </div>
               );
           } else {
               cardClass += isDarkMode ? " hover:bg-neutral-900" : " hover:bg-red-50";
           }

           const badgeClass = isDarkMode
             ? "border-red-500 text-red-300 bg-red-900/30"
             : "border-red-800 text-red-800 bg-red-50";

           return (
            <div key={guest.id} className={`p-5 border-2 transition-colors shadow-sm relative overflow-hidden ${cardClass}`}>
                {statusOverlay}
                <div className={opacityClass}>
                    {/* Header: Name and Room */}
                    <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="font-bold text-2xl md:text-3xl block leading-tight font-title mb-1">{guest.name}</span>
                        <div className="text-sm md:text-base opacity-80 font-serif italic">
                        {guest.job} | {guest.gender}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-serif font-bold opacity-30">{guest.roomNumber}</div>
                    </div>
                    </div>
                    
                    {/* MBTI Badge */}
                    <div className={`text-sm md:text-base font-bold px-3 py-1 border inline-block mb-4 rounded-sm tracking-widest ${badgeClass}`}>
                    {guest.mbti}
                    </div>
                    
                    {/* Stats - Redesigned Circular or Blocky style */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider">♥ 체력</span>
                                <span className={`text-xs font-bold ${guest.health < 30 ? 'text-red-500' : ''}`}>{guest.health}</span>
                            </div>
                            <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${guest.health > 50 ? 'bg-red-600' : 'bg-red-800'}`}
                                    style={{ width: `${Math.max(0, Math.min(100, guest.health))}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider">♦ 정신력</span>
                                <span className={`text-xs font-bold ${guest.sanity < 30 ? 'text-purple-500' : ''}`}>{guest.sanity}</span>
                            </div>
                            <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${guest.sanity > 50 ? 'bg-blue-600' : 'bg-blue-800'}`}
                                    style={{ width: `${Math.max(0, Math.min(100, guest.sanity))}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};