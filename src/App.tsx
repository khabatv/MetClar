/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Database, 
  FlaskConical, 
  Settings, 
  Cpu, 
  Layers, 
  GitCompare, 
  AlertTriangle,
  Beaker,
  TrendingUp,
  FileCheck2,
  BookmarkCheck
} from "lucide-react";

import FileUploader from "./components/FileUploader";
import OntologyList from "./components/OntologyList";
import InteractiveDecisionMode from "./components/InteractiveDecisionMode";
import RetentionTimeChart from "./components/RetentionTimeChart";
import ProcessingFlow from "./components/ProcessingFlow";
import AuditExporter from "./components/AuditExporter";

import { MetabolomicsFeature } from "./types";
import { SAMPLE_METABOLOMICS_DATA } from "./data/sampleData";
import { detectIssues } from "./utils/engine";

export default function App() {
  const [features, setFeatures] = useState<MetabolomicsFeature[]>([]);
  const [activeFeature, setActiveFeature] = useState<MetabolomicsFeature | null>(null);
  const [datasetName, setDatasetName] = useState<string>("Pre-loaded Demo Workspace (Tomato Solanaceae Extract)");

  // Load default demo workspace on initialization
  useEffect(() => {
    // Deep clone the default data to prevent reference pollution
    const initialClone = JSON.parse(JSON.stringify(SAMPLE_METABOLOMICS_DATA));
    
    // Automatically trigger initial rules engine flag detection on load
    const processed = initialClone.map((f: MetabolomicsFeature) => ({
      ...f,
      flaggedIssues: detectIssues(f, initialClone)
    }));

    setFeatures(processed);
    // Focus on first annotated issue (FT_001) by default
    const firstFlag = processed.find((f: MetabolomicsFeature) => f.flaggedIssues.length > 0);
    if (firstFlag) {
      setActiveFeature(firstFlag);
    } else {
      setActiveFeature(processed[0] || null);
    }
  }, []);

  const handleDataLoaded = (uploadedData: MetabolomicsFeature[], newDatasetName: string) => {
    const processed = uploadedData.map((f) => ({
      ...f,
      flaggedIssues: detectIssues(f, uploadedData)
    }));
    setFeatures(processed);
    setDatasetName(newDatasetName);
    
    // Auto-focus on first problematic feature
    const firstFlag = processed.find(f => f.flaggedIssues.length > 0);
    if (firstFlag) {
      setActiveFeature(firstFlag);
    } else {
      setActiveFeature(processed[0] || null);
    }
  };

  const handleUpdateFeatures = (updated: MetabolomicsFeature[]) => {
    setFeatures(updated);
    // Keep active feature object state in sync
    if (activeFeature) {
      const activeSync = updated.find(f => f.id === activeFeature.id);
      if (activeSync) {
        setActiveFeature(activeSync);
      }
    }
  };

  const handleCommitSingleResolution = (resolvedFeature: MetabolomicsFeature) => {
    const updated = features.map(f => {
      if (f.id === resolvedFeature.id) {
        return resolvedFeature;
      }
      return f;
    });
    setFeatures(updated);
    setActiveFeature(resolvedFeature);
  };

  const handleSelectFeatureFromChart = (feature: MetabolomicsFeature) => {
    setActiveFeature(feature);
  };

  // Compute live visual dashboard counters
  const totalCount = features.length;
  const flaggedCount = features.filter(f => f.flaggedIssues.length > 0).length;
  const resolvedCount = features.filter(f => f.isResolved).length;
  const pendingCount = flaggedCount - resolvedCount;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col antialiased font-sans">
      
      {/* 1. Header Bar Area */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm">
              <Beaker className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                MetClar <span className="text-indigo-400">Architect v2.1</span>
              </h1>
              <p className="text-[9px] font-mono text-slate-400 tracking-wider">
                Computational Annotation Validation Workspace
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs font-medium">
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">ACTIVE TARGET DB</span>
              <span className="text-xs font-semibold text-indigo-300 truncate max-w-[280px] block" title={datasetName}>
                {datasetName}
              </span>
            </div>
            
            <div className="h-6 w-px bg-slate-700" />

            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Engine: Ready
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 flex-1 w-full">
        
        {/* Statistics Floating Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-center md:text-left md:border-r border-slate-100 p-2 md:pr-4">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">Total Inspected Peaks</span>
            <span className="block text-2xl font-extrabold font-mono text-slate-900 mt-1">{totalCount}</span>
          </div>
          <div className="text-center md:text-left md:border-r border-slate-100 p-2 md:pr-4 bg-amber-50/50 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-amber-600 font-bold tracking-wider">Flagged Challenges</span>
            <span className="block text-2xl font-extrabold font-mono text-amber-800 mt-1">{flaggedCount}</span>
          </div>
          <div className="text-center md:text-left md:border-r border-slate-100 p-1 md:pr-4 bg-emerald-50/50 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold tracking-wider">Resolved / Cleaned</span>
            <span className="block text-2xl font-extrabold font-mono text-emerald-800 mt-1">{resolvedCount}</span>
          </div>
          <div className="text-center md:text-left p-2 bg-indigo-50/50 rounded-lg">
            <span className="text-[10px] uppercase font-mono text-indigo-600 font-bold tracking-wider">Pending Review</span>
            <span className="block text-2xl font-extrabold font-mono text-indigo-800 mt-1">{pendingCount}</span>
          </div>
        </div>

        {/* Workspace Layout Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Data Ingress & Automation */}
          <section className="col-span-1 lg:col-span-4 space-y-6">
            <FileUploader onDataLoaded={handleDataLoaded} />
            
            <ProcessingFlow
              features={features}
              onUpdateFeatures={handleUpdateFeatures}
              activeFeature={activeFeature}
              onSetActiveFeature={setActiveFeature}
            />
          </section>

          {/* Right Column: Physical plots & Interactive decision studios */}
          <section className="col-span-1 lg:col-span-8 space-y-6">
            
            <RetentionTimeChart
              features={features}
              activeFeatureId={activeFeature?.id}
              onSelectFeature={handleSelectFeatureFromChart}
            />

            {activeFeature ? (
              <InteractiveDecisionMode
                feature={activeFeature}
                onCommitResolution={handleCommitSingleResolution}
              />
            ) : (
              <div className="bg-white border border-slate-250 text-slate-500 text-xs rounded-xl p-10 text-center shadow-sm">
                Select a feature from the retention scatterplot or workflow to launch the Interactive Decision Studio.
              </div>
            )}
          </section>

          {/* Combined Bottom Area: Audit exporters and ground-truth browsings */}
          <section className="col-span-1 lg:col-span-12 space-y-6">
            
            <AuditExporter 
              features={features}
              datasetName={datasetName}
            />

            <OntologyList />
            
          </section>

        </div>

      </main>

      {/* Footer Area */}
      <footer className="border-t border-slate-200 py-6 mt-12 bg-white text-center text-[11px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 uppercase tracking-wider font-bold">
          <div className="flex gap-4">
            <span>Session: Active</span>
            <span>Master Table: Loaded (v1.0)</span>
            <span>Platform: Cloud Workspace Core</span>
          </div>
          <div className="text-right">
            <p>&copy; 2026 Khabat Vahabi, Leibniz Institute for Horticultural Sciences (IGZ). All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
