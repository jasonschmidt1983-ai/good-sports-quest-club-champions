import React, { useState, useEffect } from 'react';
import { NPC, QuestionnaireItem, AnswerStatus } from '../types/game';
import { sounds } from '../utils/audio';
import {
  CheckCircle2,
  ListTodo,
  SkipForward,
  HelpCircle,
  AlertTriangle,
  FileText,
  BookOpen,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';

interface DialogueBoxProps {
  npc: NPC;
  questions: QuestionnaireItem[];
  answers: Record<string, AnswerStatus>;
  onAnswer: (questionId: string, status: AnswerStatus) => void;
  onClose: () => void;
  onLaunchTrainingModule?: (moduleId: string) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npc,
  questions,
  answers,
  onAnswer,
  onClose,
  onLaunchTrainingModule,
}) => {
  // Find current question index: first unanswered or not_yet or skipped, or index 0
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const firstUnanswered = questions.findIndex(
      (q) => !answers[q.id] || answers[q.id] === 'unanswered' || answers[q.id] === 'skipped'
    );
    return firstUnanswered !== -1 ? firstUnanswered : 0;
  });

  const [activeTab, setActiveTab] = useState<'question' | 'why' | 'how' | 'action_preview'>('question');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const currentQ = questions[activeIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;

  // Typewriter effect for NPC greeting / question prompt
  useEffect(() => {
    if (!currentQ) return;
    const fullText = currentQ.prompt;
    setDisplayedText('');
    setIsTyping(true);

    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx + 1));
        if (charIdx % 3 === 0) {
          sounds.playDialogueChirp();
        }
        charIdx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentQ]);

  // Complete typewriter immediately on click
  const handleFastForward = () => {
    if (isTyping && currentQ) {
      setDisplayedText(currentQ.prompt);
      setIsTyping(false);
    }
  };

  const handleSelectAnswer = (status: AnswerStatus) => {
    if (!currentQ) return;

    if (status === 'yes') {
      sounds.playSuccessSound();
    } else if (status === 'not_yet') {
      sounds.playActionPlanSound();
    } else {
      sounds.playSelectSound();
    }

    onAnswer(currentQ.id, status);

    // If there are more questions for this NPC, move to the next one
    if (activeIdx < questions.length - 1) {
      setTimeout(() => {
        setActiveIdx((prev) => prev + 1);
        setActiveTab('question');
      }, 350);
    }
  };

  if (!currentQ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 text-center text-white shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-bold mb-2">{npc.name} is all set!</h3>
          <p className="text-sm text-slate-300 mb-6">
            All questions for the {npc.role} station in {npc.locationName} have been reviewed!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Return to Club Grounds
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (q) => answers[q.id] === 'yes' || answers[q.id] === 'not_yet'
  ).length;

  return (
    <div
      onClick={handleFastForward}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top RPG Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* NPC Avatar Badge */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0"
              style={{ backgroundColor: npc.spriteColor }}
            >
              {npc.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-wide">{npc.name}</span>
                <span className="text-xs text-slate-400">· {npc.role}</span>
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                📍 {npc.locationName} · {npc.group}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Question progress */}
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">
                Question {activeIdx + 1}/{questions.length}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playSelectSound();
                      setActiveIdx(i);
                      setActiveTab('question');
                    }}
                    className={`w-3.5 h-1.5 rounded-sm transition-all ${
                      i === activeIdx
                        ? 'bg-amber-400 scale-110'
                        : answers[q.id] === 'yes'
                        ? 'bg-emerald-500'
                        : answers[q.id] === 'not_yet'
                        ? 'bg-amber-500'
                        : 'bg-slate-700'
                    }`}
                    title={`Question ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NPC Greeting Callout */}
        <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700/60 text-xs text-slate-300 italic flex items-center gap-2">
          <span className="text-amber-400 not-italic font-bold">“</span>
          <span>{npc.greeting}</span>
          <span className="text-amber-400 not-italic font-bold">”</span>
        </div>

        {/* Main Dialogue Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Question Status Tag & Minimum Criteria Alert */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {currentQ.isMinimumCriteria ? (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-600/60 px-2.5 py-1 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MINIMUM CRITERIA (Required for Silver)
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                  Good Sports Harm Reduction Standard
                </span>
              )}

              {currentAnswer && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    currentAnswer === 'yes'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                      : currentAnswer === 'not_yet'
                      ? 'bg-amber-950 text-amber-400 border border-amber-600'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Status: {currentAnswer === 'yes' ? 'Endorsed (Yes)' : currentAnswer === 'not_yet' ? 'In Action Plan' : 'Skipped'}
                </span>
              )}
            </div>

            {npc.unlockedModuleId && onLaunchTrainingModule && (
              <button
                onClick={() => onLaunchTrainingModule(npc.unlockedModuleId!)}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Station Training Module Available</span>
              </button>
            )}
          </div>

          {/* Question Text Box (Pokemon Typewriter Style) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[90px] relative">
            <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
            </h4>
          </div>

          {/* Sub-tabs: Guide Details (Why, How, Action Items, Policy Preview) */}
          <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                sounds.playSelectSound();
                setActiveTab('question');
              }}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'question'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Action Choices
            </button>
            <button
              onClick={() => {
                sounds.playSelectSound();
                setActiveTab('why');
              }}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1 transition-colors ${
                activeTab === 'why'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Why is this important?
            </button>
            <button
              onClick={() => {
                sounds.playSelectSound();
                setActiveTab('how');
              }}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1 transition-colors ${
                activeTab === 'how'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              What can our club do?
            </button>
            <button
              onClick={() => {
                sounds.playSelectSound();
                setActiveTab('action_preview');
              }}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1 transition-colors ${
                activeTab === 'action_preview'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Policy & Resources
            </button>
          </div>

          {/* Tab 1: Action Choices (Standard Game Mode) */}
          {activeTab === 'question' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Choose how your club currently manages this practice. You can adjust your answer anytime:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* YES Option */}
                <button
                  onClick={() => handleSelectAnswer('yes')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    currentAnswer === 'yes'
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">YES · Already Met</span>
                      <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">1</kbd>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Our club already meets this. Adds clause to our Good Sports Policy.
                    </p>
                  </div>
                </button>

                {/* NOT YET Option */}
                <button
                  onClick={() => handleSelectAnswer('not_yet')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    currentAnswer === 'not_yet'
                      ? 'bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-950/50'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-amber-500/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">NOT YET · Add to Action Plan</span>
                      <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">2</kbd>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Adds step-by-step tasks to our Action Plan to complete before Gold.
                    </p>
                  </div>
                </button>

                {/* SKIP FOR NOW */}
                <button
                  onClick={() => handleSelectAnswer('skipped')}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-left transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <SkipForward className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">SKIP FOR NOW</span>
                    <p className="text-xs text-slate-400 mt-1">
                      Move question to the end of your questionnaire to decide later.
                    </p>
                  </div>
                </button>

                {/* GET HELP */}
                <button
                  onClick={() => handleSelectAnswer('help_requested')}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-sky-800/50 bg-sky-950/30 hover:bg-sky-950/50 text-left transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">GET HELP / ADVICE</span>
                    <p className="text-xs text-sky-200 mt-1">
                      See Relationship Manager recommendations & support links.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Why is this important? */}
          {activeTab === 'why' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                ADF Harm-Reduction Evidence & Context
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {currentQ.why}
              </p>
            </div>
          )}

          {/* Tab 3: What can our club do? (How) */}
          {activeTab === 'how' && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Practical Implementation Guide
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentQ.how}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recommended Action Steps (if selecting Not Yet):
                </span>
                <ul className="mt-2 space-y-1.5">
                  {currentQ.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Policy & Resources */}
          {activeTab === 'action_preview' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Official Policy Commitment Statement (if Yes)
                </h5>
                <blockquote className="border-l-2 border-indigo-500 pl-3 py-1 text-xs text-indigo-200 italic">
                  "{currentQ.policyStatement}"
                </blockquote>
              </div>

              {currentQ.resources.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Connected Good Sports Toolkits & Posters:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentQ.resources.map((res, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-md"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Station: {npc.name}</span>
            <span>·</span>
            <span>{answeredCount} of {questions.length} answered</span>
          </div>

          <div className="flex items-center gap-2">
            {activeIdx > 0 && (
              <button
                onClick={() => {
                  sounds.playSelectSound();
                  setActiveIdx((prev) => prev - 1);
                  setActiveTab('question');
                }}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}

            {activeIdx < questions.length - 1 ? (
              <button
                onClick={() => {
                  sounds.playSelectSound();
                  setActiveIdx((prev) => prev + 1);
                  setActiveTab('question');
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-medium"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Done with {npc.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
