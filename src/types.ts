/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnnotationCandidate {
  rank: number;
  name: string;
  formula: string;
  smiles: string;
  inchikey: string;
  taxonomy: string;
  ms1Score: number; // Isotope or database matching score (0-100)
  ms2Score: number; // Fragmentation tree alignment score (0-100)
  adduct: string;
  rtPredicted?: number; // In-silico predicted RT (minutes)
  ccsValue?: number; // In-silico predicted or reference CCS (Å²)
  isBiologicalDecoy?: boolean; // PubChem/Synthetic compound with no biological history
  isSyntheticDrug?: boolean; // Out of context synthetic drug
}

export interface MetabolomicsFeature {
  id: string;
  originalName: string;
  mz: number; // Precursor m/z
  rt: number; // Retention time (minutes)
  intensity: number; // Abundance
  originalFormula: string;
  originalAdduct: string;
  originalSmiles: string;
  originalInchiKey: string;
  originalTaxonomy: string;
  sourcePlatform: string; // e.g. "SIRIUS", "MS-DIAL", "MZmine", "XCMS", "GNPS", "CAMERA", "Progenesis QI"
  
  candidates: AnnotationCandidate[];
  flaggedIssues: number[]; // Array of Issue IDs (1-11)
  
  // Resolution/Correction state
  selectedCandidateRank: number; // Defaults to index 1 (top candidate)
  isResolved: boolean;
  appliedFixDescription?: string;
  resolutionMethod: "Automatic" | "Manual" | "None";
  
  // Custom flags updated during filtering
  peakElutionCorrelatedId?: string; // For In-Source Fragmentation (Issue #7)
  isDuplicateMerged?: boolean; // For Spectral Splitting (Issue #8)
  mergedFeatureIds?: string[];
  chimericStatus?: "Clean" | "Mixed_Spectra" | "Deconvoluted"; // Issue #6
}

export interface ChallengeIssue {
  id: number;
  name: string;
  shortDescription: string;
  shortExample: string;
  shortSolution: string;
  fixedExample: string;
  impactedPlatforms: string[];
}

export type ProcessingMode = "Global" | "Sequential" | "SubGroup";

export interface ProcessingReport {
  totalFeatures: number;
  flaggedFeatures: number;
  resolvedFeatures: number;
  issueCounts: { [key: number]: number };
  fixedDetails: {
    featureId: string;
    originalName: string;
    resolvedName: string;
    appliedIssue: number;
    description: string;
    method: "Automatic" | "Manual";
  }[];
}
