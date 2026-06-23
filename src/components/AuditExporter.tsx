/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, FileText, CheckCircle2, Copy, ArrowRight, Table } from "lucide-react";
import { MetabolomicsFeature } from "../types";

interface AuditExporterProps {
  features: MetabolomicsFeature[];
  datasetName: string;
}

export default function AuditExporter({ features, datasetName }: AuditExporterProps) {
  const [copied, setCopied] = useState(false);

  // Compile CSV contents
  const generateCSV = () => {
    const headers = [
      "Feature_ID",
      "Precursor_mz",
      "Retention_Time_min",
      "Abundance_Intensity",
      "Resolved_Compound_Name",
      "Resolved_Formula",
      "Resolved_SMILES",
      "Resolved_InChIKey",
      "Resolved_Taxonomy",
      "Platform_Source",
      "Validation_Status",
      "Applied_Fix"
    ];

    const rows = features.map(f => {
      const selected = f.candidates.find(c => c.rank === f.selectedCandidateRank) || f.candidates[0];
      const fixDesc = f.appliedFixDescription ? f.appliedFixDescription.replace(/"/g, '""') : "None";
      
      return [
        f.id,
        f.mz,
        f.rt,
        f.intensity,
        `"${selected?.name || f.originalName}"`,
        `"${selected?.formula || f.originalFormula}"`,
        `"${selected?.smiles || f.originalSmiles}"`,
        `"${selected?.inchikey || f.originalInchiKey}"`,
        `"${selected?.taxonomy || f.originalTaxonomy}"`,
        `"${f.sourcePlatform}"`,
        f.isResolved ? "Verified_Corrected" : "Verified_Original",
        `"${fixDesc}"`
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  };

  // Compile JSON Audit Log
  const generateAuditLogJSON = () => {
    const resolvedRows = features.filter(f => f.isResolved);
    
    const auditReport = {
      timestamp: new Date().toISOString(),
      sourceDataset: datasetName,
      evaluationOntology: "Master Table Documented Metabolite Annotation Challenges V1.1",
      metrics: {
        totalInspected: features.length,
        anomaliesDetected: features.filter(f => f.flaggedIssues.length > 0).length,
        anomaliesResolved: resolvedRows.length
      },
      auditLog: features.map(f => {
        const originalTop = f.candidates[0];
        const selected = f.candidates.find(c => c.rank === f.selectedCandidateRank) || originalTop;
        
        return {
          featureId: f.id,
          mz: f.mz,
          rt: f.rt,
          sourcePlatform: f.sourcePlatform,
          flaggings: f.flaggedIssues,
          hasAnomaly: f.flaggedIssues.length > 0,
          isResolved: f.isResolved,
          resolutionMethod: f.resolutionMethod,
          originalCandidate: {
            name: f.originalName,
            formula: f.originalFormula,
            taxonomy: f.originalTaxonomy,
            adduct: f.originalAdduct,
            smiles: f.originalSmiles
          },
          resolvedCandidate: {
            name: selected?.name,
            formula: selected?.formula,
            taxonomy: selected?.taxonomy,
            adduct: selected?.adduct,
            smiles: selected?.smiles
          },
          appliedTransformation: f.appliedFixDescription || "Preserved high confidence default"
        };
      })
    };

    return JSON.stringify(auditReport, null, 2);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    const log = generateAuditLogJSON();
    navigator.clipboard.writeText(log);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resolvedList = features.filter(f => f.isResolved && f.flaggedIssues.length > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Compliance Export &amp; Audit Log
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Export downstream tidy datasets and verification audit trails satisfying scientific journal criteria
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* CSV Download */}
          <button
            id="btn_export_csv"
            onClick={() => downloadFile(generateCSV(), `${datasetName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_clean_features.csv`, "text/csv")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 font-bold py-2 px-4 rounded-lg text-xs text-white transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Tidy CSV
          </button>

          {/* Audit JSON Download */}
          <button
            id="btn_export_json"
            onClick={() => downloadFile(generateAuditLogJSON(), `annotation_audit_report.json`, "application/json")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 font-bold py-2 px-4 rounded-lg text-xs text-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Download Audit JSON
          </button>

          {/* Copy Clipboard */}
          <button
            onClick={handleCopyClipboard}
            className="flex items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
            title="Copy JSON Audit Log"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Inspection Total</span>
          <span className="text-2xl font-black text-slate-800 mt-0.5 font-mono">{features.length}</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono">Flagged Challenges</span>
          <span className="text-2xl font-black text-amber-800 mt-0.5 font-mono">
            {features.filter(f => f.flaggedIssues.length > 0).length}
          </span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Taxonomy &amp; Mass Rectified</span>
          <span className="text-2xl font-black text-emerald-800 mt-0.5 font-mono">
            {features.filter(f => f.isResolved).length}
          </span>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
          <Table className="w-4 h-4 text-slate-400" />
          <span>Transformation Audit Log Stream ({resolvedList.length} cases)</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[300px] overflow-y-auto shadow-sm">
          {resolvedList.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {resolvedList.map(feat => {
                const selected = feat.candidates.find(c => c.rank === feat.selectedCandidateRank) || feat.candidates[0];
                return (
                  <div key={feat.id} className="p-4 flex flex-col md:flex-row justify-between gap-4 text-xs transition-colors hover:bg-slate-50/50 bg-white">
                    <div className="space-y-1 md:max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {feat.id}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-150">
                          Issue #{feat.flaggedIssues[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">Method: {feat.resolutionMethod}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-1 font-bold text-slate-800">
                        <span className="text-slate-400 line-through truncate max-w-[170px] inline-block font-medium">{feat.originalName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-emerald-700 truncate max-w-[170px] inline-block font-bold">{selected.name}</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 italic">
                        {feat.appliedFixDescription}
                      </p>
                    </div>

                    <div className="md:text-right flex flex-col justify-center items-start md:items-end font-mono text-[10px] text-slate-500 space-y-1 shrink-0">
                      <span>Formula: {selected.formula}</span>
                      <span>m/z: {feat.mz} | RT: {feat.rt} min</span>
                      <span className="text-indigo-600 font-semibold">InChIKey: {selected.inchikey ? selected.inchikey.slice(0, 14) + "..." : "N/A"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No automatic or manual annotations modified yet. Run the <strong>Resolving Pipeline Framework</strong> or click <strong>Save &amp; Commit Resolution</strong> in the Studio to visualize audited lines.
            </div>
          )}
        </div>
      </div>

      {copied && (
        <div id="toast_copy" className="text-xs text-emerald-800 font-bold fixed bottom-4 right-4 bg-white border border-emerald-250 px-4 py-2.5 rounded-lg shadow-2xl z-50">
          Audit JSON formatted and copied to clipboard successfully!
        </div>
      )}
    </div>
  );
}
