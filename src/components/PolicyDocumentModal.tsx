import React, { useState } from 'react';
import { ClubProfile, QuestionnaireItem } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle2, ShieldCheck, Printer, FileText, PenTool } from 'lucide-react';

interface PolicyDocumentModalProps {
  clubProfile: ClubProfile;
  policyType: 'Silver' | 'Gold';
  endorsedQuestions: QuestionnaireItem[];
  minCriteriaRemaining: number;
  totalRemaining: number;
  onSignPolicy: (signeeName: string, signeeRole: string) => void;
  onClose: () => void;
}

export const PolicyDocumentModal: React.FC<PolicyDocumentModalProps> = ({
  clubProfile,
  policyType,
  endorsedQuestions,
  minCriteriaRemaining,
  totalRemaining,
  onSignPolicy,
  onClose,
}) => {
  const [signeeName, setSigneeName] = useState<string>(clubProfile.signeeName || 'Pat Johnson');
  const [signeeRole, setSigneeRole] = useState<string>(clubProfile.signeeRole || 'Club President');
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const isSilverEligible = minCriteriaRemaining === 0;
  const isGoldEligible = totalRemaining === 0;
  const isEligible = policyType === 'Silver' ? isSilverEligible : isGoldEligible;

  const isAlreadySigned =
    policyType === 'Silver' ? Boolean(clubProfile.silverSignedAt) : Boolean(clubProfile.goldSignedAt);

  const handleConfirmSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signeeName.trim() || !signeeRole.trim()) return;

    sounds.playTriumphFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    onSignPolicy(signeeName, signeeRole);
    setIsSigning(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold ${
                policyType === 'Gold' ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Official {policyType} Good Sports Policy Document
              </h3>
              <p className="text-xs text-slate-300">
                {clubProfile.name} · Stream {clubProfile.stream}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate / Document Scroll Area */}
        <div className="p-6 overflow-y-auto bg-slate-100 text-slate-900 font-sans print:p-0">
          {/* Formal Good Sports Header */}
          <div className="border-4 border-double border-slate-400 p-6 sm:p-8 bg-white shadow-md rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold text-2xl shadow">
                  GS
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    GOOD SPORTS {policyType.toUpperCase()} POLICY
                  </h1>
                  <p className="text-xs text-slate-600">
                    Alcohol & Drug Foundation · Community Harm Reduction Framework
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Club Classification
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  Stream {clubProfile.stream} · {clubProfile.sport}
                </span>
              </div>
            </div>

            {/* Club Declaration Preamble */}
            <div className="mb-6 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                This Good Sports Policy is formally endorsed by <strong>{clubProfile.name}</strong> to create a healthy, family-friendly, and safe sporting environment for all players, coaches, officials, families, and spectators.
              </p>
              <p>
                Our committee and members commit to adhering to the following evidence-based commitments and legal regulations:
              </p>
            </div>

            {/* Grouped Endorsed Policy Clauses */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
                Endorsed Harm-Prevention Commitments ({endorsedQuestions.length} Clauses)
              </h4>

              {endorsedQuestions.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No policy commitments endorsed yet. Complete questions with teammates around the clubhouse to add clauses!
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {endorsedQuestions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-2.5 text-xs text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 mr-1.5">[{q.group}]</span>
                        <span>{q.policyStatement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Signature Block */}
            <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs text-slate-500 block">Status:</span>
                {isAlreadySigned ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Officially Signed & Active</span>
                  </div>
                ) : isEligible ? (
                  <span className="text-xs font-bold text-amber-600">
                    Eligible for Signing
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600">
                    Requires {policyType === 'Silver' ? `${minCriteriaRemaining} Minimum Criteria` : `${totalRemaining} remaining criteria`}
                  </span>
                )}
              </div>

              <div className="border-2 border-slate-300 rounded-lg p-3 w-full sm:w-72 bg-slate-50 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                  Digital Club Authorization
                </span>
                <p className="font-mono font-bold text-base text-slate-900 italic">
                  {clubProfile.signeeName || signeeName}
                </p>
                <p className="text-xs text-slate-600">
                  {clubProfile.signeeRole || signeeRole}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {clubProfile.silverSignedAt || clubProfile.goldSignedAt || 'Draft (Pending Signature)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="px-5 py-4 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            {isAlreadySigned ? (
              <span className="text-emerald-400 font-medium">
                ✓ This {policyType} policy is registered and binding for this season.
              </span>
            ) : isEligible ? (
              <span className="text-amber-300 font-medium">
                All criteria met! Club committee can sign now.
              </span>
            ) : (
              <span className="text-slate-400">
                Continue interacting with teammates on the map to fulfill remaining criteria.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAlreadySigned && isEligible && !isSigning && (
              <button
                onClick={() => setIsSigning(true)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md"
              >
                <PenTool className="w-4 h-4" />
                <span>Sign {policyType} Policy Now</span>
              </button>
            )}

            {isSigning && (
              <form onSubmit={handleConfirmSign} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Signee Name"
                  value={signeeName}
                  onChange={(e) => setSigneeName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Role (e.g. President)"
                  value={signeeRole}
                  onChange={(e) => setSigneeRole(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                >
                  Confirm & Seal
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
