import React, { useState } from 'react';
import { QuestionnaireItem } from '../types/game';
import { sounds } from '../utils/audio';
import { CheckSquare, Square, ListTodo, AlertTriangle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ActionPlanViewProps {
  actionPlanItems: QuestionnaireItem[];
  completedActionIds: string[];
  onCompleteAction: (questionId: string) => void;
  onJumpToQuestionnaire?: () => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  actionPlanItems,
  completedActionIds,
  onCompleteAction,
  onJumpToQuestionnaire,
}) => {
  const [filterGroup, setFilterGroup] = useState<string>('All');

  const groups = ['All', ...Array.from(new Set(actionPlanItems.map((i) => i.group)))];

  const filteredItems = filterGroup === 'All'
    ? actionPlanItems
    : actionPlanItems.filter((i) => i.group === filterGroup);

  const completedCount = actionPlanItems.filter((i) => completedActionIds.includes(i.id)).length;
  const progressPercent = actionPlanItems.length > 0
    ? Math.round((completedCount / actionPlanItems.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <ListTodo className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">Club Action Plan</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Whenever you select <strong>‘Not Yet’</strong> during conversations with teammates, action items are automatically routed here. Completing your action plan prepares your club for <strong>Gold Accreditation</strong>!
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-right shrink-0 min-w-[160px]">
            <span className="text-xs text-slate-400 block">Action Progress</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {completedCount} / {actionPlanItems.length}
            </span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Group Filter Tabs */}
        {groups.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-700/60">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => {
                  sounds.playSelectSound();
                  setFilterGroup(grp);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterGroup === grp
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No Action Items Pending</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            All your current questionnaire answers are endorsed as 'Yes'. If you marked 'Not Yet' on any practice, actionable steps will display here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isCompleted = completedActionIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/40 border-emerald-900/50 text-slate-400'
                    : 'bg-slate-900 border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        sounds.playSuccessSound();
                        onCompleteAction(item.id);
                      }}
                      className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Action Complete'}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          {item.group}
                        </span>
                        {item.isMinimumCriteria && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.2 rounded">
                            <AlertTriangle className="w-3 h-3" /> Minimum Criteria
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded">
                            Completed & Endorsed
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold text-white ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.criteria}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 italic">
                        "{item.prompt}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playSuccessSound();
                      onCompleteAction(item.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                      isCompleted
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isCompleted ? 'Reopen' : 'Mark Done'}
                  </button>
                </div>

                {/* Step-by-step instructions */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Step-by-step Action Checklist:
                  </span>
                  <ul className="space-y-1.5">
                    {item.actionItems.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Helpful resources */}
                {item.resources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Resources:</span>
                    {item.resources.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
