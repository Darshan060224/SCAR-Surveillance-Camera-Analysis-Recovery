# SCAR — Surveillance Camera Analysis & Recovery

SCAR is a local-first, vendor-agnostic forensic workstation designed for the standardized acquisition, identification, recovery, analysis, correlation, and reporting of surveillance video evidence. It can parse data from physical DVR/NVR disks, SD cards, forensic images, and synthetic test fixtures. 

The platform provides a controlled workflow that avoids the common pitfalls of using multiple vendor-specific utilities, ensuring that processing is reproducible, verifiable, and forensically sound.

---

## 🏗 High-Level Architecture

SCAR features an extensible, modular architecture separated into distinct layers:

- **Frontend / UI:** React + TypeScript + TailwindCSS (Desktop-style UI, packaged via Tauri or Electron)
- **Forensic Orchestration API:** Python + FastAPI + Pydantic
- **Evidence Storage & Metadata:** SQLite (single-examiner) or PostgreSQL (multi-user), with immutable original paths and separate output paths.
- **Evidence Processing & Imaging:** Custom parsing registry, FFmpeg/ffprobe, OpenCV, and block-level acquisition adapters (`dd`, `dc3dd`, `ewfacquire`).

## ⚙️ Core Modules (The 7 Pillars)

1. **Acquire:** Identify, write-protect, image, and hash the original source. Supports full physical acquisition or targeted logical acquisition.
2. **Discover:** Extract OEM, model, firmware, storage details, camera inventory, and recording index.
3. **Analyze:** Parse filesystems, proprietary formats, metadata, and establish timestamp provenance.
4. **Extract:** Select camera, date, time, and type to output derivative media confidently.
5. **Recover:** Carve unallocated space, slack space, and DVR pools to recover deleted indexes, fragmented video, and corrupted segments.
6. **Correlate:** Normalize timestamps to UTC (retaining offset) and aggregate events across multiple cameras onto a single timeline.
7. **Preserve & Report:** Maintain tamper-evident hashes, provenance, custody lineage, and generate comprehensive HTML/PDF/JSON reports.

---

## 🛤 The 22-Step Forensic Flow

SCAR enforces a strict investigation lifecycle, transforming chaotic evidence into a structured, court-ready report:

1. **Case Creation:** Define case ID, examiner, and scope.
2. **Add Evidence:** Register the physical or image source.
3. **Device Detection:** Detect block-device or fixture signals.
4. **Device Identification:** Determine OEM, model, and firmware via layered signatures.
5. **Write Protection:** Verify hardware/software write-blocker status.
6. **Verify Read-Only:** Refuse acquisition if the source is writable.
7. **Evidence Acquisition:** Create a bit-for-bit working image.
8. **Hash & Verify:** Validate SHA-256 and MD5 hashes of source vs. working copy.
9. **Evidence Discovery:** Run parser coverage to detect recordings.
10. **Filesystem/Format Analysis:** Parse proprietary DVR/NVR formats.
11. **OEM Parser Execution:** Run vendor-specific adapters (e.g., Hikvision, Dahua).
12. **Recording Index:** Build a camera-wise availability index.
13. **Timestamp Normalization:** Normalize local timestamps to UTC.
14. **Recording Selection:** Filter by camera and time intervals.
15. **Video Extraction:** Extract native media to a derivative workspace.
16. **Deleted Recovery:** Scan for deleted directories and signature carving.
17. **Video Validation:** Verify stream boundaries and decode viability.
18. **Timeline/Event Correlation:** Aggregate cross-camera events.
19. **Artifact Provenance:** Track the lineage from source offset to output file.
20. **Chain of Custody:** Maintain an append-only, tamper-evident audit ledger.
21. **Forensic Report:** Build an executive summary, findings, and limitations exhibit.
22. **Finalize:** Freeze the case with a final manifest and verify all hashes.

---

## 📋 Standard Operating Procedure (SOP)

### 1. Before Acquisition
Confirm legal authority. Identify the device, photograph its state, note serial numbers and seal condition. Register the examiner identity and prepare a write-blocker or read-only mount.

### 2. Acquisition
Create the case workspace and register the source. Acquire a bit-for-bit image. Hash the source and working image, record any read errors, and mathematically verify the copy before proceeding to analysis. **The original evidence is never altered.**

### 3. Analysis & Extraction
Run device identification to map OEM signatures. Parse the filesystem/container to extract media to a separate derivative workspace. Normalize timestamps and run recovery algorithms exclusively against the working image. Record every tool version and output hash.

### 4. Review & AI Assistance
Review recovery confidence (e.g., categorizing as *Complete, Partial, Fragmented, Corrupted*). Validate timestamps against known events. Use assistive AI analytics (Person/Vehicle/Motion detection) strictly as investigative leads, keeping human-in-the-loop annotations. 

### 5. Reporting
Generate the report from a fixed manifest. Confirm all selected artifacts still match their recorded hashes. Include a list of limitations and unsupported formats, export the chain-of-custody ledger, and preserve the final report hash.

---

## 🚀 Getting Started

### Installation

Install the project dependencies using `npm` or `pnpm`:

```bash
npm install
```

### Running the Workstation

SCAR is built to be run as an offline desktop application or a local web service.

- **Start Web Development Server:**
  ```bash
  npm run dev
  ```
- **Start Electron Desktop App (Recommended for local hardware access):**
  ```bash
  npm run electron:dev
  ```
- **Start Tauri Desktop App:**
  ```bash
  npm run desktop:dev
  ```

### Building for Production

Compile the production artifacts:

```bash
npm run build
```

## ⚖️ License & Responsible Use

This platform is intended exclusively for authorized digital-forensics operations. It should not be used to access, alter, or analyze surveillance data without appropriate legal authority. SCAR is licensed under the MIT License.
