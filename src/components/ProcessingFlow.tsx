/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Play, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  Check, 
  AlertTriangle, 
  RotateCcw,
  SkipForward,
  BookmarkCheck
} from "lucide-react";
import { MetabolomicsFeature, ProcessingMode } from "../types";
import { MASTER_ONTOLOGY } from "../data/ontology";
import { applyFixForIssue } from "../utils/engine";

interface ProcessingFlowProps {
  features: MetabolomicsFeature[];
  onUpdateFeatures: (updated: MetabolomicsFeature[]) => void;
  activeFeature: MetabolomicsFeature | null;
  onSetActiveFeature: (feature: MetabolomicsFeature | null) => void;
}

export default function ProcessingFlow({
  features,
  onUpdateFeatures,
  activeFeature,
  onSetActiveFeature
}: ProcessingFlowProps) {
  const [activeTab, setActiveTab] = useState<ProcessingMode>("Global");
  const [sequentialIndex, setSequentialIndex] = useState<number>(0);

  // Filter out flagged/problematic features for sequential processing
  const flaggedFeatures = features.filter(f => f.flaggedIssues.length > 0);

  // -------------------------
  // MODE 1: GLOBAL BATCH FIX
  // -------------------------
  const runGlobalBatch = () => {
    const updated = features.map(feat => {
      if (feat.flaggedIssues.length > 0 && !feat.isResolved) {
        const firstIssue = feat.flaggedIssues[0];
        const fix = applyFixForIssue(feat, firstIssue);
        return {
          ...feat,
          selectedCandidateRank: fix.selectedRank,
          isResolved: true,
          resolutionMethod: "Automatic" as const,
          appliedFixDescription: fix.description
        };
      }
      return feat;
    });
    onUpdateFeatures(updated);
  };

  // Reset all features to unresolved
  const resetAllToUnprocessed = () => {
    const updated = features.map(feat => ({
      ...feat,
      selectedCandidateRank: 1,
      isResolved: false,
      resolutionMethod: "None" as const,
      appliedFixDescription: undefined
    }));
    onUpdateFeatures(updated);
    setSequentialIndex(0);
  };

  // -------------------------
  // MODE 2: SEQUENTIAL NEXT/PREVIOUS
  // -------------------------
  const currentSeqFeature = flaggedFeatures[sequentialIndex];

  const handleSeqFix = () => {
    if (!currentSeqFeature) return;
    const firstIssue = currentSeqFeature.flaggedIssues[0];
    const fix = applyFixForIssue(currentSeqFeature, firstIssue);
    const updated = features.map(f => {
      if (f.id === currentSeqFeature.id) {
        return {
          ...f,
          selectedCandidateRank: fix.selectedRank,
          isResolved: true,
          resolutionMethod: "Automatic" as const,
          appliedFixDescription: fix.description
        };
      }
      return f;
    });
    onUpdateFeatures(updated);
    
    // Automatically advance
    if (sequentialIndex < flaggedFeatures.length - 1) {
      setSequentialIndex(prev => prev + 1);
    }
  };

  const handleSeqSkip = () => {
    if (sequentialIndex < flaggedFeatures.length - 1) {
      setSequentialIndex(prev => prev + 1);
    }
  };

  const handleSeqPrev = () => {
    if (sequentialIndex > 0) {
      setSequentialIndex(prev => prev - 1);
    }
  };

  // -------------------------
  // MODE 3: SUB-GROUP CLUSTERED FIX
  // -------------------------
  // Group features by issue id (1-11)
  const groupAnomalies = () => {
    const groups: { [key: number]: MetabolomicsFeature[] } = {};
    for (let i = 1; i <= 11; i++) {
      groups[i] = [];
    }
    features.forEach(f => {
      f.flaggedIssues.forEach(issId => {
        if (groups[issId]) {
          groups[issId].push(f);
        }
      });
    });
    return groups;
  };

  const issueGrouping = groupAnomalies();

  const fixSubgroup = (issueId: number) => {
    const targetGroupFeatures = issueGrouping[issueId] || [];
    const updated = features.map(feat => {
      const isTarget = targetGroupFeatures.some(tg => tg.id === feat.id);
      if (isTarget && !feat.isResolved) {
        const fix = applyFixForIssue(feat, issueId);
        return {
          ...feat,
          selectedCandidateRank: fix.selectedRank,
          isResolved: true,
          resolutionMethod: "Automatic" as const,
          appliedFixDescription: fix.description
        };
      }
      return feat;
    });
    onUpdateFeatures(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
            Resolving Pipeline Framework
          </h3>
          <p className="text-sm font-bold text-slate-800">
            Pipeline Processing Core
          </p>
        </div>

        {/* Global Reset */}
        <button
          onClick={resetAllToUnprocessed}
          className="text-[10px] bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 self-start cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Purge Resolutions
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab("Global")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "Global"
              ? "bg-white text-indigo-900 border border-slate-200/60 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Global Batch
        </button>
        <button
          onClick={() => {
            setActiveTab("Sequential");
            if (flaggedFeatures.length > 0 && !currentSeqFeature) {
              setSequentialIndex(0);
            }
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "Sequential"
              ? "bg-white text-indigo-900 border border-slate-200/60 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Step-by-Step
        </button>
        <button
          onClick={() => setActiveTab("SubGroup")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "SubGroup"
              ? "bg-white text-indigo-900 border border-slate-200/60 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Subgroup Clusters
        </button>
      </div>

      {/* Content Renderers based on Selected Processing Tab */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-h-[170px] flex flex-col justify-between">
        
        {/* MODE 1: GLOBAL BATCH */}
        {activeTab === "Global" && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700">
                Mode 1: Global Batch Processing (All-at-Once)
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Automatically run the entire workspace dataset against physical and biological filter templates (e.g., CCS calculations, Lotus taxonomy database, and in-source correlation maps). Flagged discrepancies undergo immediate non-destructive correction.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-200/60 gap-3 mt-3">
              <div className="text-[11px] text-slate-500">
                Found <span className="text-amber-600 font-bold font-mono">{flaggedFeatures.length}</span> candidates showing challenges out of {features.length} records.
              </div>
              
              <button
                id="btn_run_global_batch"
                onClick={runGlobalBatch}
                className="bg-indigo-600 hover:bg-indigo-500 font-bold py-2 px-4 rounded-lg text-xs text-white transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Solve All Non-Compliant Anchors
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: SEQUENTIAL STEP BY STEP */}
        {activeTab === "Sequential" && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {currentSeqFeature ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider block">
                      Feature {sequentialIndex + 1} of {flaggedFeatures.length} (Sequential)
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate block">
                      {currentSeqFeature.originalName}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onSetActiveFeature(currentSeqFeature)}
                    className="text-[10px] bg-slate-50 hover:bg-slate-100 px-2.5 py-1 border border-slate-200 text-indigo-600 rounded font-bold shrink-0 cursor-pointer"
                  >
                    Load in Studio
                  </button>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-amber-600">Anomaly Target:</span> Issue #{currentSeqFeature.flaggedIssues[0]} &ndash; {
                    MASTER_ONTOLOGY.find(o => o.id === currentSeqFeature.flaggedIssues[0])?.name || "Physical mismatch"
                  }
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleSeqPrev}
                      disabled={sequentialIndex === 0}
                      className="text-xs bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 py-1.5 px-3 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      onClick={handleSeqSkip}
                      className="text-xs bg-white hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded-lg transition-colors border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      Skip
                    </button>
                  </div>

                  <button
                    id="btn_seq_resolve"
                    onClick={handleSeqFix}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Apply Algorithmic Fix
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                {flaggedFeatures.length === 0 
                  ? "Zero systematic anomalies detected. All spectral entries conform perfectly."
                  : "All sequential feature reviews completed! Export clean data."
                }
              </div>
            )}
          </div>
        )}

        {/* MODE 3: SUB-GROUP CLUSTERED */}
        {activeTab === "SubGroup" && (
          <div className="space-y-4 flex-1">
            <div className="space-y-2 h-[220px] overflow-y-auto pr-1">
              {MASTER_ONTOLOGY.map(issue => {
                const count = issueGrouping[issue.id]?.length || 0;
                if (count === 0) return null;

                const allResolved = issueGrouping[issue.id]?.every(f => f.isResolved);

                return (
                  <div 
                    key={issue.id} 
                    className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 gap-3 text-xs shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          #{issue.id}
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {issue.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Aggregated counts: {count} feature{count > 1 ? "s" : ""}
                      </span>
                    </div>

                    <button
                      onClick={() => fixSubgroup(issue.id)}
                      disabled={allResolved}
                      className={`py-1.5 px-3 text-[11px] font-semibold rounded-lg border transition-all shrink-0 cursor-pointer ${
                        allResolved
                          ? "bg-slate-50 border-slate-200 text-emerald-600 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm"
                      }`}
                    >
                      {allResolved ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Resolved
                        </span>
                      ) : (
                        `Solve Group (${count})`
                      )}
                    </button>
                  </div>
                );
              })}
              
              {flaggedFeatures.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs font-semibold">
                  All categories resolved! Clean datasets ready.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
