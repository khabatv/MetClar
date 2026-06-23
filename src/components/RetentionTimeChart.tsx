/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Crosshair, Info, RefreshCw } from "lucide-react";
import { MetabolomicsFeature } from "../types";
import { getOnlologyIssue } from "../data/ontology";

interface RetentionTimeChartProps {
  features: MetabolomicsFeature[];
  activeFeatureId?: string;
  onSelectFeature: (feature: MetabolomicsFeature) => void;
}

export default function RetentionTimeChart({
  features,
  activeFeatureId,
  onSelectFeature
}: RetentionTimeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 320 });
  const [hoveredFeature, setHoveredFeature] = useState<MetabolomicsFeature | null>(null);

  // ResizeObserver to handle responsive sizing dynamically on all viewports, fallback if undefined
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => {
        if (containerRef.current) {
          setDimensions({
            width: Math.max(containerRef.current.clientWidth, 300),
            height: 320
          });
        }
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 260)
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const padding = { top: 20, right: 25, bottom: 40, left: 55 };
  const plotWidth = dimensions.width - padding.left - padding.right;
  const plotHeight = dimensions.height - padding.top - padding.bottom;

  // Boundary lookups
  const rts = features.map(f => f.rt);
  const mzs = features.map(f => f.mz);
  
  const minRt = Math.min(...rts, 0);
  const maxRt = Math.max(...rts, 15);
  const minMz = Math.max(Math.min(...mzs, 100) - 50, 0);
  const maxMz = Math.max(...mzs, 800) + 50;

  // Linear scaling factors
  const xScale = (rt: number) => {
    const range = maxRt - minRt;
    const pct = range === 0 ? 0.5 : (rt - minRt) / range;
    return padding.left + pct * plotWidth;
  };

  const yScale = (mz: number) => {
    const range = maxMz - minMz;
    const pct = range === 0 ? 0.5 : (mz - minMz) / range;
    // Invert Y axis for positive upwards charting
    return padding.top + (1 - pct) * plotHeight;
  };

  // Generate axes tick coordinates
  const rtTicks = Array.from({ length: 6 }, (_, i) => minRt + (i * (maxRt - minRt)) / 5);
  const mzTicks = Array.from({ length: 5 }, (_, i) => minMz + (i * (maxMz - minMz)) / 4);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
            Multi-Orthogonal Physical Mapping
          </h3>
          <p className="text-sm font-bold text-slate-800 mt-0.5">
            Retention Time (RT) vs Precursor Mass (m/z) Space
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] font-bold font-mono">
          <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Anomaly / Issue</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Standard compliant</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full h-[320px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        
        {/* SVG Area */}
        <svg width={dimensions.width} height={dimensions.height} className="block select-none overflow-visible">
          {/* Grid lines */}
          {rtTicks.map((rt, idx) => {
            const x = xScale(rt);
            return (
              <g key={`rt-grid-${idx}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={dimensions.height - padding.bottom}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={x}
                  y={dimensions.height - padding.bottom + 16}
                  textAnchor="middle"
                  fill="#64748b"
                  className="text-[9px] font-mono font-semibold"
                >
                  {rt.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {mzTicks.map((mz, idx) => {
            const y = yScale(mz);
            return (
              <g key={`mz-grid-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={dimensions.width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  className="text-[9px] font-mono font-semibold"
                >
                  {Math.round(mz)}
                </text>
              </g>
            );
          })}

          {/* Axes labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={dimensions.height - 6}
            textAnchor="middle"
            fill="#475569"
            className="text-[10px] font-bold uppercase tracking-wider"
          >
            Liquid Chromatography Retention Time (RT, minutes)
          </text>

          <text
            x={12}
            y={padding.top + plotHeight / 2}
            textAnchor="middle"
            fill="#475569"
            transform={`rotate(-90 12 ${padding.top + plotHeight / 2})`}
            className="text-[10px] font-bold uppercase tracking-wider"
          >
            Precursor Ion Monoisotopic Mass (m/z)
          </text>

          {/* Connectors for co-eluting In-Source fragments (e.g. FT_007 aglycone fragment connected to parent) */}
          {features.map((feature) => {
            if (feature.id === "FT_007") {
              const parent = features.find(f => f.id === "FT_007_Parent");
              if (parent) {
                const x1 = xScale(feature.rt);
                const y1 = yScale(feature.mz);
                const x2 = xScale(parent.rt);
                const y2 = yScale(parent.mz);
                return (
                  <line
                    key={`co-eluter-line`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#db2777"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                    className="animate-pulse"
                  />
                );
              }
            }
            return null;
          })}

          {/* Plotted Feature Circles */}
          {features.map((feature) => {
            const x = xScale(feature.rt);
            const y = yScale(feature.mz);
            
            const isSelected = activeFeatureId === feature.id;
            const hasIssues = feature.flaggedIssues.length > 0;
            const isResolved = feature.isResolved;

            let color = "#cbd5e1"; // Normal light slate standard
            if (hasIssues) {
              color = isResolved ? "#10b981" : "#ef4444";
            }

            return (
              <g key={feature.id} className="cursor-pointer">
                {/* Bigger selection highlight ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    className="animate-ping"
                  />
                )}

                {/* Main Node */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6.5 : hoveredFeature?.id === feature.id ? 7.5 : 5}
                  fill={color}
                  stroke={isSelected ? "#ffffff" : "#eaeef4"}
                  strokeWidth={isSelected ? 2 : 1}
                  onMouseEnter={() => setHoveredFeature(feature)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => onSelectFeature(feature)}
                  className="transition-all duration-100"
                />

                {/* ID Label on hover */}
                {hoveredFeature?.id === feature.id && (
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill="#312e81"
                    className="text-[9px] font-mono font-bold bg-white"
                  >
                    {feature.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Information Tooltip box */}
        {hoveredFeature && (
          <div
            className="absolute z-10 pointer-events-none bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-xs max-w-[240px] space-y-1.5"
            style={{
              left: Math.min(xScale(hoveredFeature.rt) + 12, dimensions.width - 252),
              top: Math.min(yScale(hoveredFeature.mz) - 12, dimensions.height - 150)
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <span className="font-mono font-bold text-indigo-700">{hoveredFeature.id}</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase font-bold">{hoveredFeature.sourcePlatform}</span>
            </div>
            
            <p className="font-bold text-slate-800 truncate">{hoveredFeature.originalName}</p>
            
            <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-500 font-mono">
              <span>m/z: {hoveredFeature.mz}</span>
              <span>RT: {hoveredFeature.rt}m</span>
              <span className="col-span-2 mt-0.5 truncate text-[9px]">Formula: {hoveredFeature.originalFormula}</span>
            </div>

            {hoveredFeature.flaggedIssues.length > 0 ? (
              <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[9px] text-red-600 font-mono font-bold uppercase">
                  Flagged: Issue #{hoveredFeature.flaggedIssues[0]}
                </span>
              </div>
            ) : (
              <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-emerald-600 font-mono font-bold uppercase">Orthogonals OK</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-xs px-3 bg-slate-50 py-2.5 rounded-lg border border-slate-200 shadow-inner">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <span className="leading-snug">
          Click any peak node to open its spectrum profile in the <strong>Interactive Decision Studio</strong>. Dotted links highlight in-source parent/fragment co-elution alignments.
        </span>
      </div>
    </div>
  );
}
