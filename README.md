# MetClar

**MetClar** (Metabolomics Annotation Post-Processor and Validator) is an interactive, high-performance web platform designed to post-process, validate, de-duplicate, and rectify untargeted computational metabolomics annotations. 

By applying a curated expert challenge ontology to computational hits (such as those from SIRIUS, Canopus, or GNPS), MetClar enables researchers to spot systematic anomalies, align chromatography retention times, verify orthogonal CCS profiles, and output publication-ready, fully-audited tidy datasets.

---

## Core Features

*   **Interactive Decision Studio**: Inspect single peaks, view ranks, and review pre-parsed precursor data (m/z, RT, formula). Overrule or validate annotations with real-time heuristic scoring feedback.
*   **Physical Integrity Models**: Detect and rectify 11 systematic metabolomics challenges including in-source co-elution alignments, redundant adducts, biological decoy structures, and Retip RT boundary mismatches.
*   **Compliance Exporter & Audit Log Stream**: Export tidy, standard CSV datasets and structural validation JSON audit reports satisfying strict criteria for peer-reviewed scientific journals.
*   **Interactive Visual Analytics**: Explore peak profiles via responsive retention time scatter plots, connected precursor/fragment parent-daughter maps, and step-by-step resolution pipelines.

---

##  Author & Affiliation

This software was developed and is maintained by:

**Khabat Vahabi**  
[Leibniz Institute for Horticultural Sciences (IGZ)](https://www.igzev.de)  

*   **Tel:** +49 3370178228
*   **Email:** [vahabi@igzev.de](mailto:vahabi@igzev.de)
*   **Web:** [www.igzev.de](https://www.igzev.de)

---

##  Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org) (v18 or higher recommended)
*   npm (v9 or higher)

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Running in Development Mode
Start the development server:
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to interact with the platform.

### Building for Production
Build the static web application structure:
```bash
npm run build
```

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
