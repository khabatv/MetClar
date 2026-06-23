/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Search, Info, ShieldAlert, CheckCircle, ExternalLink } from "lucide-react";
import { MASTER_ONTOLOGY } from "../data/ontology";
import { ChallengeIssue } from "../types";

export default function OntologyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(1);

  const filteredOntology = MASTER_ONTOLOGY.filter(
    (issue) =>
      issue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.impactedPlatforms.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeIssue = MASTER_ONTOLOGY.find((i) => i.id === selectedIssueId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Annotation Platform Challenge Ontology
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Ground-truth dataset loaded with solutions for the 11 systematic &amp; computational anomalies
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search rules, platforms or fixes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Rules List */}
        <div className="lg:col-span-5 border-r border-slate-100 pr-0 lg:pr-6 h-[480px] overflow-y-auto space-y-2">
          {filteredOntology.map((issue) => (
            <button
              key={issue.id}
              onClick={() => setSelectedIssueId(issue.id)}
              className={`w-full text-left p-3 rounded-lg transition-all border flex items-start gap-3 cursor-pointer ${
                selectedIssueId === issue.id
                  ? "bg-indigo-50 border-indigo-200 text-indigo-950 font-semibold shadow-sm"
                  : "bg-white border-slate-150 text-slate-500 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-800"
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs shrink-0 font-bold ${
                selectedIssueId === issue.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}>
                {issue.id}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-snug truncate">
                  {issue.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-medium">
                  {issue.shortDescription}
                </p>
              </div>
            </button>
          ))}
          
          {filteredOntology.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs font-semibold">
              No matching challenge issues found. Try searching for "RT", "Adduct", or "SIRIUS".
            </div>
          )}
        </div>

        {/* Right Side: Detailed Ontological Spec Card */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-[480px] overflow-y-auto shadow-inner">
          {activeIssue ? (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-100/50 px-2.5 py-1 rounded border border-indigo-200">
                    Challenge {activeIssue.id} of 11
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {activeIssue.impactedPlatforms.map((plat) => (
                      <span
                        key={plat}
                        className="text-[9px] font-mono font-bold text-slate-600 bg-slate-200/50 px-2 py-0.5 rounded border border-slate-200/30"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 mt-1 uppercase tracking-tight">{activeIssue.name}</h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 font-medium shadow-sm">
                  {activeIssue.shortDescription}
                </p>
              </div>

              {/* Real World Physical Example */}
              <div className="border-l-2 border-amber-500/60 pl-3">
                <h4 className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Info className="w-3.5 h-3.5" />
                  Detected Anomaly Template
                </h4>
                <p className="text-xs text-slate-600 mt-1 italic font-medium leading-relaxed">
                  &quot;{activeIssue.shortExample}&quot;
                </p>
              </div>

              {/* Algorithm Mitigation Logic */}
              <div className="border-l-2 border-indigo-500/60 pl-3">
                <h4 className="text-[11px] font-bold text-indigo-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Automated / Heuristic Solution
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  {activeIssue.shortSolution}
                </p>
              </div>

              {/* Resolved Structural Outcome */}
              <div className="border-l-2 border-emerald-500/60 pl-3">
                <h4 className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Fixed Clean Struct Template
                </h4>
                <p className="text-xs text-slate-700 mt-1 font-bold bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-200/70 shadow-sm leading-relaxed">
                  {activeIssue.fixedExample}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs font-semibold">
              Select an issue on the left to review its physical constraints and mapping model.
            </div>
          )}

          {/* Impact Info */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>GROUND TRUTH: MASTER TABLE DOCUMENTED METABOLOMICS V1.2</span>
            <span className="flex items-center gap-1 text-slate-500 font-mono">
              Impacted platform markers connected
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
