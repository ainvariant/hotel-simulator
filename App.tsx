import React, { useState } from 'react';
import { CharacterCreator } from './components/CharacterCreator';
import { GuestList } from './components/GuestList';
import { SimulationViewer } from './components/SimulationViewer';
import { SettingsModal } from './components/SettingsModal';
import { WikiModal } from './components/WikiModal';
import { EventModal } from './components/EventModal';
import { Guest, DailyLog, CharacterActionLog, InteractionLog, GameEvent, GameEventOutcome, GuestStatus } from './types';
import { generateDaySummary } from './services/geminiService';
import { MBTI_DATA, JOB_DATA, NORMAL_AMBIENT_EVENTS, ANOMALY_AMBIENT_EVENTS, INTERACTIVE_EVENTS } from './constants';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWiki, setShowWiki] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [day, setDay] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameState, setGameState] = useState<'PLAYING' | 'GAME_OVER' | 'VICTORY'>('PLAYING');
  
  // Event Logic
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [currentEventTargetIds, setCurrentEventTargetIds] = useState<string[]>([]);
  const [currentEventTargetName, setCurrentEventTargetName] = useState<string | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);

  // API Key selection logic
  const [apiKey] = useState(process.env.API_KEY || '');

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const handleAddGuest = (guest: Guest) => {
    setGuests([...guests, { ...guest, status: 'ALIVE' }]);
  };

  const handleRestart = () => {
      setGuests([]);
      setLogs([]);
      setDay(0);
      setGameState('PLAYING');
      setCurrentEvent(null);
  };

  const getRandomItem = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // --- Save / Load Logic ---
  const handleSaveGame = () => {
      const saveData = {
          day,
          guests,
          logs,
          gameState
      };
      localStorage.setItem('hotel_sim_save', JSON.stringify(saveData));
      alert('게임이 저장되었습니다.');
  };

  const handleLoadGame = () => {
      const saved = localStorage.getItem('hotel_sim_save');
      if (saved) {
          const data = JSON.parse(saved);
          setDay(data.day);
          setGuests(data.guests);
          setLogs(data.logs);
          setGameState(data.gameState);
          setShowSettings(false);
          alert('게임을 불러왔습니다.');
      } else {
          alert('저장된 게임이 없습니다.');
      }
  };

  const handleSaveRoster = () => {
      localStorage.setItem('hotel_sim_roster', JSON.stringify(guests));
      alert('고객 명단이 저장되었습니다.');
  };

  const handleLoadRoster = () => {
      const saved = localStorage.getItem('hotel_sim_roster');
      if (saved) {
          const loadedGuests = JSON.parse(saved);
          // Reset game state but keep guests
          setGuests(loadedGuests);
          setLogs([]);
          setDay(0);
          setGameState('PLAYING');
          setCurrentEvent(null);
          setShowSettings(false);
          alert('고객 명단을 불러오고 게임을 초기화했습니다.');
      } else {
          alert('저장된 명단이 없습니다.');
      }
  };

  const updateGuestStats = (targetIds: string[], healthChange: number, sanityChange: number) => {
    setGuests(prev => prev.map(g => {
        if (g.status !== 'ALIVE') return g;

        // Apply change only if targetIds matches or targetIds is empty (global update)
        const isTarget = targetIds.length === 0 || targetIds.includes(g.id);
        
        if (!isTarget) return g;

        let newHealth = Math.max(0, Math.min(100, g.health + healthChange));
        let newSanity = Math.max(0, Math.min(100, g.sanity + sanityChange));
        let newStatus: GuestStatus = g.status;

        // Death/Missing Check
        if (newHealth <= 0) newStatus = 'DEAD';
        else if (newSanity <= 0) newStatus = 'MISSING';

        return {
            ...g,
            health: newHealth,
            sanity: newSanity,
            status: newStatus
        };
    }));
  };

  // Called when "Next Day" button is clicked
  const handleTriggerNextDay = () => {
    const aliveGuests = guests.filter(g => g.status === 'ALIVE');
    if (aliveGuests.length === 0) {
        setGameState('GAME_OVER');
        return;
    }
    
    // Recovery Logic Removed

    const nextDay = day + 1;
    const isAnomalyPeriod = nextDay >= 5; // Day 5+ is Anomaly period

    // Logic: 
    // If Day 4, FORCE an event (Anomaly start).
    // Otherwise 50% chance.
    let shouldTriggerEvent = Math.random() < 0.5;
    
    // Force event on Day 4 (Transition to horror)
    if (nextDay === 4) {
        shouldTriggerEvent = true;
    }

    if (shouldTriggerEvent) {
        // Events are filtered by type. 
        // Note: We might want some Normal events even in late game, or purely Anomaly?
        // Prompt said "Day 5+ only anomaly reactions", implies world is anomaly.
        // Let's filter events based on period.
        // Day 4 is the transition, so we force an anomaly event or allow normal?
        // Let's say Day 4+ uses ANOMALY events pool primarily or exclusively.
        
        const eventTypeFilter = (nextDay >= 4) ? 'ANOMALY' : 'NORMAL';
        const possibleEvents = INTERACTIVE_EVENTS.filter(e => e.type === eventTypeFilter);
        
        const randomEvent = getRandomItem(possibleEvents);
        
        // Determine Targets
        let targetIds: string[] = [];
        let targetName = "";

        if (randomEvent.targetType === 'ALL') {
            targetIds = aliveGuests.map(g => g.id);
            targetName = "전원";
        } else if (randomEvent.targetType === 'RANDOM_SUBSET') {
            // Pick 2 to 5 random people (or all if less)
            const subsetSize = Math.min(aliveGuests.length, Math.floor(Math.random() * 4) + 2);
            const shuffled = [...aliveGuests].sort(() => 0.5 - Math.random());
            const subset = shuffled.slice(0, subsetSize);
            targetIds = subset.map(g => g.id);
            targetName = `${subset[0].name} 외 ${subset.length - 1}명`;
        } else {
            const randomGuest = getRandomItem<Guest>(aliveGuests);
            targetIds = [randomGuest.id];
            targetName = randomGuest.name;
        }

        setCurrentEvent(randomEvent);
        setCurrentEventTargetIds(targetIds);
        setCurrentEventTargetName(targetName);
        setIsEventOpen(true);
    } else {
        generateDayLog(null);
    }
  };

  // Called when Event Modal is finished
  const handleEventComplete = (outcome: GameEventOutcome) => {
    setIsEventOpen(false);
    
    // Apply Outcome to determined targets
    updateGuestStats(currentEventTargetIds, outcome.healthChange, outcome.sanityChange);

    // Check Victory
    if (outcome.isVictory) {
        setGameState('VICTORY');
        return;
    }
    
    generateDayLog(outcome.description);
  };

  const generateDayLog = async (eventOutcomeText: string | null) => {
    const aliveGuests = guests.filter(g => g.status === 'ALIVE');
    if (aliveGuests.length === 0 && !eventOutcomeText) {
         setGameState('GAME_OVER');
         return;
    }

    setIsGenerating(true);
    const nextDay = day + 1;
    // Strict separation: Day 1-4 = Normal. Day 5+ = Anomaly (Pure Horror).
    const isAnomalyPeriod = nextDay >= 5;

    try {
      // 1. Determine Character Actions
      const characterActions: CharacterActionLog[] = aliveGuests.map(guest => {
        let selectedBehavior = "";

        if (isAnomalyPeriod) {
            // Day 5+: Use Anomaly Behaviors (50% MBTI, 50% Job)
            if (Math.random() < 0.5) {
                selectedBehavior = getRandomItem(MBTI_DATA[guest.mbti].anomalyBehaviors);
            } else {
                selectedBehavior = getRandomItem(JOB_DATA[guest.job].anomalyBehaviors);
            }
        } else {
            // Day 1-4: Normal Behaviors
            if (Math.random() < 0.5) {
                selectedBehavior = getRandomItem(MBTI_DATA[guest.mbti].behaviors);
            } else {
                selectedBehavior = getRandomItem(JOB_DATA[guest.job].behaviors);
            }
        }
        
        return {
            guestName: guest.name,
            mbti: guest.mbti,
            job: guest.job,
            action: selectedBehavior
        };
      });

      // 2. Determine Interactions
      const rooms: Record<string, Guest[]> = {};
      aliveGuests.forEach(g => {
        if (!rooms[g.roomNumber]) rooms[g.roomNumber] = [];
        rooms[g.roomNumber].push(g);
      });

      const interactions: InteractionLog[] = [];
      Object.values(rooms).forEach(roomGuests => {
          if (roomGuests.length === 2) {
              const g1 = roomGuests[0];
              const g2 = roomGuests[1];
              
              let selectedInteraction = "";

              if (isAnomalyPeriod) {
                  // Day 5+: Anomaly Interactions (Social)
                  if (Math.random() < 0.5) {
                      selectedInteraction = getRandomItem(MBTI_DATA[g1.mbti].anomalyInteractions);
                  } else {
                      selectedInteraction = getRandomItem(JOB_DATA[g1.job].anomalyInteractions);
                  }
              } else {
                  // Day 1-4: Normal Interactions
                  if (Math.random() < 0.5) {
                      selectedInteraction = getRandomItem(MBTI_DATA[g1.mbti].interactions);
                  } else {
                      selectedInteraction = getRandomItem(JOB_DATA[g1.job].interactions);
                  }
              }

              interactions.push({
                  participants: [g1.name, g2.name],
                  scenario: selectedInteraction
              });
          }
      });

      // 3. Determine Ambient Events
      const numEvents = Math.floor(Math.random() * 2) + 2; 
      const eventPool = (nextDay >= 4) ? ANOMALY_AMBIENT_EVENTS : NORMAL_AMBIENT_EVENTS;
      const shuffledEvents = [...eventPool].sort(() => 0.5 - Math.random());
      const selectedEvents = shuffledEvents.slice(0, numEvents);

      // Add the outcome of the player's choice to the log context if it exists
      const eventContext = [...selectedEvents];
      if (eventOutcomeText) {
          eventContext.push(`[플레이어 이벤트 결과] (${currentEventTargetName}) ${eventOutcomeText}`);
      }

      // 4. Generate Summary via AI
      const daySummary = await generateDaySummary(apiKey, nextDay, characterActions, interactions, eventContext);

      const newLog: DailyLog = {
        day: nextDay,
        summary: daySummary,
        characterActions: characterActions,
        interactions: interactions,
        hotelEvents: selectedEvents
      };

      setLogs([...logs, newLog]);
      setDay(nextDay);
      
    } catch (error) {
      console.error("Failed to generate day", error);
      alert("시뮬레이션 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-neutral-900' : 'bg-stone-100'}`}>
      
      {/* Top Header Bar */}
      <header className={`w-full px-6 py-3 border-b-4 border-double flex justify-between items-center z-40 shadow-md shrink-0 ${
          isDarkMode ? 'bg-neutral-950 border-red-800' : 'bg-white border-red-900'
      }`}>
        <h1 className={`text-xl md:text-3xl font-bold tracking-widest font-title ${isDarkMode ? 'text-red-500' : 'text-red-900'}`}>
          Hotel Simulator
        </h1>
        
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setShowWiki(true)}
             className={`p-2 rounded-full border-2 transition-all ${
               isDarkMode 
                 ? 'bg-neutral-800 text-blue-300 border-blue-700 hover:bg-neutral-700' 
                 : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
             }`}
             title="백과사전"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </button>

          <button 
             onClick={() => setShowSettings(true)}
             className={`p-2 rounded-full border-2 transition-all ${
               isDarkMode 
                 ? 'bg-neutral-800 text-red-300 border-red-700 hover:bg-neutral-700' 
                 : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
             }`}
             title="설정"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button 
            onClick={toggleTheme} 
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-neutral-900 border-red-600 text-yellow-500 hover:text-yellow-400' 
                : 'bg-white border-red-900 text-neutral-800 hover:bg-stone-100'
            }`}
            title={isDarkMode ? "주간 모드" : "야간 모드"}
          >
            {isDarkMode ? '☀' : '☾'}
          </button>
        </div>
      </header>

      {/* Main Layout Container - Fixed Height */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel (Desktop) / Top Panel (Mobile): Simulation Viewer */}
        {/* Takes up 65% of height on mobile, full height on desktop minus header */}
        <div className="flex-1 h-[60%] md:h-full overflow-hidden p-2 md:p-4 order-1">
          <SimulationViewer 
            logs={logs} 
            isDarkMode={isDarkMode} 
            isDebugMode={false} 
            onNextDay={handleTriggerNextDay}
            isGenerating={isGenerating}
            hasGuests={guests.length > 0}
            gameState={gameState}
            onRestart={handleRestart}
          />
        </div>

        {/* Right Panel (Desktop) / Bottom Panel (Mobile): Management */}
        {/* Takes up 35% of height on mobile, fixed width on desktop */}
        <div className={`
            w-full md:w-1/3 lg:w-[350px] 
            h-[40%] md:h-full 
            flex flex-col gap-4 
            p-2 md:p-4 
            order-2 
            bg-opacity-90 
            overflow-y-auto 
            border-t-4 md:border-t-0 md:border-l-4 border-double
            ${isDarkMode ? 'bg-neutral-900 border-red-800' : 'bg-stone-100 border-red-900'}
        `}>
          
          {/* Collapse Creator on mobile if guests exist to show List more prominently, or keep both scrollable */}
          <div className="shrink-0">
             <CharacterCreator 
                onAddGuest={handleAddGuest} 
                currentGuests={guests} 
                isDarkMode={isDarkMode} 
             />
          </div>
          
          <div className="flex-1">
             <GuestList 
                guests={guests} 
                isDarkMode={isDarkMode} 
             />
          </div>
        </div>

      </div>

      {/* Modals */}
      <WikiModal 
        isOpen={showWiki} 
        onClose={() => setShowWiki(false)} 
        isDarkMode={isDarkMode} 
      />

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        logs={logs} 
        isDarkMode={isDarkMode} 
        onSaveGame={handleSaveGame}
        onLoadGame={handleLoadGame}
        onSaveRoster={handleSaveRoster}
        onLoadRoster={handleLoadRoster}
      />

      <EventModal
        isOpen={isEventOpen}
        event={currentEvent}
        targetName={currentEventTargetName}
        onComplete={handleEventComplete}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;