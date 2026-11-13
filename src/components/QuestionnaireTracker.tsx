import React, { useState } from 'react';
import { QuestionnaireItem, AnswerStatus, QuestionGroup } from '../types/game';
import { sounds } from '../utils/audio';
import {
  Search,
  Filter,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuestionnaireTrackerProps {
  questions: QuestionnaireItem[];
  answers: Record<string, AnswerStatus>;
  onSelectQuestion: (question: QuestionnaireItem) => void;
  streamName: string;
}

export const QuestionnaireTracker: React.FC<QuestionnaireTrackerProps> = ({
  questions,
  answers,
  onSelectQuestion,
  streamName,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'min_only' | 'yes' | 'not_yet' | 'pending'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groups: QuestionGroup[] = [
    'Alcohol',
    'Community Leadership',
    'Governance',
    'Illicit Drugs',
    'Juniors',
    'Legal Compliance',
    'Mental Health',
    'Smoking and Vaping',
  ];

  const filtered = questions.filter((q) => {
    // Group filter
    if (selectedGroup !== 'All' && q.group !== selectedGroup) return false;

    // Filter Type
    const ans = answers[q.id];
    if (filterType === 'min_only' && !q.isMinimumCriteria) return false;
    if (filterType === 'yes' && ans !== 'yes') return false;
    if (filterType === 'not_yet' && ans !== 'not_yet') return false;
    if (filterType === 'pending' && (ans === 'yes' || ans === 'not_yet')) return false;

    // Search query
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        q.prompt.toLowerCase().includes(s) ||
        q.criteria.toLowerCase().includes(s) ||
        q.group.toLowerCase().includes(s) ||
        q.why.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalMin = questions.filter((q) => q.isMinimumCriteria).length;
  const completedMin = questions.filter((q) => q.isMinimumCriteria && answers[q.id] === 'yes').length;
  const totalYes = questions.filter((q) => answers[q.id] === 'yes').length;

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 block">Stream {streamName} Total</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{totalYes}</span>
            <span className="text-xs text-slate-400">/ {questions.length} Endorsed</span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(totalYes / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Minimum Criteria
            </span>
            <span className="text-[10px] text-slate-400">Required for Silver</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-400">{completedMin}</span>
            <span className="text-xs text-slate-400">/ {totalMin} Completed</span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(completedMin / Math.max(1, totalMin)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-amber-300 font-semibold block">Action Plan Tasks</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {questions.filter((q) => answers[q.id] === 'not_yet').length}
            </span>
            <span className="text-xs text-slate-400">marked 'Not Yet'</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Tasks scheduled for club committee follow-up.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search practices, keywords (e.g. RSA, water, vaping, food)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick status filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterType('min_only')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'min_only'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Min Criteria ({totalMin})
            </button>
            <button
              onClick={() => setFilterType('yes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'yes'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Endorsed ({totalYes})
            </button>
            <button
              onClick={() => setFilterType('not_yet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'not_yet'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Action Plan ({questions.filter((q) => answers[q.id] === 'not_yet').length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'pending'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Unanswered ({questions.filter((q) => !answers[q.id] || answers[q.id] === 'unanswered' || answers[q.id] === 'skipped').length})
            </button>
          </div>
        </div>

        {/* Group Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Group:</span>
          <button
            onClick={() => setSelectedGroup('All')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              selectedGroup === 'All'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Groups
          </button>
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => {
                sounds.playSelectSound();
                setSelectedGroup(grp);
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedGroup === grp
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Questionnaire List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-400">No questions match your filter.</p>
          </div>
        ) : (
          filtered.map((q) => {
            const ans = answers[q.id];
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        {q.group}
                      </span>
                      {q.isMinimumCriteria && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.2 rounded">
                          <AlertTriangle className="w-3 h-3" /> Minimum Criteria (Silver)
                        </span>
                      )}
                      {ans === 'yes' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Endorsed (Yes)
                        </span>
                      )}
                      {ans === 'not_yet' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <ListTodo className="w-3 h-3" /> In Action Plan
                        </span>
                      )}
                      {ans === 'skipped' && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          Skipped
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {q.prompt}
                    </h4>

                    <p className="text-xs text-slate-400">
                      <strong>Standard:</strong> {q.criteria}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectQuestion(q)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-emerald-600 rounded-lg transition-colors border border-slate-700"
                    >
                      Answer / Review
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="Expand details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-3 bg-slate-950/40 p-3 rounded-lg">
                    <div>
                      <span className="font-bold text-slate-300 block mb-0.5">Why is this important?</span>
                      <p className="text-slate-300 leading-relaxed">{q.why}</p>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">What can your club do?</span>
                      <p className="text-slate-300 leading-relaxed">{q.how}</p>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-400 block mb-0.5">Policy Commitment Statement:</span>
                      <p className="text-indigo-200 italic">"{q.policyStatement}"</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
