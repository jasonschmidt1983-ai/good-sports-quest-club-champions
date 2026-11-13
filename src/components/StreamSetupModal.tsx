import React, { useState } from 'react';
import { ClubProfile, ClubStream } from '../types/game';
import { sounds } from '../utils/audio';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface StreamSetupModalProps {
  currentProfile: ClubProfile;
  onSaveProfile: (profile: ClubProfile) => void;
  onClose: () => void;
}

export const StreamSetupModal: React.FC<StreamSetupModalProps> = ({
  currentProfile,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState<string>(currentProfile.name);
  const [sport, setSport] = useState<string>(currentProfile.sport);
  const [state, setState] = useState<string>(currentProfile.state);

  const [sellsAlcohol, setSellsAlcohol] = useState<boolean>(currentProfile.sellsAlcohol);
  const [isAlcoholFreeEvents, setIsAlcoholFreeEvents] = useState<boolean>(!currentProfile.consumesAlcohol);
  const [hasJuniors, setHasJuniors] = useState<boolean>(currentProfile.hasJuniors);

  // Compute calculated stream
  const calculateStream = (sells: boolean, alcFree: boolean, juniors: boolean): ClubStream => {
    const consumes = !alcFree;
    if (sells && juniors) return 'CSJ';
    if (sells && !juniors) return 'CSNJ';
    if (consumes && !sells && juniors) return 'CNSJ';
    if (consumes && !sells && !juniors) return 'CNSNJ';
    if (!consumes && !sells && juniors) return 'NCNSJ';
    return 'NCNSNJ';
  };

  const computedStream = calculateStream(sellsAlcohol, isAlcoholFreeEvents, hasJuniors);

  const streamDescriptions: Record<ClubStream, { title: string; count: number; min: number; desc: string }> = {
    CSJ: {
      title: 'Consume, Sell & Junior Competition (CSJ)',
      count: 52,
      min: 17,
      desc: 'Clubs that operate a licensed bar, consume alcohol during functions, and run junior teams/competitions. Full standard assessment.'
    },
    CSNJ: {
      title: 'Consume & Sell, No Juniors (CSNJ)',
      count: 49,
      min: 17,
      desc: 'Clubs that operate a licensed bar and consume alcohol, with senior teams only.'
    },
    CNSJ: {
      title: 'Consume (BYO / Unlicensed), No Sell, Juniors (CNSJ)',
      count: 40,
      min: 12,
      desc: 'Clubs that permit alcohol consumption (BYO or social), don\'t operate a commercial sales bar, and run junior teams.'
    },
    CNSNJ: {
      title: 'Consume, No Sell, No Juniors (CNSNJ)',
      count: 37,
      min: 12,
      desc: 'Clubs that permit alcohol consumption without selling alcohol, senior members only.'
    },
    NCNSJ: {
      title: '100% Alcohol-Free Club with Juniors (NCNSJ)',
      count: 27,
      min: 7,
      desc: 'Clubs that do not sell or consume alcohol anywhere at events, focusing on junior development, mental health and smoke-free sport.'
    },
    NCNSNJ: {
      title: '100% Alcohol-Free Senior Club (NCNSNJ)',
      count: 26,
      min: 7,
      desc: 'Clubs that do not sell or consume alcohol at any activities, with senior athletes only.'
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccessSound();
    onSaveProfile({
      ...currentProfile,
      name,
      sport,
      state,
      stream: computedStream,
      sellsAlcohol,
      consumesAlcohol: !isAlcoholFreeEvents,
      hasJuniors,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Club Stream & Settings</h3>
              <p className="text-xs text-slate-400">
                Official Good Sports 3-Question Stream Classification
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Club Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Club Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Club Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">State / Territory</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Victoria">Victoria (VIC)</option>
                  <option value="New South Wales">New South Wales (NSW)</option>
                  <option value="Queensland">Queensland (QLD)</option>
                  <option value="South Australia">South Australia (SA)</option>
                  <option value="Western Australia">Western Australia (WA)</option>
                  <option value="Tasmania">Tasmania (TAS)</option>
                  <option value="ACT">ACT</option>
                  <option value="Northern Territory">Northern Territory (NT)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Sport / Code</label>
              <input
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="e.g. Australian Rules Football, Cricket, Soccer, Netball..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* 3 Streaming Questions from Good Sports Guide */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Streaming Questions (Determines Criteria)
            </h4>

            {/* Q1 */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">1. Does your club sell alcohol?</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Made available for purchase through a licensed bar or permit.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSellsAlcohol(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      sellsAlcohol ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellsAlcohol(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      !sellsAlcohol ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Q2 */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">
                    2. Are training sessions, game days and events alcohol-free?
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No alcohol is consumed by members or visitors (BYO or licensed).
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAlcoholFreeEvents(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      isAlcoholFreeEvents ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Yes (Alcohol-Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAlcoholFreeEvents(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      !isAlcoholFreeEvents ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    No (Alcohol Consumed)
                  </button>
                </div>
              </div>
            </div>

            {/* Q3 */}
            <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">
                    3. Does your club have teams competing in junior competitions and/or juniors playing in senior teams?
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Includes junior players (under 18) in junior or senior squads.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHasJuniors(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      hasJuniors ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Yes (Has Juniors)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasJuniors(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                      !hasJuniors ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    No (Seniors Only)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resulting Stream Card */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Assigned Good Sports Stream
              </span>
              <span className="text-xs font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                Stream {computedStream}
              </span>
            </div>
            <h5 className="text-sm font-bold text-white">
              {streamDescriptions[computedStream].title}
            </h5>
            <p className="text-xs text-slate-300">
              {streamDescriptions[computedStream].desc}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold pt-1 text-emerald-300">
              <span>Total Questions: {streamDescriptions[computedStream].count}</span>
              <span>·</span>
              <span>Minimum Criteria for Silver: {streamDescriptions[computedStream].min}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-md"
            >
              Save Club Profile & Update Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
