import React, { useState, useEffect, useMemo } from 'react';
import {
  ClubProfile,
  QuestionnaireItem,
  AnswerStatus,
  NPC,
  TrainingModule,
} from './types/game';
import {
  GOOD_SPORTS_QUESTIONS,
  NPCS,
  TRAINING_MODULES,
  INITIAL_CLUB_PROFILE,
} from './data/goodSportsQuestions';
import { sounds } from './utils/audio';
import { ClubMapCanvas } from './components/ClubMapCanvas';
import { DialogueBox } from './components/DialogueBox';
import { TrainingModuleModal } from './components/TrainingModuleModal';
import { PolicyDocumentModal } from './components/PolicyDocumentModal';
import { ActionPlanView } from './components/ActionPlanView';
import { QuestionnaireTracker } from './components/QuestionnaireTracker';
import { StreamSetupModal } from './components/StreamSetupModal';
import {
  ShieldCheck,
  Award,
  ListTodo,
  Compass,
  FileCheck2,
  Settings,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function App() {
  // Navigation tabs
  type ActiveView = 'walk' | 'questions' | 'action_plan' | 'training' | 'policy';
  const [activeView, setActiveView] = useState<ActiveView>('walk');

  // Club Profile State
  const [clubProfile, setClubProfile] = useState<ClubProfile>(() => {
    try {
      const saved = localStorage.getItem('gs_club_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CLUB_PROFILE;
  });

  // Questionnaire Answers: Record<questionId, AnswerStatus>
  const [answers, setAnswers] = useState<Record<string, AnswerStatus>>(() => {
    try {
      const saved = localStorage.getItem('gs_answers');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default seed a couple for realistic feel
    return {
      comm_promote_gs: 'yes',
      gov_code_conduct: 'yes',
      alc_water_free: 'yes',
      smoke_no_sell_tobacco: 'yes',
      alc_no_shots: 'not_yet',
    };
  });

  // Completed Action Item IDs
  const [completedActionIds, setCompletedActionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gs_completed_actions');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Training Modules with earned badge status
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(() => {
    try {
      const saved = localStorage.getItem('gs_training_badges');
      if (saved) {
        const earnedIds: string[] = JSON.parse(saved);
        return TRAINING_MODULES.map((m) => ({
          ...m,
          badgeEarned: earnedIds.includes(m.id),
        }));
      }
    } catch {
      // ignore
    }
    return TRAINING_MODULES;
  });

  // Interactive Dialogue State
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);

  // Modals
  const [showTrainingModal, setShowTrainingModal] = useState<boolean>(false);
  const [targetTrainingModuleId, setTargetTrainingModuleId] = useState<string | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const [policyType, setPolicyType] = useState<'Silver' | 'Gold'>('Silver');
  const [showStreamModal, setShowStreamModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('gs_club_profile', JSON.stringify(clubProfile));
  }, [clubProfile]);

  useEffect(() => {
    localStorage.setItem('gs_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('gs_completed_actions', JSON.stringify(completedActionIds));
  }, [completedActionIds]);

  useEffect(() => {
    const earnedIds = trainingModules.filter((m) => m.badgeEarned).map((m) => m.id);
    localStorage.setItem('gs_training_badges', JSON.stringify(earnedIds));
  }, [trainingModules]);

  // Questions applicable to current club stream
  const streamQuestions = useMemo(() => {
    return GOOD_SPORTS_QUESTIONS.filter((q) => q.streams.includes(clubProfile.stream));
  }, [clubProfile.stream]);

  // Stream IDs
  const streamQuestionIds = useMemo(() => {
    return streamQuestions.map((q) => q.id);
  }, [streamQuestions]);

  // Minimum Criteria Questions for this stream
  const minCriteriaQuestions = useMemo(() => {
    return streamQuestions.filter((q) => q.isMinimumCriteria);
  }, [streamQuestions]);

  // Minimum criteria endorsed count
  const minCriteriaEndorsedCount = useMemo(() => {
    return minCriteriaQuestions.filter((q) => answers[q.id] === 'yes').length;
  }, [minCriteriaQuestions, answers]);

  const minCriteriaRemaining = minCriteriaQuestions.length - minCriteriaEndorsedCount;

  // Total stream questions endorsed
  const totalEndorsedCount = useMemo(() => {
    return streamQuestions.filter((q) => answers[q.id] === 'yes').length;
  }, [streamQuestions, answers]);

  const totalRemaining = streamQuestions.length - totalEndorsedCount;

  // Action plan items (marked 'not_yet' in this stream)
  const actionPlanItems = useMemo(() => {
    return streamQuestions.filter((q) => answers[q.id] === 'not_yet');
  }, [streamQuestions, answers]);

  // Completion calculation for each NPC station
  const npcCompletionMap = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    NPCS.forEach((npc) => {
      const npcQs = streamQuestions.filter((q) => q.npcId === npc.id);
      const done = npcQs.filter((q) => answers[q.id] === 'yes' || answers[q.id] === 'not_yet').length;
      map[npc.id] = { total: npcQs.length, completed: done };
    });
    return map;
  }, [streamQuestions, answers]);

  // Endorsed question items for policy document
  const endorsedPolicyQuestions = useMemo(() => {
    return streamQuestions.filter((q) => answers[q.id] === 'yes');
  }, [streamQuestions, answers]);

  // Handler for answering a question in dialogue or list
  const handleAnswerQuestion = (questionId: string, status: AnswerStatus) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: status,
    }));
  };

  // Handler for marking action item complete
  const handleCompleteActionItem = (questionId: string) => {
    if (completedActionIds.includes(questionId)) {
      setCompletedActionIds((prev) => prev.filter((id) => id !== questionId));
      // revert to not_yet
      handleAnswerQuestion(questionId, 'not_yet');
    } else {
      setCompletedActionIds((prev) => [...prev, questionId]);
      // Upgrade answer to 'yes'
      handleAnswerQuestion(questionId, 'yes');
    }
  };

  // Handler for earning training badge
  const handleEarnBadge = (moduleId: string) => {
    setTrainingModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, badgeEarned: true } : m))
    );
  };

  // Signing Silver / Gold policy
  const handleSignPolicy = (signeeName: string, signeeRole: string) => {
    const nowStr = new Date().toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setClubProfile((prev) => ({
      ...prev,
      signeeName,
      signeeRole,
      silverSignedAt: policyType === 'Silver' ? nowStr : prev.silverSignedAt || nowStr,
      goldSignedAt: policyType === 'Gold' ? nowStr : prev.goldSignedAt,
    }));
  };

  // Interact with NPC from canvas
  const handleInteractNPC = (npc: NPC) => {
    setActiveNPC(npc);
  };

  // Launch training module directly
  const handleLaunchTrainingModule = (modId: string) => {
    setTargetTrainingModuleId(modId);
    setShowTrainingModal(true);
  };

  // Number of badges earned
  const badgesEarnedCount = trainingModules.filter((m) => m.badgeEarned).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP BAR CONTRACT: Brand — 4-5 Nav Links — 1 Primary Action */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow">
            GS
          </div>
          <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
            Good Sports Quest
          </span>
        </div>

        {/* Zone 2: 4–5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => {
              sounds.playSelectSound();
              setActiveView('walk');
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'walk' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Club Grounds (Walk)</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelectSound();
              setActiveView('questions');
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'questions' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Questionnaire ({totalEndorsedCount}/{streamQuestions.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelectSound();
              setActiveView('action_plan');
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'action_plan' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Action Plan ({actionPlanItems.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelectSound();
              setActiveView('training');
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'training' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Training Badges ({badgesEarnedCount}/6)</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelectSound();
              setActiveView('policy');
            }}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'policy' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Good Sports Policy</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              sounds.playSelectSound();
              setShowStreamModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stream {clubProfile.stream}</span>
          </button>

          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg border border-slate-700/80 transition-colors"
            title="Toggle Background Music and Sound Effects"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. CLUB STATUS & ACCREDITATION STRIP */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Club Info */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">{clubProfile.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{clubProfile.sport}</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-semibold">{clubProfile.state}</span>
          </div>

          {/* Accreditation Progress Meters */}
          <div className="flex items-center gap-4">
            {/* Silver Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  clubProfile.silverSignedAt
                    ? 'bg-slate-200 text-slate-950 ring-2 ring-slate-300'
                    : minCriteriaRemaining === 0
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                S
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Silver Status</span>
                <span className="text-slate-200 font-mono text-[11px] font-bold">
                  {clubProfile.silverSignedAt
                    ? 'Signed ✓'
                    : minCriteriaRemaining === 0
                    ? 'Ready to Sign!'
                    : `${minCriteriaEndorsedCount}/${minCriteriaQuestions.length} Min Criteria`}
                </span>
              </div>
              {minCriteriaRemaining === 0 && !clubProfile.silverSignedAt && (
                <button
                  onClick={() => {
                    setPolicyType('Silver');
                    setShowPolicyModal(true);
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded shadow-sm"
                >
                  Sign
                </button>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Gold Status */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  clubProfile.goldSignedAt
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : totalRemaining === 0
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                G
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block leading-none">Gold Status</span>
                <span className="text-slate-200 font-mono text-[11px] font-bold">
                  {clubProfile.goldSignedAt
                    ? 'Signed 🏆'
                    : totalRemaining === 0
                    ? 'Ready to Sign!'
                    : `${totalEndorsedCount}/${streamQuestions.length} Total`}
                </span>
              </div>
              {totalRemaining === 0 && !clubProfile.goldSignedAt && (
                <button
                  onClick={() => {
                    setPolicyType('Gold');
                    setShowPolicyModal(true);
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded shadow-sm"
                >
                  Sign
                </button>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Badges count */}
            <button
              onClick={() => setActiveView('training')}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold">{badgesEarnedCount}/6</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">Badges</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden items-center justify-around bg-slate-900 border-b border-slate-800 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('walk')}
          className={`px-2 py-1 rounded ${activeView === 'walk' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Grounds
        </button>
        <button
          onClick={() => setActiveView('questions')}
          className={`px-2 py-1 rounded ${activeView === 'questions' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveView('action_plan')}
          className={`px-2 py-1 rounded ${activeView === 'action_plan' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Action Plan
        </button>
        <button
          onClick={() => setActiveView('training')}
          className={`px-2 py-1 rounded ${activeView === 'training' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Training
        </button>
        <button
          onClick={() => setActiveView('policy')}
          className={`px-2 py-1 rounded ${activeView === 'policy' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'}`}
        >
          Policy
        </button>
      </div>

      {/* 3. MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {/* VIEW 1: 2D POKEMON-STYLE CLUB GROUNDS (WALK MODE) */}
        {activeView === 'walk' && (
          <div className="space-y-4">
            <ClubMapCanvas
              onInteractNPC={handleInteractNPC}
              answeredQuestionIds={answers}
              activeStreamQuestions={streamQuestionIds}
              npcCompletionMap={npcCompletionMap}
              onOpenHub={() => setActiveView('questions')}
              onOpenTraining={() => {
                setShowTrainingModal(true);
              }}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(sounds.toggleMute())}
            />

            {/* Quick Teammate Station Directory */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Teammates & Officials Around the Grounds
                </h4>
                <span className="text-xs text-slate-400">
                  Approach in the world or tap to talk directly
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {NPCS.map((npc) => {
                  const comp = npcCompletionMap[npc.id] || { total: 0, completed: 0 };
                  const isDone = comp.total > 0 && comp.completed >= comp.total;
                  return (
                    <button
                      key={npc.id}
                      onClick={() => {
                        sounds.playSelectSound();
                        setActiveNPC(npc);
                      }}
                      className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all flex items-start gap-2.5"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: npc.spriteColor }}
                      >
                        {npc.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-white truncate">{npc.name}</p>
                          {isDone ? (
                            <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-mono font-bold">
                              {comp.completed}/{comp.total}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{npc.role}</p>
                        <p className="text-[9px] text-emerald-400 truncate mt-0.5">📍 {npc.locationName}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: QUESTIONNAIRE DIRECTORY */}
        {activeView === 'questions' && (
          <QuestionnaireTracker
            questions={streamQuestions}
            answers={answers}
            streamName={clubProfile.stream}
            onSelectQuestion={(q) => {
              const matchedNPC = NPCS.find((n) => n.id === q.npcId) || NPCS[0];
              setActiveNPC(matchedNPC);
            }}
          />
        )}

        {/* VIEW 3: ACTION PLAN BOARD */}
        {activeView === 'action_plan' && (
          <ActionPlanView
            actionPlanItems={actionPlanItems}
            completedActionIds={completedActionIds}
            onCompleteAction={handleCompleteActionItem}
            onJumpToQuestionnaire={() => setActiveView('questions')}
          />
        )}

        {/* VIEW 4: TRAINING ACADEMY BADGES */}
        {activeView === 'training' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Good Sports Academy
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Club Harm Reduction Training Drills
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Test your reflexes and leadership in real-world scenarios. Each completed drill awards a Gym-style Club Champion Badge!
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center shrink-0 min-w-[150px]">
                  <span className="text-xs text-slate-400 block">Badges Collected</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {badgesEarnedCount} / 6
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trainingModules.map((m) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    m.badgeEarned
                      ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md ${
                          m.badgeEarned
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                            : 'bg-slate-800 text-slate-600 border border-slate-700'
                        }`}
                      >
                        🏅
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          m.badgeEarned
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.badgeEarned ? 'Badge Earned ✓' : 'Drill Locked'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{m.title}</h4>
                    <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mt-0.5">
                      {m.badgeName} · {m.group}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sounds.playSelectSound();
                        setTargetTrainingModuleId(m.id);
                        setShowTrainingModal(true);
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm text-center"
                    >
                      {m.badgeEarned ? 'Replay Drill & Review' : 'Start Training Scenario'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: ACCREDITATION POLICY OVERVIEW */}
        {activeView === 'policy' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Good Sports Accreditation Hub
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Club Harm Prevention Policies & Certifications
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Progress from a Registered Club to Silver and Gold status by answering questions with teammates around the clubhouse.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playSelectSound();
                      setPolicyType('Silver');
                      setShowPolicyModal(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-900 bg-slate-200 hover:bg-white rounded-xl transition-colors"
                  >
                    View Silver Policy
                  </button>
                  <button
                    onClick={() => {
                      sounds.playSelectSound();
                      setPolicyType('Gold');
                      setShowPolicyModal(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
                  >
                    View Gold Policy
                  </button>
                </div>
              </div>
            </div>

            {/* Accreditation Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Silver Tier */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
                      AG
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        clubProfile.silverSignedAt
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                          : minCriteriaRemaining === 0
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {clubProfile.silverSignedAt ? 'Active & Signed' : minCriteriaRemaining === 0 ? 'Eligible to Sign' : 'In Progress'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">Silver Good Sports Club</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Endorse all <strong>{minCriteriaQuestions.length} Required Minimum Criteria</strong> in Stream {clubProfile.stream} to legally safeguard alcohol, smoking, vaping, and junior welfare.
                  </p>

                  <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Minimum Criteria Progress</span>
                      <span className="font-mono font-bold text-white">
                        {minCriteriaEndorsedCount} / {minCriteriaQuestions.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-slate-300 h-1.5 rounded-full transition-all"
                        style={{ width: `${(minCriteriaEndorsedCount / minCriteriaQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playSelectSound();
                      setPolicyType('Silver');
                      setShowPolicyModal(true);
                    }}
                    className="w-full py-2 text-xs font-bold text-slate-900 bg-slate-200 hover:bg-white rounded-xl transition-colors"
                  >
                    Open Silver Policy & Sign
                  </button>
                </div>
              </div>

              {/* Gold Tier */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
                      AU
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        clubProfile.goldSignedAt
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : totalRemaining === 0
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {clubProfile.goldSignedAt ? 'Active & Signed 🏆' : totalRemaining === 0 ? 'Eligible to Sign' : 'In Progress'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">Gold Good Sports Club</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Endorse all <strong>{streamQuestions.length} practices</strong> and fulfill all action items to establish best practice community leadership.
                  </p>

                  <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Total Questions Endorsed</span>
                      <span className="font-mono font-bold text-white">
                        {totalEndorsedCount} / {streamQuestions.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${(totalEndorsedCount / streamQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playSelectSound();
                      setPolicyType('Gold');
                      setShowPolicyModal(true);
                    }}
                    className="w-full py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors"
                  >
                    Open Gold Policy & Sign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. MODALS & OVERLAYS */}
      {/* Dialogue Modal with NPC */}
      {activeNPC && (
        <DialogueBox
          npc={activeNPC}
          questions={streamQuestions.filter((q) => q.npcId === activeNPC.id)}
          answers={answers}
          onAnswer={handleAnswerQuestion}
          onClose={() => setActiveNPC(null)}
          onLaunchTrainingModule={(modId) => {
            setActiveNPC(null);
            setTargetTrainingModuleId(modId);
            setShowTrainingModal(true);
          }}
        />
      )}

      {/* Training Module Modal */}
      {showTrainingModal && (
        <TrainingModuleModal
          modules={trainingModules}
          initialModuleId={targetTrainingModuleId}
          onEarnBadge={handleEarnBadge}
          onClose={() => {
            setShowTrainingModal(false);
            setTargetTrainingModuleId(null);
          }}
        />
      )}

      {/* Policy Document Modal */}
      {showPolicyModal && (
        <PolicyDocumentModal
          clubProfile={clubProfile}
          policyType={policyType}
          endorsedQuestions={endorsedPolicyQuestions}
          minCriteriaRemaining={minCriteriaRemaining}
          totalRemaining={totalRemaining}
          onSignPolicy={handleSignPolicy}
          onClose={() => setShowPolicyModal(false)}
        />
      )}

      {/* Stream Setup Modal */}
      {showStreamModal && (
        <StreamSetupModal
          currentProfile={clubProfile}
          onSaveProfile={(newProf) => setClubProfile(newProf)}
          onClose={() => setShowStreamModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-4 text-xs text-slate-500 text-center">
        <p>
          Good Sports Quest · Built to assist community sports clubs work through the official Alcohol and Drug Foundation (ADF) Good Sports Questionnaire Guide.
        </p>
      </footer>
    </div>
  );
}
