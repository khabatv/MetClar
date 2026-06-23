/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MetabolomicsFeature } from "../types";

export const SAMPLE_METABOLOMICS_DATA: MetabolomicsFeature[] = [
  {
    id: "FT_001",
    originalName: "Triacylglycerol TG(36:0) [Decoy]",
    mz: 723.68,
    rt: 0.8, // Polar front elution
    intensity: 1250000,
    originalFormula: "C45H86O6",
    originalAdduct: "[M+H]+",
    originalSmiles: "CCCCCCCCCCCCCCCCCC(=O)OCC(COP(=O)(O)OCC(CO)O)OC(=O)CCCCCCCCCCCCCCCCC",
    originalInchiKey: "VWYQQNMCZBXMJS-UHFFFAOYSA-N",
    originalTaxonomy: "Synthetic / Mammalian Lipid",
    sourcePlatform: "SIRIUS",
    candidates: [
      {
        rank: 1,
        name: "Triacylglycerol TG(36:0)",
        formula: "C45H86O6",
        smiles: "CCCCCCCCCCCCCCCCCC(=O)OCC(COP(=O)(O)OCC(CO)O)OC(=O)CCCCCCCCCCCCCCCCC",
        inchikey: "VWYQQNMCZBXMJS-UHFFFAOYSA-N",
        taxonomy: "Mammalian Lipid (Highly Hydrophobic)",
        ms1Score: 98.4,
        ms2Score: 42.1,
        adduct: "[M+H]+",
        rtPredicted: 14.5 // Highly hydrophobic, belongs at late RT
      },
      {
        rank: 2,
        name: "Aconitic Acid Conjugate / Polar Glycoside",
        formula: "C12H18O12",
        smiles: "C(C(=C(C(=O)O)C(=O)O)C(=O)O)O[C@H]1[C@@H]([C@H]([C@@H](CO)O1)O)O",
        inchikey: "RJKWRTYUIOPASD-VBNMQLK-N",
        taxonomy: "Plant polar organic acid / Glycoside",
        ms1Score: 91.2,
        ms2Score: 89.5,
        adduct: "[M+H]+",
        rtPredicted: 0.9 // Polar compound, fits perfect eluting early
      }
    ],
    flaggedIssues: [1],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_002",
    originalName: "Simulated Isotope Decoy A",
    mz: 228.06,
    rt: 3.2,
    intensity: 450000,
    originalFormula: "C10H8O6",
    originalAdduct: "[M+H]+",
    originalSmiles: "COC1=C(C=C2C(=C1)C(=O)C=C(O2)C(=O)O)O",
    originalInchiKey: "KUXJZWDFYHSNDK-UHFFFAOYSA-N",
    originalTaxonomy: "Synthetic Dyestuff",
    sourcePlatform: "MS-Finder",
    candidates: [
      {
        rank: 1,
        name: "Simulated Isotope Decoy A (Isotope Match only)",
        formula: "C10H8O6",
        smiles: "COC1=C(C=C2C(=C1)C(=O)C=C(O2)C(=O)O)O",
        inchikey: "KUXJZWDFYHSNDK-UHFFFAOYSA-N",
        taxonomy: "Synthetic Dyestuff",
        ms1Score: 99.8, // Wins purely on isotope shape matches
        ms2Score: 12.3, // Terrible fragmentation tree correlation
        adduct: "[M+H]+",
        rtPredicted: 3.0
      },
      {
        rank: 2,
        name: "Resveratrol Derivative (Phytoalexin)",
        formula: "C14H12O3",
        smiles: "C1=CC(=CC=C1C=CC2=CC(=CC(=C2)O)O)O",
        inchikey: "AUDFUSBXNVIANV-UHFFFAOYSA-N",
        taxonomy: "Stilbenoids (Plants)",
        ms1Score: 92.5,
        ms2Score: 91.2, // Strong fragmentation tree consensus match
        adduct: "[M+H]+",
        rtPredicted: 3.3
      }
    ],
    flaggedIssues: [2],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_003",
    originalName: "Axinelline A",
    mz: 416.32,
    rt: 6.8,
    intensity: 810000,
    originalFormula: "C24H36N4O2",
    originalAdduct: "[M+H]+",
    originalSmiles: "CCCCCCCCN1C2=C(C(=O)N(C1=O)C)N(C=N2)C",
    originalInchiKey: "JNSOPALQWERZXCV-UHFFFAOYSA-N",
    originalTaxonomy: "Axinellidae (Marine Sponge Metabolite)",
    sourcePlatform: "SIRIUS",
    candidates: [
      {
        rank: 1,
        name: "Axinelline A (Marine sponge alkaloid)",
        formula: "C24H36N4O2",
        smiles: "CCCCCCCCN1C2=C(C(=O)N(C1=O)C)N(C=N2)C",
        inchikey: "JNSOPALQWERZXCV-UHFFFAOYSA-N",
        taxonomy: "Marine Porifera",
        ms1Score: 96.5,
        ms2Score: 94.2,
        adduct: "[M+H]+",
        isBiologicalDecoy: true
      },
      {
        rank: 2,
        name: "Solanidine Glycone Fragment",
        formula: "C27H43NO",
        smiles: "CC1CCC2(C(C3C(O1)C4CC5C6CC=C7CC(O)CCC7(C6CC=C4N3)C)C)C",
        inchikey: "XCVBNKJHGFDSA-UHFFFAOYSA-N",
        taxonomy: "Solanaceae / Plant steroidal alkaloid",
        ms1Score: 94.8,
        ms2Score: 93.1,
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [3],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_004",
    originalName: "Fictional Complex Formula",
    mz: 329.08,
    rt: 4.5,
    intensity: 320000,
    originalFormula: "C13H15O6S-Ac",
    originalAdduct: "[M+CH3COO]-", // Rare/Highly unconstrained adduct in non-supporting buffer
    originalSmiles: "CC(=O)OC1=CC(=CC=C1O)C(=O)O",
    originalInchiKey: "WQXMRYUIOPASD-TYU-N",
    originalTaxonomy: "Organic Acid adduct",
    sourcePlatform: "MZmine",
    candidates: [
      {
        rank: 1,
        name: "Fictional Acetate Cluster Compound",
        formula: "C13H15O6S-Ac",
        smiles: "CC(=O)OC1=CC(=CC=C1O)C(=O)O",
        inchikey: "WQXMRYUIOPASD-TYU-N",
        taxonomy: "Unspecified Organic Salt",
        ms1Score: 99.1,
        ms2Score: 34.2,
        adduct: "[M+CH3COO]-"
      },
      {
        rank: 2,
        name: "Caffeic Acid Glucoside",
        formula: "C15H18O9",
        smiles: "C1=CC(=C(C=C1C=CC(=O)O)O)O[C@H]2[C@@H]([C@H]([C@@H](CO)O2)O)O",
        inchikey: "OIPLKJHGFDSA-UHFFFAOYSA-N",
        taxonomy: "Cinnamic Acids (Plants)",
        ms1Score: 94.5,
        ms2Score: 93.8,
        adduct: "[M-H]-" // Restricting parameters to standard negative ion
      }
    ],
    flaggedIssues: [4],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_005",
    originalName: "D-Galactose [Ambiguous Isomer]",
    mz: 180.06,
    rt: 2.5,
    intensity: 900000,
    originalFormula: "C6H12O6",
    originalAdduct: "[M+H]+",
    originalSmiles: "C([C@@H]1[C@@H]([C@@H]([C@H](O1)O)O)O)O",
    originalInchiKey: "WQZBCNCAIKLSDR-UHFFFAOYSA-N",
    originalTaxonomy: "Hexose Sugar",
    sourcePlatform: "CFM-ID",
    candidates: [
      {
        rank: 1,
        name: "D-Galactose",
        formula: "C6H12O6",
        smiles: "C([C@@H]1[C@@H]([C@@H]([C@H](O1)O)O)O)O",
        inchikey: "WQZBCNCAIKLSDR-UHFFFAOYSA-N",
        taxonomy: "Monosaccharide",
        ms1Score: 94.0,
        ms2Score: 94.0, // Identical MS2 because isomer fragmentation trees match perfectly
        adduct: "[M+H]+",
        ccsValue: 142.5 // Correct reference for Galactose is 142.5
      },
      {
        rank: 2,
        name: "D-Glucose",
        formula: "C6H12O6",
        smiles: "C([C@@H]1[C@H]([C@@H]([C@H](O1)O)O)O)O",
        inchikey: "IKRFXCHWBDUFPS-UHFFFAOYSA-N",
        taxonomy: "Monosaccharide",
        ms1Score: 94.0,
        ms2Score: 94.0, // Identical/Equal score
        adduct: "[M+H]+",
        ccsValue: 135.2 // Reference glucose shape index
      }
    ],
    flaggedIssues: [5],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_006",
    originalName: "Phenolic-Terpene Co-elution Hybrid",
    mz: 354.21,
    rt: 5.1,
    intensity: 1540000,
    originalFormula: "C20H34O5-hybrid",
    originalAdduct: "[M+H]+",
    originalSmiles: "CCC=CC1C(C(=O)O)CC2=C1CCC3C2(CCCC3(C)O)C",
    originalInchiKey: "HJDKSIAYWER-UHFFFAOYSA-N",
    originalTaxonomy: "Co-eluting chimeric anomaly",
    sourcePlatform: "GNPS",
    candidates: [
      {
        rank: 1,
        name: "Phenolic-Terpene Complex (Chimeric Mix)",
        formula: "C20H34O5",
        smiles: "CCC=CC1C(C(=O)O)CC2=C1CCC3C2(CCCC3(C)O)C",
        inchikey: "HJDKSIAYWER-UHFFFAOYSA-N",
        taxonomy: "Synthetic Hybrid Decoy",
        ms1Score: 98.2,
        ms2Score: 95.1, // Artificially high score due to mixed fragments matching multiple libraries
        adduct: "[M+H]+"
      },
      {
        rank: 2,
        name: "Eriodictyol (Flavanone)",
        formula: "C15H12O6",
        smiles: "C1C(OC2=CC(=CC(=C2C1=O)O)O)C3=CC(=C(C=C3)O)O",
        inchikey: "QWERTZUIOPLKH-UHFFFAOYSA-N",
        taxonomy: "Flavanone (Plants)",
        ms1Score: 89.2,
        ms2Score: 74.2, // True MS2 profile once hybrid peaks are parsed out
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [6],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None",
    chimericStatus: "Mixed_Spectra"
  },
  {
    id: "FT_007",
    originalName: "Quercetin Free Fragment",
    mz: 303.05,
    rt: 5.6, // Co-eluting perfectly with FT_007_Parent at 5.6 minutes!
    intensity: 640000,
    originalFormula: "C15H10O7",
    originalAdduct: "[M+H]+",
    originalSmiles: "C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O",
    originalInchiKey: "REAQLSREGBDBSO-UHFFFAOYSA-N",
    originalTaxonomy: "Flavonoid Aglycone",
    sourcePlatform: "CAMERA",
    candidates: [
      {
        rank: 1,
        name: "Quercetin (Annotated as Standalone molecule)",
        formula: "C15H10O7",
        smiles: "C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O",
        inchikey: "REAQLSREGBDBSO-UHFFFAOYSA-N",
        taxonomy: "Flavonol",
        ms1Score: 97.4,
        ms2Score: 96.1,
        adduct: "[M+H]+"
      },
      {
        rank: 2,
        name: "Rutin (Parent Glycoside) Source-Fragment Ion",
        formula: "C27H30O16",
        smiles: "CC1C(C(C(C(O1)OCC2C(C(C(C(O2)OC3=C(OC4=CC(=CC(=C4C3=O)O)O)C5=CC(=C(C=C5)O)O)O)O)O)O)O)O",
        inchikey: "IQQZNLHUDORALC-UHFFFAOYSA-N",
        taxonomy: "Flavonol glucoside parent",
        ms1Score: 97.4,
        ms2Score: 96.1,
        adduct: "[M+H-Rutinoside]+" // This is an in-source fragment!
      }
    ],
    flaggedIssues: [7],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_007_Parent",
    originalName: "Rutin (Glycosylated parent flavonol)",
    mz: 611.16,
    rt: 5.6, // Identical elution profile
    intensity: 3400000,
    originalFormula: "C27H30O16",
    originalAdduct: "[M+H]+",
    originalSmiles: "CC1C(C(C(C(O1)OCC2C(C(C(C(O2)OC3=C(OC4=CC(=CC(=C4C3=O)O)O)C5=CC(=C(C=C5)O)O)O)O)O)O)O)O",
    originalInchiKey: "IQQZNLHUDORALC-UHFFFAOYSA-N",
    originalTaxonomy: "Flavonol Glucoside",
    sourcePlatform: "CAMERA",
    candidates: [
      {
        rank: 1,
        name: "Rutin",
        formula: "C27H30O16",
        smiles: "CC1C(C(C(C(O1)OCC2C(C(C(C(O2)OC3=C(OC4=CC(=CC(=C4C3=O)O)O)C5=CC(=C(C=C5)O)O)O)O)O)O)O)O",
        inchikey: "IQQZNLHUDORALC-UHFFFAOYSA-N",
        taxonomy: "Flavonol glycoside",
        ms1Score: 99.2,
        ms2Score: 98.4,
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [],
    selectedCandidateRank: 1,
    isResolved: true,
    resolutionMethod: "Automatic",
    appliedFixDescription: "Parent glycosidic master peak"
  },
  {
    id: "FT_008_ChA",
    originalName: "L-Phenylalanine split peak alpha",
    mz: 166.08,
    rt: 4.18, // Chrom split
    intensity: 480000,
    originalFormula: "C9H11NO2",
    originalAdduct: "[M+H]+",
    originalSmiles: "C1=CC=C(C=C1)CC(C(=O)O)N",
    originalInchiKey: "COLNVWBJAIEZCC-UHFFFAOYSA-N",
    originalTaxonomy: "Amino Acid",
    sourcePlatform: "MZmine",
    candidates: [
      {
        rank: 1,
        name: "L-Phenylalanine (Feature split track A)",
        formula: "C9H11NO2",
        smiles: "C1=CC=C(C=C1)CC(C(=O)O)N",
        inchikey: "COLNVWBJAIEZCC-UHFFFAOYSA-N",
        taxonomy: "Amino Acid",
        ms1Score: 99.5,
        ms2Score: 99.1,
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [8],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_008_ChB",
    originalName: "L-Phenylalanine split peak beta",
    mz: 166.08,
    rt: 4.25, // Split feature boundary
    intensity: 420000,
    originalFormula: "C9H11NO2",
    originalAdduct: "[M+H]+",
    originalSmiles: "C1=CC=C(C=C1)CC(C(=O)O)N",
    originalInchiKey: "COLNVWBJAIEZCC-UHFFFAOYSA-N",
    originalTaxonomy: "Amino Acid",
    sourcePlatform: "MZmine",
    candidates: [
      {
        rank: 1,
        name: "L-Phenylalanine (Feature split track B)",
        formula: "C9H11NO2",
        smiles: "C1=CC=C(C=C1)CC(C(=O)O)N",
        inchikey: "COLNVWBJAIEZCC-UHFFFAOYSA-N",
        taxonomy: "Amino Acid",
        ms1Score: 99.4,
        ms2Score: 98.9,
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [8],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_009",
    originalName: "Apigenin (Waters Q-TOF bias mismatch)",
    mz: 271.06,
    rt: 5.4,
    intensity: 680000,
    originalFormula: "C15H10O5",
    originalAdduct: "[M+H]+",
    originalSmiles: "C1=CC(=CC=C1C2=CC(=O)C3=C(O2)C=C(C=C3O)O)O",
    originalInchiKey: "KCOHSDYMMHCHEY-UHFFFAOYSA-N",
    originalTaxonomy: "Flavones",
    sourcePlatform: "GNPS",
    candidates: [
      {
        rank: 1,
        name: "Random Decoy Scaffold (High similarity Orbitrap match)",
        formula: "C16H14O4",
        smiles: "COC1=CC(=C(C=C1)O)C2=CC(=O)C3=CC=CC=C3O2",
        inchikey: "LSXNMYRE-UHFFFAOYSA-N",
        taxonomy: "Synthetic Isoflavone",
        ms1Score: 82.1,
        ms2Score: 48.3, // Mismatched due to Q-TOF raw intensity bias
        adduct: "[M+H]+"
      },
      {
        rank: 2,
        name: "Apigenin (True biochemical parent)",
        formula: "C15H10O5",
        smiles: "C1=CC(=CC=C1C2=CC(=O)C3=C(O2)C=C(C=C3O)O)O",
        inchikey: "KCOHSDYMMHCHEY-UHFFFAOYSA-N",
        taxonomy: "Flavone (Plants)",
        ms1Score: 97.8,
        ms2Score: 92.4, // Q-TOF corrected structural embedding score
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [9],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_010",
    originalName: "Unknown Apigenin Conjugate (Potassium Cluster)",
    mz: 471.05, // Neutral 432.11 + K (38.96) = 471.07
    rt: 4.8,
    intensity: 220000,
    originalFormula: "C18H20SO10 [Unassigned]",
    originalAdduct: "Unknown salt adduct",
    originalSmiles: "",
    originalInchiKey: "",
    originalTaxonomy: "Unknown Class",
    sourcePlatform: "CAMERA",
    candidates: [
      {
        rank: 1,
        name: "Unknown adduct anomaly",
        formula: "C18H20SO10",
        smiles: "",
        inchikey: "",
        taxonomy: "Unassigned Peak",
        ms1Score: 40.2,
        ms2Score: 10.5,
        adduct: "[M+K-H2O]+"
      },
      {
        rank: 2,
        name: "Apigenin 7-glucoside (Potassium Adduct)",
        formula: "C21H20O11",
        smiles: "C1=CC(=CC=C1C2=CC(=O)C3=C(C=C(C=C3O2)O[C@H]4[C@@H]([C@H]([C@@H](CO)O4)O)O)O)O",
        inchikey: "OIPNBFYWEIQ-UHFFFAOYSA-N",
        taxonomy: "Flavonoid glycosides (Plants)",
        ms1Score: 98.4, // Solves neutral mass Apigenin-7-glucoside (432.11)
        ms2Score: 95.8,
        adduct: "[M+K]+"
      }
    ],
    flaggedIssues: [10],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  },
  {
    id: "FT_011",
    originalName: "N,N-Dimethylphosphoramidate Decoy (PubChem Match)",
    mz: 194.08,
    rt: 2.1,
    intensity: 950000,
    originalFormula: "C8H10N4O2",
    originalAdduct: "[M+H]+",
    originalSmiles: "COP(=O)(NC)OC1=CC=C(C=C1)[N+](=O)[O-]",
    originalInchiKey: "JSLXNMYRE-UHFFFAOYSA-N",
    originalTaxonomy: "Industrial synthetic herbicide",
    sourcePlatform: "SIRIUS",
    candidates: [
      {
        rank: 1,
        name: "N,N-Dimethylphosphoramidate Decoy",
        formula: "C8H10N4O2",
        smiles: "COP(=O)(NC)OC1=CC=C(C=C1)[N+](=O)[O-]",
        inchikey: "JSLXNMYRE-UHFFFAOYSA-N",
        taxonomy: "Industrial synthetic pesticide (Organophosphate)",
        ms1Score: 99.4, // Raw mass is exactly identical, wins purely on massive decoy search space
        ms2Score: 78.4,
        adduct: "[M+H]+",
        isSyntheticDrug: true
      },
      {
        rank: 2,
        name: "Caffeine",
        formula: "C8H10N4O2",
        smiles: "CN1C2=C(C(=O)N(C1=O)C)N(C=N2)C",
        inchikey: "RYYJCVZMQMIUOR-UHFFFAOYSA-N",
        taxonomy: "Purine alkaloid (Plants)",
        ms1Score: 98.9,
        ms2Score: 97.4, // True bio-alkaloid consensus match
        adduct: "[M+H]+"
      }
    ],
    flaggedIssues: [11],
    selectedCandidateRank: 1,
    isResolved: false,
    resolutionMethod: "None"
  }
];
