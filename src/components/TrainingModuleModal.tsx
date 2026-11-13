import React, { useState } from 'react';
import { TrainingModule } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HeartHandshake,
  Shield,
  HelpCircle,
  Bus
} from 'lucide-react';

interface TrainingModuleModalProps {
  modules: TrainingModule[];
  initialModuleId?: string | null;
  onEarnBadge: (moduleId: string) => void;
  onClose: () => void;
}

export const TrainingModuleModal: React.FC<TrainingModuleModalProps> = ({
  modules,
  initialModuleId,
  onEarnBadge,
  onClose,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    initialModuleId || modules[0]?.id || ''
  );

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  // Minigame states
  // 1. RSA Bar Check
  const [rsaStep, setRsaStep] = useState<number>(0);
  const [rsaScore, setRsaScore] = useState<number>(0);
  const [rsaCompleted, setRsaCompleted] = useState<boolean>(false);

  // 2. Junior Safe Zone
  const [juniorFound, setJuniorFound] = useState<string[]>([]);
  const [juniorCompleted, setJuniorCompleted] = useState<boolean>(false);

  // 3. Mental Health Conversation
  const [convoStep, setConvoStep] = useState<number>(0);
  const [convoCompleted, setConvoCompleted] = useState<boolean>(false);

  // 4. Incident Sequence Drill
  const [sequence, setSequence] = useState<number[]>([]);
  const [sequenceResult, setSequenceResult] = useState<'idle' | 'success' | 'fail'>('idle');

  // 5. Smoke-free Perimeter
  const [smokeSigns, setSmokeSigns] = useState<string[]>([]);
  const [smokeCompleted, setSmokeCompleted] = useState<boolean>(false);

  // 6. Safe Transport Planner
  const [transportChoices, setTransportChoices] = useState<{ food?: string; drink?: string; ride?: string }>({});
  const [transportCompleted, setTransportCompleted] = useState<boolean>(false);

  const handleTriggerBadge = (modId: string) => {
    sounds.playBadgeFanfare();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
    onEarnBadge(modId);
  };

  // --- RSA SCENARIOS ---
  const rsaScenarios = [
    {
      patron: "Bar Patron Tim (Age 20)",
      text: "“Hey mate, pour me a triple shot of tequila straight up! We just won the semi-final!”",
      options: [
        { text: "Pour the triple shot straight up", correct: false, note: "Double measures and shots are prohibited to prevent rapid binge intoxication." },
        { text: "Politely refuse shots: explain club policy is single serves only, and offer a mixer", correct: true, note: "Correct! Responsible service requires single standard measures and non-shot service." },
        { text: "Give him a discount voucher for shots", correct: false, note: "Discounted promotions and drink vouchers are against Good Sports guidelines." }
      ]
    },
    {
      patron: "Spectator Chloe (Age 19, looks young)",
      text: "“Hi, can I get two cans of mid-strength lager please?”",
      options: [
        { text: "Serve her right away without asking for ID", correct: false, note: "Under the 'Check 25' policy, anyone looking 25 or younger must be asked for proof of age." },
        { text: "Ask for acceptable photo ID (driver's licence / proof of age card) before service", correct: true, note: "Spot on! Verifying age protects both the minor and the club from serious licensing penalties." },
        { text: "Tell her minors can never buy low-alcohol drinks", correct: false, note: "She is over 18, so with valid photo ID she can legally purchase alcohol." }
      ]
    },
    {
      patron: "Player Ben (Slurring words, stumbling slightly)",
      text: "“C'mon mate, just one more pint for the road, I'm totally fine!”",
      options: [
        { text: "Pour him one last pint so he doesn't get upset", correct: false, note: "Serving an intoxicated person is an offense in all Australian states." },
        { text: "Refuse service calmly and respectfully, offer a glass of iced water, and help organize a taxi home", correct: true, note: "Perfect! Duty of care requires ceasing alcohol service, providing water, and ensuring safe transit." },
        { text: "Argue with him in front of everyone and shout at him", correct: false, note: "Always de-escalate calmly and refer to licensing obligations." }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Good Sports Training Academy & Badges
              </h3>
              <p className="text-xs text-slate-400">
                Practice real-world harm reduction scenarios and collect club honor badges!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split: Sidebar of modules & Main interactive canvas/quiz */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Module Selector Sidebar */}
          <div className="bg-slate-900/90 border-r border-slate-800 p-3 overflow-y-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Select Training Drill
            </span>
            {modules.map((m) => {
              const isSelected = m.id === selectedModuleId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    sounds.playSelectSound();
                    setSelectedModuleId(m.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400/80 shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      m.badgeEarned
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {m.badgeEarned ? '✓' : '★'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {m.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {m.badgeName} · {m.group}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Training Simulation Area */}
          <div className="md:col-span-2 p-5 sm:p-6 overflow-y-auto bg-slate-950 flex flex-col justify-between">
            {activeModule && (
              <div>
                {/* Module Banner */}
                <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {activeModule.group}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{activeModule.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {activeModule.description}
                    </p>
                  </div>

                  {/* Badge earned display */}
                  <div className="flex flex-col items-center shrink-0 p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        activeModule.badgeEarned
                          ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-amber-300'
                          : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}
                    >
                      🏅
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 text-center max-w-[80px] truncate">
                      {activeModule.badgeName}
                    </span>
                    <span className="text-[9px] text-emerald-400">
                      {activeModule.badgeEarned ? 'Earned' : 'Incomplete'}
                    </span>
                  </div>
                </div>

                {/* --- MODULE 1: RSA BAR SAFETY --- */}
                {activeModule.id === 'module_rsa_rapid_check' && (
                  <div className="space-y-4">
                    {!rsaCompleted ? (
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>Scenario {rsaStep + 1} of {rsaScenarios.length}</span>
                          <span>Score: {rsaScore}</span>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                            {rsaScenarios[rsaStep].patron}
                          </span>
                          <p className="text-sm font-semibold text-white mt-1 italic">
                            {rsaScenarios[rsaStep].text}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {rsaScenarios[rsaStep].options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (opt.correct) {
                                  sounds.playSuccessSound();
                                  setRsaScore((s) => s + 1);
                                } else {
                                  sounds.playActionPlanSound();
                                }
                                if (rsaStep < rsaScenarios.length - 1) {
                                  setRsaStep((s) => s + 1);
                                } else {
                                  setRsaCompleted(true);
                                  handleTriggerBadge(activeModule.id);
                                }
                              }}
                              className="w-full p-3 text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 rounded-xl text-xs text-slate-200 font-medium transition-all"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                          🛡️
                        </div>
                        <h5 className="text-base font-bold text-white">RSA Rapid-Check Mastered!</h5>
                        <p className="text-xs text-slate-300 max-w-md mx-auto">
                          You've mastered bar safety: refusing shots, checking ID under 25, providing free water, and refusing service to intoxicated patrons.
                        </p>
                        <button
                          onClick={() => {
                            setRsaStep(0);
                            setRsaScore(0);
                            setRsaCompleted(false);
                          }}
                          className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Replay Drill
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- MODULE 2: JUNIOR SAFE ZONE --- */}
                {activeModule.id === 'module_junior_haven' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      Tap and resolve the 3 junior sports safety violations occurring at the grounds:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'v1', label: 'Beer in U14 Locker Room', desc: 'Adults drinking in change room where minors change.' },
                        { id: 'v2', label: 'Brewery Logo on Junior Singlets', desc: 'Commercial alcohol sponsorship displayed on youth team gear.' },
                        { id: 'v3', label: 'Eskies on Junior Match Sidelines', desc: 'Alcohol consumed while junior match is underway.' },
                      ].map((item) => {
                        const isDone = juniorFound.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (!isDone) {
                                sounds.playSuccessSound();
                                const next = [...juniorFound, item.id];
                                setJuniorFound(next);
                                if (next.length === 3) {
                                  setJuniorCompleted(true);
                                  handleTriggerBadge(activeModule.id);
                                }
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isDone
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 hover:bg-slate-800 border-rose-500/60 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">{item.label}</span>
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                            </div>
                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                            <span className="text-[10px] mt-2 inline-block font-semibold text-amber-400">
                              {isDone ? 'Resolved (Alcohol-Free Policy Enforced)' : 'Click to Enforce Rule'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {juniorCompleted && (
                      <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-3 text-center text-xs text-emerald-300">
                        🎉 All 3 junior safety violations resolved! Junior sports are protected and alcohol-free!
                      </div>
                    )}
                  </div>
                )}

                {/* --- MODULE 3: MENTAL HEALTH 'R U OK?' --- */}
                {activeModule.id === 'module_mental_health_talk' && (
                  <div className="space-y-4">
                    {!convoCompleted ? (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                          <span className="text-xs font-bold text-cyan-400">Teammate Dave:</span>
                          <p className="text-xs text-slate-200 mt-1 italic">
                            {convoStep === 0 && "“Hey... yeah, I guess I have been a bit quiet lately. Just feeling overwhelmed with everything and struggling to sleep.”"}
                            {convoStep === 1 && "“Thanks for asking honestly. Most people just say 'she'll be right' and move on. It's tough carrying it alone.”"}
                            {convoStep === 2 && "“I haven't thought about talking to anyone professional before. Do you think Beyond Blue or our wellbeing officer can actually help?”"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {convoStep === 0 && (
                            <>
                              <button
                                onClick={() => {
                                  sounds.playSuccessSound();
                                  setConvoStep(1);
                                }}
                                className="w-full p-2.5 text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-xl text-xs text-slate-200"
                              >
                                “I'm really glad you shared that, Dave. We care about you beyond footy. Do you want to sit down and talk about what's going on?”
                              </button>
                              <button
                                onClick={() => sounds.playActionPlanSound()}
                                className="w-full p-2.5 text-left bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400"
                              >
                                “Ah don't worry about it mate, let's just go have a few beers at the bar.” (Avoid: alcohol harms mental wellbeing)
                              </button>
                            </>
                          )}

                          {convoStep === 1 && (
                            <>
                              <button
                                onClick={() => {
                                  sounds.playSuccessSound();
                                  setConvoStep(2);
                                }}
                                className="w-full p-2.5 text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-xl text-xs text-slate-200"
                              >
                                “You don't have to carry it alone. Our club is here for you, and there are free, confidential support services like Lifeline and Beyond Blue.”
                              </button>
                            </>
                          )}

                          {convoStep === 2 && (
                            <>
                              <button
                                onClick={() => {
                                  setConvoCompleted(true);
                                  handleTriggerBadge(activeModule.id);
                                }}
                                className="w-full p-2.5 text-left bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 rounded-xl text-xs text-emerald-200 font-semibold"
                              >
                                “Absolutely. Let's grab Dr. Jordan or I can help you call Beyond Blue (1300 22 4636). Let's catch up again at Tuesday training.”
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <HeartHandshake className="w-12 h-12 text-cyan-400 mx-auto" />
                        <h5 className="text-base font-bold text-white">Empathetic Leadership Demonstrated!</h5>
                        <p className="text-xs text-slate-300 max-w-md mx-auto">
                          You supported Dave using evidence-based 'R U OK?' principles: asking, listening without judgment, encouraging professional help, and following up.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* --- MODULE 4: INCIDENT SEQUENCE DRILL --- */}
                {activeModule.id === 'module_incident_drill' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      Arrange the 4 steps of the Good Sports Incident Response Protocol in the correct sequence (tap in order 1 to 4):
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: 1, text: "Step: Ensure immediate physical safety & provide first aid/medical care if needed" },
                        { id: 2, text: "Step: De-escalate peacefully, offer water, and arrange safe transportation home" },
                        { id: 3, text: "Step: Formally record all details in the club Incident Register within 24 hours" },
                        { id: 4, text: "Step: Debrief with Club Wellbeing Officer & Committee to review prevention" },
                      ].map((card) => {
                        const order = sequence.indexOf(card.id);
                        return (
                          <button
                            key={card.id}
                            onClick={() => {
                              if (!sequence.includes(card.id)) {
                                sounds.playSelectSound();
                                const next = [...sequence, card.id];
                                setSequence(next);
                                if (next.length === 4) {
                                  const isCorrect = next[0] === 1 && next[1] === 2 && next[2] === 3 && next[3] === 4;
                                  if (isCorrect) {
                                    setSequenceResult('success');
                                    handleTriggerBadge(activeModule.id);
                                  } else {
                                    setSequenceResult('fail');
                                  }
                                }
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              order !== -1
                                ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">
                                {order !== -1 ? `#${order + 1}` : 'Tap to select'}
                              </span>
                            </div>
                            <p className="text-xs">{card.text}</p>
                          </button>
                        );
                      })}
                    </div>

                    {sequenceResult === 'success' && (
                      <div className="bg-emerald-950 border border-emerald-500 p-3 rounded-xl text-center text-xs text-emerald-300">
                        🎉 Perfect incident response sequence! Badge unlocked!
                      </div>
                    )}
                    {sequenceResult === 'fail' && (
                      <div className="bg-rose-950 border border-rose-500 p-3 rounded-xl text-center text-xs text-rose-300 flex items-center justify-between">
                        <span>Not quite right sequence. Medical safety comes first!</span>
                        <button
                          onClick={() => {
                            setSequence([]);
                            setSequenceResult('idle');
                          }}
                          className="px-2 py-1 bg-rose-800 rounded text-[11px] font-bold"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- MODULE 5: SMOKE & VAPE FREE PERIMETER --- */}
                {activeModule.id === 'module_smoke_free_perimeter' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      Tap each mandatory club zone to deploy legally required Smoke-Free and Vape-Free signage:
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'gate', name: 'Main Club Foyer & Entrances' },
                        { id: 'grandstand', name: 'Spectator Seating & Grandstands' },
                        { id: 'play', name: 'Children\'s Playground & Junior Sidelines' },
                        { id: 'bar', name: 'Clubhouse Bar & Outdoor Dining' },
                      ].map((zone) => {
                        const placed = smokeSigns.includes(zone.id);
                        return (
                          <button
                            key={zone.id}
                            onClick={() => {
                              if (!placed) {
                                sounds.playSuccessSound();
                                const next = [...smokeSigns, zone.id];
                                setSmokeSigns(next);
                                if (next.length === 4) {
                                  setSmokeCompleted(true);
                                  handleTriggerBadge(activeModule.id);
                                }
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              placed
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-xs font-bold text-white block">{zone.name}</span>
                            <span className="text-[10px] text-amber-400 mt-1 inline-block">
                              {placed ? '🚭 Signage Deployed (Smoke & Vape Free)' : 'Tap to Erect Signage'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {smokeCompleted && (
                      <div className="bg-emerald-950 border border-emerald-500 p-3 rounded-xl text-center text-xs text-emerald-300">
                        🎉 Clean Air Crest earned! Facility is 100% compliant with smoke-free buffer laws!
                      </div>
                    )}
                  </div>
                )}

                {/* --- MODULE 6: SAFE CELEBRATIONS PLANNER --- */}
                {activeModule.id === 'module_safe_transport' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300">
                      Configure the Annual Presentation Gala for maximum inclusion and zero drink driving:
                    </p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-amber-400 block mb-1">1. Catering Menu:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setTransportChoices((p) => ({ ...p, food: 'buffet' }))}
                            className={`p-2 rounded-lg border text-xs text-left ${
                              transportChoices.food === 'buffet'
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Hot Roast Buffet & Substantial Platters (Recommended)
                          </button>
                          <button
                            onClick={() => setTransportChoices((p) => ({ ...p, food: 'chips' }))}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-left text-slate-500"
                          >
                            Potato Crisps & Peanuts Only (Insufficient)
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-amber-400 block mb-1">2. Beverage Options:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setTransportChoices((p) => ({ ...p, drink: 'inclusive' }))}
                            className={`p-2 rounded-lg border text-xs text-left ${
                              transportChoices.drink === 'inclusive'
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Free Iced Water Station + Cheaper Non-Alcoholic Drinks
                          </button>
                          <button
                            onClick={() => setTransportChoices((p) => ({ ...p, drink: 'openbar' }))}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-left text-slate-500"
                          >
                            All-You-Can-Drink Open Bar (Dangerous)
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-amber-400 block mb-1">3. Safe Transport:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setTransportChoices((p) => ({ ...p, ride: 'bus' }));
                              if (transportChoices.food === 'buffet' && transportChoices.drink === 'inclusive') {
                                setTransportCompleted(true);
                                handleTriggerBadge(activeModule.id);
                              }
                            }}
                            className={`p-2 rounded-lg border text-xs text-left ${
                              transportChoices.ride === 'bus'
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Chartered Club Bus + Designated Driver Rewards
                          </button>
                          <button
                            onClick={() => setTransportChoices((p) => ({ ...p, ride: 'none' }))}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-left text-slate-500"
                          >
                            Leave Members to Drive Themselves
                          </button>
                        </div>
                      </div>
                    </div>

                    {transportCompleted && (
                      <div className="bg-emerald-950 border border-emerald-500 p-3 rounded-xl text-center text-xs text-emerald-300">
                        🎉 Leadership Compass badge unlocked! Safe celebrations ensure everyone returns home safely!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
