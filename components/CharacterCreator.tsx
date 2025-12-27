import React, { useState } from 'react';
import { GENDERS, MBTI_TYPES, AVAILABLE_ROOMS, JOB_CATEGORIES } from '../constants';
import { Guest, Gender, MBTI, Job, JobCategory } from '../types';
import { Button } from './Button';

interface CharacterCreatorProps {
  onAddGuest: (guest: Guest) => void;
  currentGuests: Guest[];
  isDarkMode: boolean;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onAddGuest, currentGuests, isDarkMode }) => {
  const [name, setName] = useState('');
  const [job, setJob] = useState<Job>('대학생');
  const [gender, setGender] = useState<Gender>('남성');
  const [roomNumber, setRoomNumber] = useState(AVAILABLE_ROOMS[0]);
  const [mbti, setMbti] = useState<MBTI>('ISTJ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Validation: Max 2 people per room
    const peopleInRoom = currentGuests.filter(g => g.roomNumber === roomNumber).length;
    if (peopleInRoom >= 2) {
      alert(`${roomNumber}호는 이미 꽉 찼습니다!`);
      return;
    }

    const newGuest: Guest = {
      id: crypto.randomUUID(),
      name,
      job,
      gender,
      roomNumber,
      mbti,
      health: 100,
      sanity: 100,
      status: 'ALIVE'
    };

    onAddGuest(newGuest);
    setName('');
  };

  const containerBorder = isDarkMode ? "border-red-800" : "border-red-900";
  const containerBg = isDarkMode ? "bg-black" : "bg-white";
  const titleColor = isDarkMode ? "text-red-400 border-red-800" : "text-red-900 border-red-200";
  const labelColor = isDarkMode ? "text-red-300" : "text-red-900";
  
  const inputClass = `w-full p-2 border-b-2 bg-transparent focus:outline-none transition-colors ${
    isDarkMode 
      ? "border-red-800 text-red-100 placeholder-red-700 focus:border-red-500" 
      : "border-red-900 text-black placeholder-red-300 focus:border-red-600"
  }`;
  
  const optionClass = isDarkMode ? "bg-neutral-800 text-white" : "bg-white text-black";

  return (
    <div className={`p-6 border-4 border-double ${containerBorder} ${containerBg} shadow-md`}>
      <h2 className={`text-2xl font-bold mb-6 border-b pb-2 ${titleColor}`}>
        캐릭터 생성
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-xs uppercase tracking-widest mb-1 ${labelColor}`}>이름</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="이름 입력"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs uppercase tracking-widest mb-1 ${labelColor}`}>직업</label>
            <select value={job} onChange={(e) => setJob(e.target.value as Job)} className={inputClass}>
               {Object.entries(JOB_CATEGORIES).map(([category, jobs]) => (
                   <optgroup key={category} label={category} className={optionClass}>
                       {jobs.map(j => <option key={j} value={j} className={optionClass}>{j}</option>)}
                   </optgroup>
               ))}
            </select>
          </div>
          <div>
            <label className={`block text-xs uppercase tracking-widest mb-1 ${labelColor}`}>성별</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className={inputClass}>
              {GENDERS.map(g => <option key={g} value={g} className={optionClass}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs uppercase tracking-widest mb-1 ${labelColor}`}>호실</label>
            <select value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className={inputClass}>
              {AVAILABLE_ROOMS.map(r => {
                 const count = currentGuests.filter(g => g.roomNumber === r).length;
                 return (
                   <option key={r} value={r} disabled={count >= 2} className={optionClass}>
                     {r}호 ({count}/2)
                   </option>
                 );
              })}
            </select>
          </div>
          <div>
            <label className={`block text-xs uppercase tracking-widest mb-1 ${labelColor}`}>MBTI</label>
            <select value={mbti} onChange={(e) => setMbti(e.target.value as MBTI)} className={inputClass}>
              {MBTI_TYPES.map(m => <option key={m} value={m} className={optionClass}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" isDarkMode={isDarkMode}>생성하기</Button>
        </div>
      </form>
    </div>
  );
};