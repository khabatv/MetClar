/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  Settings, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight, 
  Check, 
  AlertTriangle, 
  Info, 
  BookOpen,
  ArrowRight
} from "lucide-react";
import { MetabolomicsFeature, AnnotationCandidate } from "../types";
import { MASTER_ONTOLOGY } from "../data/ontology";
import { applyFixForIssue } from "../utils/engine";

interface InteractiveDecisionModeProps {
  feature: MetabolomicsFeature;
  onCommitResolution: (updatedFeature: MetabolomicsFeature) => void;
}

export default function InteractiveDecisionMode({ 
  feature, 
  onCommitResolution 
}: InteractiveDecisionModeProps) {
  const [selectedRank, setSelectedRank] = useState<number>(feature.selectedCandidateRank);
  const [fixMethod, setFixMethod] = useState<string>("default_auto");
  const [userReason, setUserReason] = useState<string>("");
  const [isSuccessCommitted, setIsSuccessCommitted] = useState<boolean>(false);

  // Sync state whenever the selected feature changes
  useEffect(() => {
    setSelectedRank(feature.selectedCandidateRank);
    setUserReason("");
    setFixMethod(feature.resolutionMethod === "Manual" ? "manual_override" : "default_auto");
    setIsSuccessCommitted(false);
  }, [feature]);

  const primaryIssueId = feature.flaggedIssues.length > 0 ? feature.flaggedIssues[0] : null;
  const issueDetails = primaryIssueId 
    ? MASTER_ONTOLOGY.find(o => o.id === primaryIssueId) 
    : null;

  // Active selected candidate reference
  const currentCandidate = feature.candidates.find(c => c.rank === selectedRank) || feature.candidates[0];

  // Auto-generate explanations based on the interactive fixing methodologies selected
  const handleFixMethodChange = (methodKey: string) => {
    setFixMethod(methodKey);
    
    if (methodKey === "keep_top_hit") {
      setSelectedRank(1);
      setUserReason("Expert override confirmed: Evaluated fragments and decided to preserve original top-scoring annotation despite automated ontology alarm.");
    } else if (methodKey === "strict_taxonomy") {
      // Find candidate matching biological context
      const bioCand = feature.candidates.find(c => c.rank === 2);
      if (bioCand) {
        setSelectedRank(bioCand.rank);
        setUserReason(`Applied Chemotaxonomy filter (Lotus/Lotus db matched). Removed out-of-context compound, elevated ${bioCand.name} matching biological flora.`);
      }
    } else if (methodKey === "relax_adduct") {
      const parentCand = feature.candidates.find(c => c.rank === 2);
      if (parentCand) {
        setSelectedRank(parentCand.rank);
        setUserReason(`Adduct boundaries restricted. Rejecting unconstrained adduct cluster and resolving neutral mass structure as ${parentCand.name}.`);
      }
    } else if (methodKey === "ccs_alignment") {
      const glucoseCand = feature.candidates.find(c => c.name.toLowerCase().includes("glucose") || c.rank === 2);
      if (glucoseCand) {
        setSelectedRank(glucoseCand.rank);
        setUserReason(`Isomeric configuration authenticated using experimental Collision Cross Section (CCS: ${glucoseCand.ccsValue} Å²) alignment.`);
      }
    } else if (methodKey === "default_auto" && primaryIssueId) {
      // Apply exact default algorithmic fix
      const res = applyFixForIssue(feature, primaryIssueId);
      setSelectedRank(res.selectedRank);
      setUserReason(res.description);
    } else if (methodKey === "manual_override") {
      setUserReason("Annotator expert manual override. Structural and fragmentation validation cleared.");
    }
  };

  const handleManualCandidateChange = (rank: number) => {
    setSelectedRank(rank);
    setFixMethod("manual_override");
    const chosenName = feature.candidates.find(c => c.rank === rank)?.name || "selected molecule";
    setUserReason(`Manual prioritization by structural mass biologist. Elevated candidate Rank #${rank} (${chosenName}) based on customized fragmentation tree review.`);
  };

  const handleCommit = () => {
    const updatedFeedback: MetabolomicsFeature = {
      ...feature,
      selectedCandidateRank: selectedRank,
      isResolved: true,
      resolutionMethod: fixMethod === "default_auto" ? "Automatic" : "Manual",
      appliedFixDescription: userReason || `Resolved candidate to Rank #${selectedRank} via interactive workflow.`
    };
    
    // Custom post-hoc state mutation for specific issues
    if (primaryIssueId === 6) {
      updatedFeedback.chimericStatus = "Deconvoluted";
    }
    
    onCommitResolution(updatedFeedback);
    setIsSuccessCommitted(true);
    setTimeout(() => {
      setIsSuccessCommitted(false);
    }, 2500);
  };

  return (
    <motion.div 
      key={feature.id}
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6"
    >
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Interactive Decision Studio
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Feature ID: <span className="font-mono text-indigo-700 font-bold">{feature.id}</span> | Precursor m/z: <span className="font-mono font-semibold text-slate-700">{feature.mz}</span> | RT: <span className="font-mono font-semibold text-slate-700">{feature.rt} min</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Resolution Status:</span>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
            feature.isResolved 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
          }`}>
            {feature.isResolved ? "RESOLVED" : "PENDING REVIEW"}
          </span>
        </div>
      </div>

      {/* 1. Systematic Issue Visualizer */}
      {feature.flaggedIssues.length > 0 ? (
        <div id="flagged_issue_alert" className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-inner">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 label_issue_challenge">
                Flagged Challenge: Issue #{primaryIssueId} - {issueDetails?.name}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {issueDetails?.shortDescription}
              </p>
              <div className="text-[11px] text-slate-600 mt-2 bg-white/75 p-2.5 rounded border border-amber-200/55 shadow-sm">
                <span className="font-bold text-amber-800">Anomaly Context:</span> {issueDetails?.shortExample}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-emerald-900">Physical &amp; Biological Integrity Cleared</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">This feature aligns perfectly with our multi-orthogonal physical models.</p>
          </div>
        </div>
      )}

      {/* Grid: 2. Candidates Table & 3. Fix Selectors */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Candidate Ranking Matrix Container */}
        <div className="xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-slate-400" />
              Candidate Structural Matrix ({feature.candidates.length} hits)
            </h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Sorted by Raw Score</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] uppercase font-bold font-mono">
                    <th className="p-3 text-center w-14">Overrule</th>
                    <th className="p-3">Rank / Name</th>
                    <th className="p-3">Formula</th>
                    <th className="p-3 text-right">MS1 Score (Isotope)</th>
                    <th className="p-3 text-right">MS2 Score (Tree)</th>
                    <th className="p-3 text-center">Predicted RT / CCS</th>
                    <th className="p-3">Taxonomy Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feature.candidates.map((cand) => {
                    const isSelected = selectedRank === cand.rank;
                    return (
                      <tr 
                        key={cand.rank}
                        className={`transition-colors duration-150 ${
                          isSelected ? "bg-indigo-50/70 text-indigo-950 font-semibold" : "hover:bg-slate-50/65 text-slate-600"
                        }`}
                      >
                        {/* Selector Radio Button */}
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name={`cand_select_${feature.id}`}
                            checked={isSelected}
                            onChange={() => handleManualCandidateChange(cand.rank)}
                            className="w-4 h-4 text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>

                        {/* Rank & Name */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                              isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                              #{cand.rank}
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">{cand.name}</span>
                              {cand.isBiologicalDecoy && (
                                <span className="block text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded font-mono mt-0.5 font-semibold">
                                  Biological Decoy
                                </span>
                              )}
                              {cand.isSyntheticDrug && (
                                <span className="block text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded font-mono mt-0.5 font-semibold">
                                  Synthetic Bio-probe
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Formula */}
                        <td className="p-3 font-mono font-bold text-slate-600">
                          {cand.formula}
                        </td>

                        {/* MS1 */}
                        <td className="p-3 text-right font-mono text-slate-500 font-semibold">
                          {cand.ms1Score ? `${cand.ms1Score.toFixed(1)}%` : "N/A"}
                        </td>

                        {/* MS2 */}
                        <td className="p-3 text-right">
                          <span className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold border ${
                            cand.ms2Score > 80 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : cand.ms2Score > 40
                              ? "bg-slate-100 text-slate-600 border-slate-200" 
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}>
                            {cand.ms2Score ? `${cand.ms2Score.toFixed(1)}%` : "N/A"}
                          </span>
                        </td>

                        {/* RT / CCS Orthogonals */}
                        <td className="p-3 text-center font-mono text-[10px]">
                          {cand.rtPredicted ? (
                            <span className="block text-slate-500">RT: {cand.rtPredicted.toFixed(1)}m</span>
                          ) : null}
                          {cand.ccsValue ? (
                            <span className="block text-purple-700 font-semibold bg-purple-50 border border-purple-100 rounded px-1 mt-0.5">CCS: {cand.ccsValue.toFixed(1)}Å²</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Taxonomy */}
                        <td className="p-3 text-[11px] text-slate-500 italic">
                          {cand.taxonomy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fix Approach Selectors & manual audit feedback */}
        <div className="xl:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Settings className="w-4 h-4 text-slate-400" />
            Correction Topology
          </h4>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 shadow-inner">
            
            {/* Strategy Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                Fixing Methodology
              </label>
              <select
                value={fixMethod}
                onChange={(e) => handleFixMethodChange(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer shadow-sm"
              >
                <option value="default_auto">Automatic Algorithmic Resolution</option>
                {primaryIssueId === 1 && <option value="ccs_alignment">Enforce Retip RT Boundary Match</option>}
                {primaryIssueId === 3 && <option value="strict_taxonomy">Lotus/CHLaBYR Biosynthetic Filter</option>}
                {primaryIssueId === 4 && <option value="relax_adduct">Standard ESI Mobile Phase Restrict</option>}
                {primaryIssueId === 5 && <option value="ccs_alignment">Ion Mobility CCS Authentication</option>}
                <option value="keep_top_hit">Keep Original Top Hit (No Changes)</option>
                <option value="manual_override">Manual Scientist Override</option>
              </select>
            </div>

            {/* Simulated Live Outcome block */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 shadow-sm">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">Proposed Transformation</span>
              
              <div className="flex items-center gap-2 text-xs justify-between">
                <div className="min-w-0">
                  <span className="text-slate-400 font-mono text-[9px] block uppercase font-bold">Original Annotation</span>
                  <span className="text-slate-700 font-bold truncate block">{feature.originalName}</span>
                  <span className="text-slate-400 text-[9px] font-mono font-semibold">{feature.originalFormula}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-2" />
                <div className="min-w-0 text-right">
                  <span className="text-emerald-700 font-mono text-[9px] block uppercase font-bold">Resolved Taxonomy</span>
                  <span className="text-emerald-800 font-black truncate block">{currentCandidate.name}</span>
                  <span className="text-emerald-600 text-[9px] font-mono font-semibold">{currentCandidate.formula}</span>
                </div>
              </div>
            </div>

            {/* Audit Log / Scientist justification */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                  Audit Report Justification
                </label>
                <span className="text-[9px] text-slate-400 font-semibold font-mono">Writes to logs context</span>
              </div>
              <textarea
                value={userReason}
                onChange={(e) => {
                  setUserReason(e.target.value);
                  setFixMethod("manual_override");
                }}
                placeholder="Details of chemical and physical matching validations which solved this computational anomaly..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none placeholder-slate-400 font-medium shadow-sm"
              />
            </div>

            {/* Action Commit Button */}
            <button
              id="btn_commit_resolution"
              onClick={handleCommit}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSuccessCommitted
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
              }`}
            >
              {isSuccessCommitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Resolution Committed!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save &amp; Commit Resolution
                </>
              )}
            </button>

          </div>
        </div>

      </div>

    </motion.div>
  );
}
