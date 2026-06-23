/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChallengeIssue } from "../types";

export const MASTER_ONTOLOGY: ChallengeIssue[] = [
  {
    id: 1,
    name: "Orthogonal RT-Annotation Mismatch",
    shortDescription: "An in-silico top hit has a physical structure that contradicts its chromatographic retention time (RT).",
    shortExample: "A highly hydrophobic large lipid is assigned to a feature eluting near the injection front (highly polar region).",
    shortSolution: "Filter or penalize candidates using RT-prediction models like Retip or Retention Index constraints.",
    fixedExample: "Lipid candidate is rejected; a highly polar small organic acid matching the early RT is selected instead.",
    impactedPlatforms: ["SIRIUS", "CFM-ID", "MS-Finder", "MS2Query", "MetaboAnalyst"]
  },
  {
    id: 2,
    name: "MS1 vs. MS2 Rank Imbalance",
    shortDescription: "Exceptional isotope data (MS1) overrules a weak MS2 fragmentation tree score, or vice versa, causing incorrect top-ranking.",
    shortExample: "A wrong formula wins because its simulated isotope pattern fits perfectly, despite poor MS2 alignment.",
    shortSolution: "Implement a dual-score threshold or prioritize consensus scoring where MS2 substructure matches carry higher weight.",
    fixedExample: "Candidate with a marginally lower MS1 score but a highly matching MS2 spectral consensus is prioritized.",
    impactedPlatforms: ["SIRIUS", "MS-Finder", "Progenesis QI"]
  },
  {
    id: 3,
    name: "Taxonomical & Biosynthetic Irrelevance",
    shortDescription: "The tool prioritizes a chemically plausible compound that is biosynthetically restricted to a completely alien organism.",
    shortExample: "A marine sponge metabolite is annotated as the top hit in a clean, terrestrial Solanum lycopersicum (tomato) leaf extract.",
    shortSolution: "Re-rank or filter candidates using chemotaxonomy tools like CANOPUS classification combined with the Lotus database.",
    fixedExample: "The marine metabolite is filtered out, elevating a plant-specific steroidal glycoalkaloid to the top spot.",
    impactedPlatforms: ["SIRIUS", "CFM-ID", "MS-Finder", "MS2Query", "GNPS"]
  },
  {
    id: 4,
    name: "Adduct Selection Mismatch",
    shortDescription: "Allowing unconstrained adduct lists leads to impossible molecular formulas or invalid neutral loss fragments.",
    shortExample: "Selecting rare [M+CH3COO]- adducts in an LC-MS run using basic Formic Acid mobile phase buffers.",
    shortSolution: "Enforce strict instrument- and mobile phase-specific adduct constraints in the preprocessing/SIRIUS GUI parameters.",
    fixedExample: "Adducts are restricted exclusively to [M+H]+ and [M+Na]+, eliminating thousands of false chemical formulas.",
    impactedPlatforms: ["SIRIUS", "MZmine", "MS-DIAL", "XCMS", "CAMERA", "Progenesis QI"]
  },
  {
    id: 5,
    name: "Stereo- and Regioisomer Blindness",
    shortDescription: "MS2 tools cannot differentiate between structures sharing identical functional backbones but different spatial orientations.",
    shortExample: "SIRIUS or CFM-ID yields identical high confidence scores for D-Glucose and D-Galactose, as their fragmentation patterns match.",
    shortSolution: "Integrate orthogonal Data Independent Acquisition (DIA) with Ion Mobility Spectroscopy (IMS) for CCS values.",
    fixedExample: "The structural ambiguity is resolved by confirming that the experimental Collision Cross Section (CCS) matches D-Glucose.",
    impactedPlatforms: ["SIRIUS", "CFM-ID", "MS-Finder", "MS2Query", "MS-DIAL", "GNPS"]
  },
  {
    id: 6,
    name: "Chimeric MS2 Spectrum Corruption",
    shortDescription: "Co-eluting compounds are fragmented together in the same isolation window, creating a hybrid spectrum that distorts matching metrics.",
    shortExample: "Two distinct metabolites enter the collision cell simultaneously, creating an MS2 blend with high artificial cosine match scores.",
    shortSolution: "Use high-resolution deconvolution algorithms or strict peak shape correlation metrics across precursor and fragments.",
    fixedExample: "MS-DIAL or MZmine correctly splits the mixed fragments into two separate pseudo-MS2 spectra before library querying.",
    impactedPlatforms: ["GNPS", "MS-DIAL", "MZmine", "XCMS", "Progenesis QI"]
  },
  {
    id: 7,
    name: "In-Source Fragmentation Misidentification",
    shortDescription: "Unstable molecules fragment in the ESI source before reaching the analyzer, misidentifying a fragment ion as a distinct standalone 'precursor' metabolite.",
    shortExample: "A glycosylated flavone loses its sugar unit in the ion source, causing the remaining aglycone fragment to be processed as an independent molecule.",
    shortSolution: "Group features sharing identical elution profiles using peak-shape Pearson correlations and specific mass offset calculations.",
    fixedExample: "CAMERA or MS-CleanR flags the feature as a neutral loss fragment [M+H-Hexose]+, locking its identity to the parent glycoside.",
    impactedPlatforms: ["MZmine", "MS-DIAL", "XCMS", "CAMERA", "Progenesis QI"]
  },
  {
    id: 8,
    name: "Spectral Splitting & Peak-Boundary Shifting",
    shortDescription: "Poor chromatographic alignment or varying peak widths split a single chemical feature into multiple separate entries across samples.",
    shortExample: "A single peak eluting at 4.2 minutes is split into Feature_4.18 and Feature_4.25, creating duplicate, conflicting database matches.",
    shortSolution: "Optimize peak-picking tolerances (min/max peak width) and apply post-hoc feature list optimizers like MS-FLO.",
    fixedExample: "Duplicate entries are merged into a single consolidated feature list, providing one uniform annotation stream.",
    impactedPlatforms: ["MZmine", "XCMS", "MS-DIAL"]
  },
  {
    id: 9,
    name: "Instrument-Specific Fragmentation Bias",
    shortDescription: "Machine learning models trained on specific collision cell geometries fail to correctly weigh experimental fragmentation paths from other brands.",
    shortExample: "A spectrum generated on a Waters Synapt Q-TOF yields poor similarity scores against a library dominated by Orbitrap data.",
    shortSolution: "Apply instrument-specific spectral normalization or utilize modern machine learning embedding spaces that are instrument-agnostic.",
    fixedExample: "MS2Query or DeepMass utilizes chemical substructure embeddings to confidently match the Q-TOF spectrum despite the intensity layout shift.",
    impactedPlatforms: ["CFM-ID", "GNPS", "MS2Query", "MetaboAnalyst"]
  },
  {
    id: 10,
    name: "Unrealized Adduct Dereplication",
    shortDescription: "Complex chemical backgrounds form non-standard salt clusters that escape standard deconvolution lists, leaving mass additions unassigned.",
    shortExample: "An elite plant extract rich in potassium forms [M+K]+ or [M+2K-H]+ clusters that fail to resolve into a neutral mass.",
    shortSolution: "Feed user-defined, matrix-specific adduct rules directly into the primary preprocessing topology instead of relying on default profiles.",
    fixedExample: "CAMERA maps the peak directly to a potassium adduct, correctly calculating the true neutral monoisotopic mass.",
    impactedPlatforms: ["CAMERA", "MZmine", "MS-DIAL", "XCMS", "Progenesis QI"]
  },
  {
    id: 11,
    name: "Database Size / Search-Space Overwhelm",
    shortDescription: "Querying broad, unfiltered databases pushes structural matching algorithms into a statistical breakdown where structural decoys outscore real compounds.",
    shortExample: "Searching a small plant feature against the entire PubChem space (over 110M compounds) returns an unrelated synthetic drug as a top match.",
    shortSolution: "Enforce pre-filtering boundaries restricted to real-world context chemical classes (e.g., using DNP, KNApSAcK, or COCONUT).",
    fixedExample: "The query space is locked to natural products, ensuring the top-scoring candidate is an environmentally plausible metabolite.",
    impactedPlatforms: ["SIRIUS", "CFM-ID", "MS-Finder", "MetaboAnalyst"]
  }
];

export function getOnlologyIssue(id: number): ChallengeIssue | undefined {
  return MASTER_ONTOLOGY.find(o => o.id === id);
}

export function findIssuesForPlatform(platformName: string): ChallengeIssue[] {
  const norm = platformName.toUpperCase().trim();
  return MASTER_ONTOLOGY.filter(i => 
    i.impactedPlatforms.some(p => norm.includes(p.toUpperCase()))
  );
}
