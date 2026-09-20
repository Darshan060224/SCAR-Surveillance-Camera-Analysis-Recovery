import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpenCheck,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleCheck,
  Clock3,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Fingerprint,
  Filter,
  Gauge,
  HardDrive,
  Layers3,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  PackageCheck,
  PlayCircle,
  Plus,
  Radar,
  RefreshCcw,
  ScanLine,
  ScanSearch,
  SearchCheck,
  Search,
  Server,
  Settings2,
  Shield,
  ShieldCheck,
  Terminal,
  Trash2,
  UploadCloud,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import VideoFrameStudio from "@/components/VideoFrameStudio";


type HomeProps = {
  activeView: string;
  onNavigate: (view: string) => void;
  activeCase?: { id: string; name: string; examiner: string } | null;
};

type NavItem = { label: string; icon: typeof ShieldCheck; group?: string };

const navItems: NavItem[] = [
  { label: "Overview", icon: Gauge },
  { label: "SCAR Flow", icon: Zap },
  { label: "Cases", icon: BriefcaseBusiness },
  { label: "Evidence Intake", icon: UploadCloud },
  { label: "Acquisition", icon: HardDrive },
  { label: "Discovery", icon: SearchCheck },
  { label: "Recordings", icon: CalendarDays },
  { label: "Recovery Lab", icon: ScanSearch },
  { label: "Timeline", icon: Clock3 },
  { label: "Integrity", icon: Fingerprint },
  { label: "Compatibility", icon: Boxes },
  { label: "AI Analytics", icon: BrainCircuit },
  { label: "Reports", icon: FileText },
  { label: "Finalization", icon: PackageCheck },
  { label: "SOP & Validation", icon: BookOpenCheck },
];

const oems = [
  { name: "Hikvision", count: 3, status: "Native parser", color: "cyan" },
  { name: "Dahua", count: 2, status: "Native parser", color: "lime" },
  { name: "CP Plus", count: 2, status: "Signature match", color: "violet" },
  { name: "Uniview", count: 1, status: "Native parser", color: "orange" },
  { name: "Matrix", count: 1, status: "Container found", color: "blue" },
];

const events = [
  { time: "22:14:08", camera: "CAM-04", type: "Person detected", confidence: "98.2%", tone: "lime", location: "North gate" },
  { time: "22:12:46", camera: "CAM-02", type: "Vehicle detected", confidence: "94.8%", tone: "cyan", location: "Loading bay" },
  { time: "22:09:31", camera: "CAM-04", type: "Motion event", confidence: "91.4%", tone: "orange", location: "North gate" },
  { time: "21:58:11", camera: "CAM-01", type: "Person detected", confidence: "96.7%", tone: "violet", location: "Reception" },
];

const chainEvents = [
  { title: "Working copy created", meta: "09 Sep 2026 · 10:30:12 UTC", hash: "a17d…9c4e", user: "examiner01", tone: "lime" },
  { title: "Acquisition verified", meta: "09 Sep 2026 · 10:32:48 UTC", hash: "57c2…a11f", user: "examiner01", tone: "cyan" },
  { title: "Hikvision parser completed", meta: "09 Sep 2026 · 10:38:02 UTC", hash: "bc18…73dd", user: "engine-core", tone: "violet" },
];

const timelineBars = [36, 52, 42, 70, 64, 84, 58, 76, 92, 66, 48, 72, 57, 88, 61, 45, 68, 80, 55, 73, 91, 63, 40, 59];

function StatCard({ label, value, detail, icon: Icon, tone, progress }: { label: string; value: string; detail: string; icon: typeof Activity; tone: string; progress?: number }) {
  return (
    <div className="stat-card glass-panel">
      <div className="stat-card-top">
        <div className={`icon-chip ${tone}`}><Icon size={17} strokeWidth={1.8} /></div>
        <span className="stat-label">{label}</span>
        <MoreHorizontal size={16} className="muted-icon" />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
      {progress !== undefined && <div className="micro-progress"><span style={{ width: `${progress}%` }} /></div>}
    </div>
  );
}

function StatusPill({ children, tone = "neutral", dot = true }: { children: React.ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`status-pill ${tone}`}>{dot && <span className="status-dot" />}{children}</span>;
}

function SectionHeader({ eyebrow, title, detail, action, onAction }: { eyebrow: string; title: string; detail?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action && <button className="ghost-button" onClick={onAction}><span>{action}</span><ArrowUpRight size={15} /></button>}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [filter, setFilter] = useState("All cameras");
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="view-stack">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">CASE WORKSPACE / DVR-2026-001</div>
          <h1>Good morning, <em>examiner.</em></h1>
          <p className="lead">Your evidence workspace is healthy. One recovery queue needs review before the next report export.</p>
        </div>
        <div className="welcome-actions">
          <button className="secondary-button" onClick={() => onNavigate("Evidence Intake")}><Plus size={16} /> New evidence</button>
          <button className="primary-button" onClick={() => { toast.success("Report generation queued", { description: "The forensic report will include current hashes and timeline correlations." }); onNavigate("Reports"); }}><FileCheck2 size={16} /> Generate report</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Evidence items" value="12" detail="+3 since last intake" icon={Database} tone="cyan" progress={72} />
        <StatCard label="Storage analyzed" value="4.8 TB" detail="1.2 TB remaining in case" icon={HardDrive} tone="violet" progress={79} />
        <StatCard label="Integrity status" value="100%" detail="All acquired hashes verified" icon={ShieldCheck} tone="lime" progress={100} />
        <StatCard label="Recovered footage" value="248" detail="36 segments need review" icon={ScanLine} tone="orange" progress={64} />
      </div>

      <div className="dashboard-grid">
        <section className="glass-panel wide-panel">
          <SectionHeader eyebrow="CASE ACTIVITY" title="Evidence processing" detail="Live status of the current acquisition and analysis pipeline." action="Open acquisition" onAction={() => onNavigate("Acquisition")} />
          <div className="pipeline">
            {[
              ["Acquire", "Bit-for-bit image", "Complete", "lime"],
              ["Identify", "5 OEM signatures", "Complete", "cyan"],
              ["Extract", "312 media objects", "Complete", "violet"],
              ["Recover", "36 segments", "In review", "orange"],
              ["Correlate", "Cross-camera events", "Queued", "neutral"],
            ].map(([title, detail, status, tone], index) => (
              <div className="pipeline-step" key={title}>
                <div className={`pipeline-node ${tone}`}>{index < 4 ? <CheckCircle2 size={17} /> : <Circle size={17} />}</div>
                <div className="pipeline-copy"><strong>{title}</strong><span>{detail}</span></div>
                <StatusPill tone={tone === "neutral" ? "muted" : tone}>{status}</StatusPill>
                {index < 4 && <div className="pipeline-line" />}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel risk-panel">
          <div className="panel-topline"><span className="eyebrow">CASE HEALTH</span><button className="icon-button"><MoreHorizontal size={17} /></button></div>
          <div className="risk-score"><div className="score-ring"><span>94</span><small>/100</small></div><div><h3>Evidence confidence</h3><p>Strong chain of custody</p></div></div>
          <div className="health-list">
            <div><span><ShieldCheck size={15} /> Hash validation</span><b className="lime-text">Passed</b></div>
            <div><span><Clock3 size={15} /> Timestamp drift</span><b>+04:32</b></div>
            <div><span><AlertTriangle size={15} /> Recovery review</span><b className="orange-text">36 items</b></div>
          </div>
          <button className="full-ghost" onClick={() => onNavigate("Integrity")}>View integrity dashboard <ChevronRight size={15} /></button>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="glass-panel timeline-panel">
          <SectionHeader eyebrow="UNIFIED TIMELINE" title="Cross-camera activity" detail="09 Sep 2026 · normalized to UTC · 24-hour view" action="Open timeline" onAction={() => onNavigate("Timeline")} />
          <div className="timeline-toolbar"><div className="select-shell"><CalendarDays size={14} /><span>09 Sep 2026</span><ChevronDown size={14} /></div><div className="segmented"><button className={filter === "All cameras" ? "active" : ""} onClick={() => setFilter("All cameras")}>All cameras</button><button className={filter === "Flagged" ? "active" : ""} onClick={() => setFilter("Flagged")}>Flagged</button></div></div>
          <div className="timeline-chart"><div className="chart-y"><span>24:00</span><span>18:00</span><span>12:00</span><span>06:00</span><span>00:00</span></div><div className="chart-area"><div className="chart-gridlines"><i /><i /><i /><i /></div><div className="bars">{timelineBars.map((height, index) => <div key={index} className={`timeline-bar ${index === 18 || index === 20 ? "hot" : ""}`} style={{ height: `${height}%` }}><span /></div>)}</div><div className="x-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div></div></div>
          <div className="timeline-legend"><span><i className="dot cyan" />Motion events <b>128</b></span><span><i className="dot lime" />Person detections <b>76</b></span><span><i className="dot orange" />Flagged segments <b>12</b></span><span className="legend-filter"><Filter size={13} /> {filter}</span></div>
        </section>

        <section className="glass-panel feed-panel">
          <div className="panel-topline"><div><div className="eyebrow">RECENT ANALYTICS</div><h2>Events feed</h2></div><div className="live-control"><span className={`live-indicator ${isLive ? "on" : ""}`} />Live <button onClick={() => setIsLive(!isLive)}>{isLive ? "Pause" : "Resume"}</button></div></div>
          <div className="event-list">{events.map((event) => <div className="event-row" key={event.time}><div className={`event-icon ${event.tone}`}><Eye size={15} /></div><div className="event-copy"><strong>{event.type}</strong><span>{event.camera} · {event.location}</span></div><div className="event-meta"><b>{event.confidence}</b><span>{event.time}</span></div></div>)}</div>
          <button className="full-ghost" onClick={() => onNavigate("AI Analytics")}>Open analytics queue <ArrowUpRight size={14} /></button>
        </section>
      </div>

      <section className="glass-panel oem-panel">
        <SectionHeader eyebrow="PARSER COVERAGE" title="Vendor signatures detected" detail="Five OEM parsers active on this case image." action="Manage parsers" onAction={() => onNavigate("Evidence Intake")} />
        <div className="oem-grid">{oems.map((oem) => <div className="oem-card" key={oem.name}><div className={`oem-mark ${oem.color}`}>{oem.name.slice(0, 1)}</div><div><strong>{oem.name}</strong><span>{oem.status}</span></div><div className="oem-count">{oem.count}<small> sources</small></div><ChevronRight size={15} className="muted-icon" /></div>)}</div>
      </section>
    </div>
  );
}

function ReferenceDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const quickActions = [
    ["New Case", "Create a new investigative case and begin analysis.", Plus, "Cases"],
    ["Open Case", "Open an existing case and continue your work.", Boxes, "Cases"],
    ["Add Evidence", "Register physical devices, disk images or network sources.", HardDrive, "Evidence Intake"],
    ["Start Acquisition", "Acquire evidence with write protection.", Search, "Acquisition"],
  ] as const;
  return <div className="reference-dashboard"><section className="reference-hero"><div className="hero-copy"><div className="reference-kicker">WELCOME TO</div><h1>SCAR</h1><h2>Surveillance Camera Analysis &amp; Recovery</h2><p>Preserve Evidence. Reveal the Truth.</p></div><div className="hero-art"><div className="hero-quote">“Digital evidence<br />has a memory.<br />We help it speak.”<i /></div><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-cube"><ShieldCheck size={42} /></div></div></section><div className="quick-actions">{quickActions.map(([title, detail, Icon, target]) => <button className="quick-card" key={title} onClick={() => { toast.info(`${title} workspace opened`); onNavigate(target); }}><div className="quick-icon"><Icon size={34} strokeWidth={1.7} /></div><div className="quick-card-copy"><h2>{title}</h2><p>{detail}</p></div><ArrowUpRight size={23} className="quick-arrow" /></button>)}</div><div className="reference-grid"><ReferenceTable title="Recent Cases" icon={Boxes} action="View All" emptyIcon={Boxes} emptyTitle="No cases yet" emptyDetail="Create a new case to get started." button="New Case" onClick={() => onNavigate("Cases")} /><ReferenceTable title="Recent Evidence" icon={HardDrive} action="View All" emptyIcon={HardDrive} emptyTitle="No evidence registered" emptyDetail="Add a physical device, disk image or network DVR to begin acquisition." button="Add Evidence" onClick={() => onNavigate("Evidence Intake")} /><ReferenceTable title="Recent Acquisition Jobs" icon={Download} action="View All" emptyIcon={Clock3} emptyTitle="No acquisition jobs" emptyDetail="Start an acquisition job to capture evidence." button="Start Acquisition" onClick={() => onNavigate("Acquisition")} /><ReferenceTable title="Recent Reports" icon={FileText} action="View All" emptyIcon={FileText} emptyTitle="No reports generated" emptyDetail="Generate a report after analysis." button="Create Report" onClick={() => onNavigate("Reports")} /></div><div className="reference-footer-note"><span><ShieldCheck size={15} /> Local forensic workspace · Read-only evidence policy enabled</span><span>SCAR v0.1.0 · Forensic Desktop Application</span></div></div>;
}

function ReferenceTable({ title, icon: Icon, action, emptyIcon: EmptyIcon, emptyTitle, emptyDetail, button, onClick }: { title: string; icon: typeof Boxes; action: string; emptyIcon: typeof Boxes; emptyTitle: string; emptyDetail: string; button: string; onClick: () => void }) {
  return <section className="reference-table"><div className="reference-table-head"><div><Icon size={22} strokeWidth={1.8} /><h2>{title}</h2></div><button onClick={onClick}>{action}<ArrowUpRight size={15} /></button></div><div className="reference-table-columns"><span>{title === "Recent Cases" ? "Case Number" : title === "Recent Evidence" ? "Evidence ID" : title === "Recent Acquisition Jobs" ? "Job ID" : "Report ID"}</span><span>{title === "Recent Cases" ? "Case Name" : title === "Recent Evidence" ? "Type" : title === "Recent Acquisition Jobs" ? "Evidence ID" : "Case Number"}</span><span>{title === "Recent Cases" ? "Created" : title === "Recent Evidence" ? "Source / Description" : title === "Recent Acquisition Jobs" ? "Source" : "Type"}</span><span>{title === "Recent Cases" ? "Last Accessed" : title === "Recent Evidence" ? "Registered" : title === "Recent Acquisition Jobs" ? "Started" : "Generated"}</span><span>Status</span></div><div className="reference-empty"><EmptyIcon size={39} strokeWidth={1.4} /><strong>{emptyTitle}</strong><p>{emptyDetail}</p><button className="reference-outline-button" onClick={onClick}><Plus size={15} />{button}</button></div></section>;
}

function EvidenceIntake({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [dropActive, setDropActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">EVIDENCE INTAKE / STEP 01</div><h1>Register evidence.</h1><p className="lead">Preserve the original, document the source, and let the parser engine identify the device.</p></div><StatusPill tone="lime">Workspace ready</StatusPill></div>
    <div className="intake-grid"><section className="glass-panel upload-panel"><div className={`drop-zone ${dropActive ? "active" : ""} ${uploaded ? "uploaded" : ""}`} onDragEnter={() => setDropActive(true)} onDragLeave={() => setDropActive(false)} onDrop={() => { setDropActive(false); setUploaded(true); toast.success("Evidence staged", { description: "A read-only working copy is ready for acquisition." }); }} onClick={() => { setUploaded(true); toast.success("Evidence staged", { description: "Demo image selected for this case." }); }}><div className="upload-orb"><UploadCloud size={28} /></div><h3>{uploaded ? "DVR-2026-001.E01 staged" : "Drop a forensic image here"}</h3><p>{uploaded ? "4.8 TB · E01 container · read-only" : "RAW, DD, E01, or mounted storage source"}</p><button className="secondary-button small"><Plus size={14} /> Browse evidence</button><span className="drop-note"><LockKeyhole size={12} /> Original evidence is never modified</span></div><div className="hash-preview"><div><span className="eyebrow">ACQUISITION POLICY</span><strong>Write-blocked by default</strong></div><div className="policy-badge"><ShieldCheck size={15} /> SHA-256 + MD5</div></div></section>
      <section className="glass-panel form-panel"><SectionHeader eyebrow="CASE METADATA" title="Evidence identity" detail="Required fields are stored with the chain-of-custody record." /><div className="form-grid"><label>Evidence ID<input defaultValue="DVR-2026-001" /></label><label>Source type<select defaultValue="DVR HDD"><option>DVR HDD</option><option>NVR SSD</option><option>SD card</option><option>Forensic image</option></select></label><label>Examiner<input defaultValue="examiner01" /></label><label>Source timezone<select defaultValue="Asia/Kolkata"><option>Asia/Kolkata</option><option>UTC</option><option>America/New_York</option></select></label><label className="full">Collection notes<textarea defaultValue="Acquired from site security rack. Seal 00472 intact. Device powered down before removal." /></label></div><button className="primary-button full-width" onClick={() => { toast.success("Evidence record saved"); onNavigate("Acquisition"); }}>Save and start acquisition <ChevronRight size={15} /></button></section></div>
    <section className="glass-panel"><SectionHeader eyebrow="RECENT INTAKE" title="Evidence register" detail="Immutable registration history for the active investigation." /><div className="table-wrap"><table><thead><tr><th>Evidence ID</th><th>Source</th><th>Format</th><th>Hash state</th><th>Registered</th><th /></tr></thead><tbody><tr><td><strong>DVR-2026-001</strong><span>Primary case image</span></td><td>DVR HDD <span>Hikvision DS-7608</span></td><td><StatusPill tone="cyan">E01</StatusPill></td><td><StatusPill tone="lime">Verified</StatusPill></td><td>09 Sep 2026 · 10:30</td><td><button className="icon-button"><MoreHorizontal size={16} /></button></td></tr><tr><td><strong>DVR-2026-002</strong><span>Supplemental card</span></td><td>SD card <span>CP Plus recorder</span></td><td><StatusPill tone="violet">RAW</StatusPill></td><td><StatusPill tone="orange">Pending</StatusPill></td><td>09 Sep 2026 · 11:14</td><td><button className="icon-button"><MoreHorizontal size={16} /></button></td></tr></tbody></table></div></section>
  </div>;
}

function Acquisition({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(68);
  const start = () => { setRunning(true); toast.success("Acquisition resumed", { description: "The read-only imaging process is running in demo mode." }); let next = progress; const timer = window.setInterval(() => { next += 8; setProgress(Math.min(next, 100)); if (next >= 100) { window.clearInterval(timer); setRunning(false); toast.success("Acquisition verified", { description: "SHA-256 and MD5 values match the original source." }); } }, 450); };
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">ACQUISITION / BIT-FOR-BIT</div><h1>Make the working copy.</h1><p className="lead">The original image remains sealed while the analysis copy is processed.</p></div><StatusPill tone="cyan"><span className="status-dot pulse" /> Write blocker active</StatusPill></div>
    <div className="acquisition-grid"><section className="glass-panel acquisition-hero"><div className="hero-label"><span className="record-dot" />IMAGING IN PROGRESS</div><div className="acquisition-number">{progress}<span>%</span></div><div className="large-progress"><span style={{ width: `${progress}%` }} /></div><div className="progress-meta"><span>3.26 TB of 4.8 TB copied</span><span>Est. 00:42 remaining</span></div><div className="acquisition-actions"><button className="primary-button" onClick={start} disabled={running}>{running ? <RefreshCcw size={15} className="spin" /> : <PlayCircle size={15} />}{running ? "Running…" : progress >= 100 ? "Re-verify image" : "Resume imaging"}</button><button className="secondary-button" onClick={() => toast.info("Acquisition paused safely")}>{running ? "Pause" : "View log"}</button></div></section><section className="glass-panel"><SectionHeader eyebrow="SOURCE PROFILE" title="Hikvision DS-7608NI" detail="Detected by partition + container signatures." /><div className="profile-list"><div><span><Server size={15} /> Device class</span><strong>NVR / 8-channel</strong></div><div><span><Database size={15} /> Source volume</span><strong>4.80 TB · SATA</strong></div><div><span><Cpu size={15} /> Firmware family</span><strong>V4.72.108</strong></div><div><span><Layers3 size={15} /> Detected format</span><strong>Hikvision HIK container</strong></div></div><button className="full-ghost" onClick={() => onNavigate("Recovery Lab")}>Continue to extraction <ChevronRight size={15} /></button></section></div>
    <section className="glass-panel evidence-layer-panel"><SectionHeader eyebrow="EVIDENCE LAYERS" title="Acquisition format ≠ DVR recording format" detail="SCAR never converts a native .DAV or proprietary recording into an E01/DD image. The image preserves the original storage sectors." /><div className="evidence-layer-flow"><div><HardDrive size={18} /><strong>Physical HDD</strong><span>Original · read-only</span></div><ChevronRight size={17} /><div className="layer-emphasis"><Database size={18} /><strong>RAW / DD or E01</strong><span>Forensic image container</span></div><ChevronRight size={17} /><div><ScanSearch size={18} /><strong>SCAR discovery</strong><span>Storage + OEM parser</span></div><ChevronRight size={17} /><div><FileCheck2 size={18} /><strong>Native / derivative</strong><span>DAV · MP4 · metadata</span></div></div><div className="layer-note"><ShieldCheck size={14} /> Original image remains untouched. Extracted MP4/DAV files are derivatives linked to source offsets and hashes.</div></section>
    <section className="glass-panel"><SectionHeader eyebrow="CRYPTOGRAPHIC VALIDATION" title="Source vs. working copy" detail="Values are captured at acquisition start and re-checked after analysis." /><div className="hash-table"><div className="hash-row heading"><span>Algorithm</span><span>Original evidence</span><span>Working copy</span><span>Match</span></div><div className="hash-row"><strong>SHA-256</strong><code>57c2b2c7…a11f8e90</code><code>57c2b2c7…a11f8e90</code><StatusPill tone="lime">Match</StatusPill></div><div className="hash-row"><strong>MD5</strong><code>9a1d8f13…4e0cd7a2</code><code>9a1d8f13…4e0cd7a2</code><StatusPill tone="lime">Match</StatusPill></div></div></section>
  </div>;
}


function RecoveryLab({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [selected, setSelected] = useState("All sources");
  const [scanning, setScanning] = useState(false);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">RECOVERY LAB / MEDIA FORENSICS</div><h1>Find what was deleted &amp; analyze video frames.</h1><p className="lead">Inspect 16097301_2160_3840_24fps.mp4, extract high-resolution frames, run AI detection, and delete or export frames.</p></div><button className="primary-button" onClick={() => { setScanning(true); toast.success("Recovery scan started", { description: "Scanning unallocated clusters for vendor containers." }); window.setTimeout(() => { setScanning(false); toast.success("Recovery scan complete", { description: "36 candidate segments added to the review queue." }); }, 1600); }}>{scanning ? <RefreshCcw size={15} className="spin" /> : <ScanSearch size={15} />}{scanning ? "Scanning…" : "Start recovery scan"}</button></div>
    <VideoFrameStudio />
    <div className="recovery-grid"><section className="glass-panel"><SectionHeader eyebrow="RECOVERY SUMMARY" title="Candidate segments" detail="Cross-validated against camera metadata and stream signatures." /><div className="recovery-metrics"><div><span className="metric-number lime-text">248</span><span>Recovered</span></div><div><span className="metric-number orange-text">36</span><span>Needs review</span></div><div><span className="metric-number">17</span><span>Corrupt</span></div></div><div className="recovery-donut"><div className="donut"><span>82<small>% usable</small></span></div><div className="donut-legend"><span><i className="dot lime" />Recovered <b>248</b></span><span><i className="dot orange" />Review <b>36</b></span><span><i className="dot muted" />Corrupt <b>17</b></span></div></div></section><section className="glass-panel"><SectionHeader eyebrow="PARSER ENGINE" title="OEM coverage" detail="Modular parser interface with confidence scoring." /><div className="parser-list">{[["Hikvision", "98.6%", "lime"], ["Dahua", "96.1%", "cyan"], ["CP Plus", "91.4%", "violet"], ["Uniview", "88.9%", "orange"]].map(([name, score, tone]) => <div className="parser-row" key={name}><div className={`oem-mark mini ${tone}`}>{name[0]}</div><div><strong>{name}</strong><span>Container + metadata parser</span></div><b className={`${tone}-text`}>{score}</b><CheckCircle2 size={15} className={`${tone}-text`} /></div>)}</div><button className="full-ghost" onClick={() => onNavigate("Timeline")}>Review extracted timeline <ArrowUpRight size={14} /></button></section></div>
    <section className="glass-panel"><div className="table-toolbar"><div><div className="eyebrow">RECOVERY QUEUE</div><h2>Recovered media objects</h2></div><div className="toolbar-actions"><div className="select-shell"><Filter size={14} /><select value={selected} onChange={(e) => setSelected(e.target.value)}><option>All sources</option><option>Hikvision</option><option>Dahua</option><option>CP Plus</option></select><ChevronDown size={14} /></div><button className="icon-button"><MoreHorizontal size={17} /></button></div></div><div className="table-wrap"><table><thead><tr><th>Object</th><th>Source camera</th><th>Type</th><th>Confidence</th><th>State</th><th /></tr></thead><tbody>{["segment_00482.hik", "segment_00483.hik", "carve_0102.dav", "segment_00491.hik"].map((item, i) => <tr key={item}><td><strong>{item}</strong><span>09 Sep 2026 · {i % 2 ? "22:09:31" : "22:14:08"}</span></td><td>CAM-0{i + 1} <span>{i % 2 ? "North gate" : "Reception"}</span></td><td><StatusPill tone={i === 2 ? "violet" : "cyan"}>{i === 2 ? "DAV" : "HIK"}</StatusPill></td><td><div className="confidence"><span style={{ width: `${92 - i * 7}%` }} /><b>{92 - i * 7}%</b></div></td><td><StatusPill tone={i === 1 ? "orange" : "lime"}>{i === 1 ? "Review" : "Recovered"}</StatusPill></td><td><button className="icon-button" onClick={() => toast.info(`${item} selected for forensic preview`)}><Eye size={15} /></button></td></tr>)}</tbody></table></div></section></div>;
}


function TimelineView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [camera, setCamera] = useState("All cameras");
  const [selectedEvent, setSelectedEvent] = useState(0);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">TIMELINE / CORRELATION ENGINE</div><h1>See the whole story.</h1><p className="lead">Normalized UTC events across every recovered camera and metadata source.</p></div><button className="secondary-button" onClick={() => toast.success("Timeline exported as CSV") }><Download size={15} /> Export timeline</button></div><section className="glass-panel timeline-workspace"><div className="timeline-workspace-top"><div><div className="eyebrow">09 SEP 2026 · 21:45—22:30 UTC</div><h2>Cross-camera event correlation</h2></div><div className="toolbar-actions"><div className="select-shell"><Filter size={14} /><select value={camera} onChange={(e) => setCamera(e.target.value)}><option>All cameras</option><option>CAM-01</option><option>CAM-02</option><option>CAM-04</option></select><ChevronDown size={14} /></div><button className="icon-button"><CalendarDays size={16} /></button></div></div><div className="timeline-ruler"><span>21:45</span><span>21:55</span><span>22:05</span><span>22:15</span><span>22:25</span><span>22:30</span></div><div className="camera-lanes">{["CAM-01 · Reception", "CAM-02 · Loading bay", "CAM-04 · North gate", "CAM-06 · Yard"].map((name, i) => <div className="camera-lane" key={name}><div className="lane-label"><span className={`camera-dot dot-${i}`} />{name}</div><div className="lane-track"><span className="lane-event e1" style={{ left: `${18 + i * 3}%`, width: `${10 + i * 2}%` }} /><span className="lane-event e2" style={{ left: `${51 - i * 4}%`, width: `${7 + i * 2}%` }} /><span className="lane-event e3" style={{ left: `${78 - i * 2}%`, width: `${8 + i}%` }} /></div></div>)}</div><div className="correlation-callout"><div className="callout-icon"><Radar size={18} /></div><div><strong>Correlated activity window detected</strong><p>CAM-02 and CAM-04 show overlapping vehicle/person events within 00:01:37.</p></div><StatusPill tone="orange">Flag for review</StatusPill></div></section><div className="timeline-detail-grid"><section className="glass-panel"><SectionHeader eyebrow="EVENT DETAIL" title="Normalized events" detail={`${camera} · showing 4 of 128 activity records`} /><div className="detail-events">{events.map((event, i) => <button className={`detail-event ${selectedEvent === i ? "selected" : ""}`} key={event.time} onClick={() => setSelectedEvent(i)}><div className={`event-icon ${event.tone}`}><Eye size={15} /></div><div className="event-copy"><strong>{event.type}</strong><span>{event.camera} · {event.location}</span></div><div className="event-meta"><b>{event.time}</b><span>{event.confidence}</span></div><ChevronRight size={15} /></button>)}</div></section><section className="glass-panel selected-event"><div className="eyebrow">SELECTED RECORD</div><div className="selected-event-title"><div className={`event-icon ${events[selectedEvent].tone}`}><Eye size={18} /></div><div><h2>{events[selectedEvent].type}</h2><p>{events[selectedEvent].camera} · {events[selectedEvent].location}</p></div></div><div className="detail-stat-grid"><div><span>UTC timestamp</span><strong>2026-09-09</strong><b>{events[selectedEvent].time}</b></div><div><span>AI confidence</span><strong>{events[selectedEvent].confidence}</strong><b>YOLO v8 detector</b></div><div><span>Source object</span><strong>segment_00482</strong><b>SHA-256 verified</b></div><div><span>Timezone offset</span><strong>+05:30</strong><b>Original preserved</b></div></div><button className="primary-button full-width" onClick={() => onNavigate("AI Analytics")}><PlayCircle size={15} /> Open evidence preview</button></section></div></div>;
}

function IntegrityView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [copied, setCopied] = useState(false);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">INTEGRITY / CHAIN OF CUSTODY</div><h1>Trust every artifact.</h1><p className="lead">Every handoff, hash, parser action, and export is recorded in an immutable event log.</p></div><StatusPill tone="lime"><ShieldCheck size={13} /> All checks passed</StatusPill></div><div className="integrity-grid"><section className="glass-panel integrity-score"><div className="score-ring large"><span>100</span><small>% verified</small></div><h2>Evidence integrity</h2><p>Hash values match across the original image, working copy, and extracted artifacts.</p><div className="integrity-mini"><span><CheckCircle2 size={15} /> SHA-256</span><b>Verified</b></div><div className="integrity-mini"><span><CheckCircle2 size={15} /> MD5</span><b>Verified</b></div></section><section className="glass-panel"><SectionHeader eyebrow="CASE MANIFEST" title="Evidence fingerprint" detail="Canonical values for DVR-2026-001." /><div className="fingerprint-block"><span>SHA-256</span><code>57c2b2c7e2a4d7f1d0efb79bc0e7c9a8b2f4c7d9<br />8d3f2c1a6e9b1f0c4a2d5e7f8b9c0a11</code><button className="icon-button" onClick={() => { setCopied(true); toast.success("SHA-256 copied"); }}><Copy size={15} /></button></div><div className="fingerprint-block"><span>MD5</span><code>9a1d8f136e4a7b2c5d9e0f1a4b8c2d7a</code><button className="icon-button"><Copy size={15} /></button></div><div className="manifest-footer"><span><FileCheck2 size={14} /> Manifest v1.4</span><span>{copied ? "Copied to clipboard" : "Last checked 2 min ago"}</span></div></section></div><section className="glass-panel"><SectionHeader eyebrow="AUDIT TRAIL" title="Chain-of-custody events" detail="Chronological, append-only record for this investigation." action="Export audit log" onAction={() => toast.success("Audit log export queued")} /><div className="chain-list">{chainEvents.map((item) => <div className="chain-item" key={item.title}><div className={`chain-dot ${item.tone}`}><CheckCircle2 size={14} /></div><div className="chain-copy"><strong>{item.title}</strong><span>{item.meta}</span></div><code>{item.hash}</code><span className="chain-user">{item.user}</span><ChevronRight size={14} className="muted-icon" /></div>)}</div><button className="full-ghost" onClick={() => onNavigate("Reports")}><FileText size={14} /> Include chain of custody in report</button></section></div>;
}

function AnalyticsView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [model, setModel] = useState("Object + person detection");
  const [running, setRunning] = useState(false);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">AI ANALYTICS / REVIEW QUEUE</div><h1>Turn pixels into leads.</h1><p className="lead">Review explainable detections without losing sight of the source evidence.</p></div><button className="primary-button" onClick={() => { setRunning(true); toast.success("AI analysis queued", { description: `${model} will process 312 extracted media objects.` }); window.setTimeout(() => setRunning(false), 1600); }}>{running ? <RefreshCcw size={15} className="spin" /> : <BrainCircuit size={15} />}{running ? "Running…" : "Run analysis"}</button></div>
    <VideoFrameStudio />
    <div className="analytics-grid"><section className="glass-panel model-panel"><SectionHeader eyebrow="MODEL ROUTING" title="Analysis configuration" detail="Models are applied to working copies only." /><label>Pipeline<select value={model} onChange={(e) => setModel(e.target.value)}><option>Object + person detection</option><option>Motion + scene change</option><option>Face detection (review only)</option></select></label><div className="model-toggle"><div><strong>Explainable detections</strong><span>Keep confidence and source frame with each result.</span></div><div className="toggle active"><i /></div></div><div className="model-toggle"><div><strong>Blur faces in exports</strong><span>Privacy-safe report previews.</span></div><div className="toggle"><i /></div></div><button className="full-ghost" onClick={() => onNavigate("SOP & Validation")}>View model validation <ArrowUpRight size={14} /></button></section><section className="glass-panel analytics-summary"><div className="analytics-header"><div><div className="eyebrow">CURRENT RUN</div><h2>Detection coverage</h2></div><StatusPill tone="cyan">YOLO v8 · CPU</StatusPill></div><div className="analytics-big"><span>312</span><small>media objects analyzed</small></div><div className="coverage-bars"><div><span>Person</span><i><b style={{ width: "76%" }} /></i><strong>76</strong></div><div><span>Vehicle</span><i><b style={{ width: "58%" }} /></i><strong>58</strong></div><div><span>Motion</span><i><b style={{ width: "92%" }} /></i><strong>92</strong></div><div><span>Face</span><i><b style={{ width: "34%" }} /></i><strong>34</strong></div></div></section></div><section className="glass-panel"><SectionHeader eyebrow="REVIEW QUEUE" title="High-confidence detections" detail="Sort by confidence, camera, or timestamp before report inclusion." action="Export detections" onAction={() => toast.success("Detection CSV exported")} /><div className="detection-grid">{[{label: "Person", camera: "CAM-04", time: "22:14:08", confidence: "98.2%", tone: "lime"}, {label: "Vehicle", camera: "CAM-02", time: "22:12:46", confidence: "94.8%", tone: "cyan"}, {label: "Person", camera: "CAM-01", time: "21:58:11", confidence: "96.7%", tone: "violet"}].map((item) => <div className="detection-card" key={item.time}><div className={`frame-placeholder ${item.tone}`}><ScanLine size={22} /><span>Frame preview</span><div className="bbox" /></div><div className="detection-copy"><div><strong>{item.label} detected</strong><StatusPill tone={item.tone}>{item.confidence}</StatusPill></div><span>{item.camera} · {item.time}</span><button className="link-button" onClick={() => toast.info("Evidence preview opened in review mode")}>Review frame <ArrowUpRight size={13} /></button></div></div>)}</div></section></div>;
}


function ReportsView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [reportReady, setReportReady] = useState(false);
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">REPORTS / FORENSIC OUTPUT</div><h1>Make the findings defensible.</h1><p className="lead">Generate a standardized report with acquisition facts, normalized timelines, and evidence hashes.</p></div><button className="primary-button" onClick={() => { setReportReady(true); toast.success("Forensic report generated", { description: "PDF and HTML versions are ready in the case workspace." }); }}><FileText size={15} /> {reportReady ? "Regenerate report" : "Generate report"}</button></div><div className="report-grid"><section className="glass-panel report-preview"><div className="report-page"><div className="report-brand"><div className="brand-mark small"><ShieldCheck size={16} /></div><span>SENTINEL <b>FORENSICS</b></span><em>CONFIDENTIAL</em></div><div className="report-kicker">FORENSIC ANALYSIS REPORT</div><h2>Case DVR-2026-001</h2><p>Surveillance storage acquisition and multi-camera event correlation</p><div className="report-divider" /><div className="report-metadata"><div><span>Examiner</span><strong>examiner01</strong></div><div><span>Acquired</span><strong>09 Sep 2026</strong></div><div><span>Sources</span><strong>12 evidence items</strong></div></div><div className="report-bars"><i /><i /><i /><i /><i /></div><div className="report-summary"><div><span>Integrity</span><strong>100% verified</strong></div><div><span>Media recovered</span><strong>248 segments</strong></div><div><span>Correlated events</span><strong>128 records</strong></div></div><div className="report-footer">Generated by Sentinel Forensics 0.1 · Report manifest SHA-256 verified</div></div></section><section className="glass-panel report-config"><SectionHeader eyebrow="REPORT BUILDER" title="Include sections" detail="Select what should be included in the final forensic output." /><div className="check-list">{["Executive summary", "Acquisition & device profile", "Hash manifest", "Recovery findings", "Unified timeline", "AI analytics appendix", "Chain of custody", "SOP & limitations"].map((item, i) => <label key={item}><span className={`check-box ${i === 7 ? "" : "checked"}`}>{i === 7 ? null : <CheckCircle2 size={14} />}</span>{item}<ChevronRight size={14} className="muted-icon" /></label>)}</div><div className="report-format"><span>Export format</span><div className="format-options"><button className="active"><FileText size={15} /> PDF</button><button><Terminal size={15} /> HTML</button><button><Database size={15} /> JSON</button></div></div><button className="full-ghost" onClick={() => onNavigate("Integrity")}><Fingerprint size={14} /> Review evidence manifest before export</button></section></div><section className="glass-panel"><SectionHeader eyebrow="REPORT HISTORY" title="Generated outputs" detail="Every export is linked to the exact evidence manifest used." /><div className="table-wrap"><table><thead><tr><th>Report</th><th>Format</th><th>Manifest</th><th>Generated</th><th>Status</th><th /></tr></thead><tbody><tr><td><strong>Case DVR-2026-001 · Full report</strong><span>48 pages · 7 sections</span></td><td>PDF</td><td><code>57c2…a11f</code></td><td>09 Sep 2026 · 11:08</td><td><StatusPill tone="lime">Ready</StatusPill></td><td><button className="icon-button" onClick={() => toast.success("Download started")}><Download size={15} /></button></td></tr></tbody></table></div></section></div>;
}

function SopView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [expanded, setExpanded] = useState("Acquire");
  const sop = [{ title: "Acquire", detail: "Write-blocked, bit-for-bit imaging", state: "Complete" }, { title: "Verify", detail: "SHA-256 + MD5 comparison", state: "Complete" }, { title: "Parse", detail: "OEM signature and container identification", state: "Complete" }, { title: "Recover", detail: "Filesystem-aware and carved media", state: "In review" }, { title: "Report", detail: "Standardized output and audit manifest", state: "Ready" }];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">SOP & VALIDATION / OPERATIONS</div><h1>Make the workflow repeatable.</h1><p className="lead">A field-ready operating procedure for defensible DVR/NVR evidence handling.</p></div><button className="secondary-button" onClick={() => toast.success("SOP downloaded as PDF")}><Download size={15} /> Download SOP</button></div><div className="sop-grid"><section className="glass-panel sop-list"><SectionHeader eyebrow="STANDARD OPERATING PROCEDURE" title="Case workflow" detail="Follow each gate in order. Do not analyze the original source." />{sop.map((step, i) => <button key={step.title} className={`sop-step ${expanded === step.title ? "expanded" : ""}`} onClick={() => setExpanded(expanded === step.title ? "" : step.title)}><div className={`sop-number ${step.state === "Complete" ? "complete" : step.state === "In review" ? "review" : "ready"}`}>{step.state === "Complete" ? <CheckCircle2 size={16} /> : i + 1}</div><div className="sop-copy"><div><strong>{step.title}</strong><StatusPill tone={step.state === "Complete" ? "lime" : step.state === "In review" ? "orange" : "cyan"}>{step.state}</StatusPill></div><span>{step.detail}</span>{expanded === step.title && <p>Record operator, timestamp, source path, tool version, and output hash before moving to the next gate.</p>}</div><ChevronDown size={16} className={`sop-chevron ${expanded === step.title ? "rotated" : ""}`} /></button>)}</section><section className="glass-panel validation-panel"><SectionHeader eyebrow="VALIDATION MATRIX" title="Prototype readiness" detail="Demonstration coverage for the final-year project scope." /><div className="validation-list">{[["Acquisition reproducibility", "3 / 3 runs", "lime"], ["Hash stability", "100% match", "lime"], ["OEM identification", "5 / 6 fixtures", "cyan"], ["Deleted recovery", "82% usable", "orange"], ["Timestamp normalization", "± 1 sec", "violet"], ["Report consistency", "12 / 12 checks", "lime"]].map(([label, value, tone]) => <div key={label}><span>{label}</span><b className={`${tone}-text`}>{value}</b><CheckCircle2 size={15} className={`${tone}-text`} /></div>)}</div><div className="limitations"><div className="callout-icon"><CircleAlert size={17} /></div><div><strong>Documented limitation</strong><p>Proprietary allocation structures require a fixture image and vendor-specific parser evidence. Unsupported formats remain marked as unparsed rather than silently converted.</p></div></div><button className="full-ghost" onClick={() => onNavigate("Reports")}><FileText size={14} /> Add validation appendix to report</button></section></div></div>;
}

function ScarFlowView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const modules = [
    ["01", "ACQUIRE", "Identify → Protect → Image → Hash", "Complete", "lime", "Evidence source is write-protected and the working image is verified."],
    ["02", "DISCOVER", "OEM → Model → Storage → Cameras → Recordings", "Complete", "cyan", "Five OEM signatures and 12 evidence sources are indexed."],
    ["03", "ANALYZE", "Filesystem → Format → Metadata → Index", "Complete", "violet", "Recording-index structures and timestamp provenance are available."],
    ["04", "EXTRACT", "Camera → Date → Time → Recording", "Complete", "lime", "Targeted extraction supports camera, date, time, and recording type."],
    ["05", "RECOVER", "Deleted → Carving → Fragments → Validate", "In review", "orange", "36 candidates require examiner classification before reporting."],
    ["06", "CORRELATE", "Timeline → Events → Multi-camera", "Queued", "cyan", "UTC-normalized events are ready for cross-camera correlation."],
    ["07", "PRESERVE & REPORT", "Hash → Provenance → Custody → Report", "Ready", "violet", "Manifest, lineage, chain of custody, and report exports are linked."],
  ];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">SCAR / SURVEILLANCE CAMERA ANALYSIS & RECOVERY</div><h1>One flow. Every artifact.</h1><p className="lead">The seven-module investigation path that keeps acquisition deterministic and reporting defensible.</p></div><StatusPill tone="cyan"><Zap size={12} /> Local/offline ready</StatusPill></div><section className="glass-panel scar-hero"><div className="scar-flow-line"><span>Identify</span><i>→</i><span>Protect</span><i>→</i><span>Acquire</span><i>→</i><span>Discover</span><i>→</i><span>Analyze</span><i>→</i><span>Extract</span><i>→</i><span>Recover</span><i>→</i><span>Validate</span><i>→</i><span>Correlate</span><i>→</i><span>Report</span></div><div className="scar-hero-bottom"><div><div className="eyebrow">CASE ENGINE STATE</div><h2>Deterministic core · AI-independent integrity</h2><p>SCAR keeps acquisition, recovery, validation, provenance, and custody operational without cloud connectivity. AI is an optional analysis layer over validated outputs.</p></div><div className="scar-hero-stats"><div><strong>22</strong><span>workflow gates</span></div><div><strong>7</strong><span>major modules</span></div><div><strong>0</strong><span>cloud dependencies</span></div></div></div></section><div className="scar-grid">{modules.map(([number, title, subtitle, state, tone, detail], index) => <button className={`scar-module ${index === 4 ? "current" : ""}`} key={title} onClick={() => { const target = title === "ACQUIRE" ? "Acquisition" : title === "RECOVER" ? "Recovery Lab" : title === "CORRELATE" ? "Timeline" : title === "PRESERVE & REPORT" ? "Reports" : "Overview"; onNavigate(target); }}><div className={`scar-number ${tone}`}>{number}</div><div className="scar-module-copy"><div><strong>{title}</strong><StatusPill tone={tone}>{state}</StatusPill></div><span>{subtitle}</span><p>{detail}</p></div><ChevronRight size={16} className="muted-icon" /></button>)}</div><section className="glass-panel requirements-panel"><SectionHeader eyebrow="SCAR GUARANTEES" title="Requirements now visible in the product" detail="These are first-class states rather than hidden assumptions." /><div className="requirement-grid"><div><ShieldCheck size={16} /><span>Read-only verification</span><b>Enforced before imaging</b></div><div><HardDrive size={16} /><span>Full + targeted acquisition</span><b>Camera/time aware</b></div><div><ScanSearch size={16} /><span>Recovery classification</span><b>Complete · Partial · Fragmented</b></div><div><Clock3 size={16} /><span>Timestamp provenance</span><b>Original + UTC retained</b></div><div><Fingerprint size={16} /><span>Artifact lineage</span><b>Source → report linked</b></div><div><Server size={16} /><span>Unknown DVR handling</span><b>Verified · Partial · Unknown</b></div></div></section></div>;
}

function CompatibilityView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const rows = [
    ["Hikvision", "DS-7608NI", "V4.72", "Verified", "Container + index", "98.6%", "cyan"],
    ["Dahua", "DHI-NVR", "V4.0", "Verified", "DAV + metadata", "96.1%", "lime"],
    ["CP Plus", "CP-NVR", "3.x", "Partial", "Signature + export", "91.4%", "violet"],
    ["Uniview", "NVR30", "NVR", "Verified", "Container + index", "88.9%", "orange"],
    ["Matrix", "COSEC", "Unknown", "Partial", "Container found", "76.2%", "blue"],
    ["Honeywell / TP-Link / Godrej", "Unknown", "Unknown", "Unknown", "Detection only", "—", "neutral"],
  ];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">COMPATIBILITY / OEM MATRIX</div><h1>Support what you can prove.</h1><p className="lead">Compatibility is validated at the OEM, model, firmware, and storage level—not assumed universally.</p></div><button className="secondary-button" onClick={() => toast.info("Fixture manager is available in the next backend milestone")}><Plus size={15} /> Add fixture</button></div><div className="compat-summary"><div className="glass-panel"><span className="eyebrow">OEM profiles</span><strong>8</strong><p>Tracked in the research matrix</p></div><div className="glass-panel"><span className="eyebrow">Verified fixtures</span><strong className="lime-text">5</strong><p>Reproducible parser evidence</p></div><div className="glass-panel"><span className="eyebrow">Unknown states</span><strong className="orange-text">3</strong><p>Explicitly marked, never overstated</p></div><div className="glass-panel"><span className="eyebrow">Local operation</span><strong className="cyan-text">100%</strong><p>No cloud dependency in core flow</p></div></div><section className="glass-panel"><SectionHeader eyebrow="VALIDATED SUPPORT" title="OEM / model / firmware coverage" detail="Use this matrix in the final demonstration to explain honest support claims." /><div className="table-wrap"><table><thead><tr><th>OEM</th><th>Model family</th><th>Firmware</th><th>Status</th><th>Evidence layer</th><th>Confidence</th><th /></tr></thead><tbody>{rows.map(([oem, model, firmware, status, evidence, confidence, tone]) => <tr key={oem}><td><strong>{oem}</strong><span>Parser registry entry</span></td><td>{model}</td><td><code>{firmware}</code></td><td><StatusPill tone={status === "Verified" ? "lime" : status === "Partial" ? "orange" : "muted"}>{status}</StatusPill></td><td>{evidence}</td><td><b className={`${tone}-text`}>{confidence}</b></td><td><button className="icon-button" onClick={() => toast.info(`${oem}: compatibility evidence panel opened`)}><ChevronRight size={15} /></button></td></tr>)}</tbody></table></div><button className="full-ghost" onClick={() => onNavigate("SOP & Validation")}><BookOpenCheck size={14} /> Open validation matrix and fixture SOP</button></section><section className="glass-panel unknown-callout"><div className="callout-icon"><CircleAlert size={17} /></div><div><strong>Unknown DVR handling is a feature</strong><p>SCAR reports UNKNOWN or UNSUPPORTED when a fixture is not validated. It never implies that a detected signature guarantees complete extraction or recovery.</p></div><StatusPill tone="orange">Honest support claim</StatusPill></section></div>;
}

function CasesView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const cases = [["CASE-2026-001", "Main Gate Incident", "Analysis", "examiner01", "12", "09 Sep 2026"], ["CASE-2026-002", "Warehouse Review", "Reporting", "examiner02", "4", "06 Sep 2026"], ["CASE-2026-003", "Parking Lot Export", "Closed", "examiner01", "8", "21 Aug 2026"]];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">CASE MANAGEMENT / INVESTIGATIONS</div><h1>Keep every case accountable.</h1><p className="lead">Create, open, and track investigations without losing the evidence context behind them.</p></div><button className="primary-button" onClick={() => { toast.success("New case workspace created", { description: "CASE-2026-004 is ready for evidence registration." }); onNavigate("Evidence Intake"); }}><Plus size={15} /> New case</button></div><div className="compat-summary"><div className="glass-panel"><span className="eyebrow">All cases</span><strong>18</strong><p>Across the local workspace</p></div><div className="glass-panel"><span className="eyebrow">Active analysis</span><strong className="cyan-text">4</strong><p>Evidence processing underway</p></div><div className="glass-panel"><span className="eyebrow">Reporting</span><strong className="orange-text">3</strong><p>Awaiting examiner finalization</p></div><div className="glass-panel"><span className="eyebrow">Archived</span><strong className="violet-text">11</strong><p>Read-only case packages</p></div></div><section className="glass-panel"><SectionHeader eyebrow="CASE REGISTER" title="All investigations" detail="Every case has an owner, status, evidence count, and last activity." /><div className="table-wrap"><table><thead><tr><th>Case ID</th><th>Case name</th><th>Status</th><th>Examiner</th><th>Evidence</th><th>Created</th><th /></tr></thead><tbody>{cases.map(([id, name, status, examiner, evidence, created]) => <tr key={id}><td><strong>{id}</strong><span>Local case package</span></td><td>{name}</td><td><StatusPill tone={status === "Analysis" ? "cyan" : status === "Reporting" ? "orange" : "muted"}>{status}</StatusPill></td><td>{examiner}</td><td>{evidence} items</td><td>{created}</td><td><button className="icon-button" onClick={() => { toast.success(`${id} opened`); onNavigate("Overview"); }}><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div></section><section className="glass-panel case-stage-panel"><SectionHeader eyebrow="ACTIVE CASE / DVR-2026-001" title="Main Gate Incident" detail="Current workspace progress across the forensic lifecycle." /><div className="case-stage-row">{["Evidence", "Acquisition", "Discovery", "Analysis", "Recovery", "Timeline", "Report", "Finalized"].map((stage, i) => <div className={`case-stage ${i < 4 ? "done" : i === 4 ? "current" : ""}`} key={stage}><span>{i < 4 ? <CheckCircle2 size={14} /> : i === 4 ? <CircleCheck size={14} /> : <Circle size={14} />}</span><small>0{i + 1}</small><strong>{stage}</strong></div>)}</div></section></div>;
}

function DiscoveryView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const cameras = [["CAM-01", "Front gate", "1920×1080", "H.264", "25", "09 Sep 21:44", "09 Sep 23:58"], ["CAM-02", "Parking", "2560×1440", "H.265", "20", "09 Sep 21:46", "09 Sep 23:56"], ["CAM-03", "Warehouse", "1920×1080", "H.264", "25", "09 Sep 21:44", "09 Sep 23:58"], ["CAM-04", "Entrance", "2560×1440", "H.265", "20", "09 Sep 21:47", "09 Sep 23:51"]];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">DISCOVERY / DEVICE MAP</div><h1>Know the source before analysis.</h1><p className="lead">SCAR maps the device, storage architecture, parser confidence, cameras, and recording structures after acquisition.</p></div><StatusPill tone="lime"><CheckCircle2 size={13} /> Discovery complete</StatusPill></div><div className="discovery-grid"><section className="glass-panel device-card"><div className="eyebrow">SOURCE PROFILE</div><h2>Hikvision DS-7608NI</h2><p>Detected by partition, container, and recording-index signatures.</p><div className="device-facts"><div><span>Device path</span><strong>/evidence/DVR-2026-001.E01</strong></div><div><span>Firmware</span><strong>V4.72.108</strong></div><div><span>Storage</span><strong>4 TB · SATA · 512 B sectors</strong></div><div><span>Filesystem</span><strong>Proprietary / indexed</strong></div><div><span>Parser</span><strong>Hikvision Parser 0.4</strong></div><div><span>Status</span><StatusPill tone="lime">VERIFIED</StatusPill></div></div></section><section className="glass-panel evidence-map"><SectionHeader eyebrow="EVIDENCE MAP" title="Discovery stages" detail="All supported signals remain linked to source offsets." />{[["Identify source", "OEM + model + firmware", "lime"], ["Detect storage", "GPT · 4 TB · 512 B", "cyan"], ["Locate structures", "Index + camera blocks", "violet"], ["Build inventory", "4 cameras · 312 objects", "orange"]].map(([title, detail, tone]) => <div className="map-row" key={title}><div className={`map-check ${tone}`}><CheckCircle2 size={14} /></div><div><strong>{title}</strong><span>{detail}</span></div><code>0x{Math.floor(Math.random() * 9000 + 1000).toString(16)}</code></div>)}<button className="full-ghost" onClick={() => onNavigate("Compatibility")}>View parser compatibility <ChevronRight size={15} /></button></section></div><section className="glass-panel"><SectionHeader eyebrow="CAMERA INVENTORY" title="Discovered cameras" detail="Camera identifiers are discovered from the evidence; the examiner does not manually invent channels." action="Open recording calendar" onAction={() => onNavigate("Recordings")} /><div className="table-wrap"><table><thead><tr><th>Camera ID</th><th>Name</th><th>Resolution</th><th>Codec</th><th>FPS</th><th>First recording</th><th>Last recording</th><th>Status</th></tr></thead><tbody>{cameras.map((cam) => <tr key={cam[0]}><td><strong>{cam[0]}</strong><span>Channel discovered</span></td><td>{cam[1]}</td><td>{cam[2]}</td><td><code>{cam[3]}</code></td><td>{cam[4]}</td><td>{cam[5]}</td><td>{cam[6]}</td><td><StatusPill tone="lime">Indexed</StatusPill></td></tr>)}</tbody></table></div></section></div>;
}

function RecordingsView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedCamera, setSelectedCamera] = useState("CAM-01");
  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">RECORDINGS / INDEX & CALENDAR</div><h1>Select the evidence window.</h1><p className="lead">Search by discovered camera, date, time, recording type, and safety buffer before targeted extraction.</p></div><button className="primary-button" onClick={() => { toast.success("Targeted extraction configured", { description: `${selectedCamera} · 10 Sep 2026 · 14:00–15:30 · ±5 min buffer` }); onNavigate("Acquisition"); }}><ScanLine size={15} /> Start targeted extraction</button></div><div className="recordings-grid"><section className="glass-panel calendar-panel"><div className="calendar-header"><div><div className="eyebrow">RECORDING CALENDAR</div><h2>September 2026</h2></div><div className="calendar-legend"><span><i className="available" />Recording available</span><span><i className="partial" />Partial coverage</span></div></div><div className="calendar-week">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}</div><div className="calendar-days">{days.map((day) => <button key={day} className={`${day === selectedDay ? "selected" : ""} ${[4, 5, 10, 11, 12, 17].includes(day) ? "available" : [7, 8, 15].includes(day) ? "partial" : ""}`} onClick={() => setSelectedDay(day)}><strong>{day}</strong><small>{[4, 5, 10, 11, 12, 17].includes(day) ? "4 cams" : [7, 8, 15].includes(day) ? "2 cams" : "—"}</small></button>)}</div><div className="calendar-selection"><CalendarDays size={15} /><span>10 Sep 2026</span><b>Available cameras: CAM-01 · CAM-02 · CAM-04</b></div></section><section className="glass-panel target-panel"><SectionHeader eyebrow="RECORDING SEARCH" title="Build a targeted request" detail="The recording index will be included in the acquisition manifest." /><label>Camera<select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)}><option>CAM-01</option><option>CAM-02</option><option>CAM-04</option></select></label><div className="time-row"><label>Start time<input defaultValue="14:00" /></label><label>End time<input defaultValue="15:30" /></label></div><label>Date<input value={`10 Sep 2026`} readOnly /></label><label>Safety buffer<select defaultValue="±5 minutes"><option>±5 minutes</option><option>±10 minutes</option><option>±15 minutes</option></select></label><div className="recording-types"><span>Recording types</span><label><input type="checkbox" defaultChecked /> Continuous</label><label><input type="checkbox" defaultChecked /> Motion</label><label><input type="checkbox" /> Alarm</label></div><button className="full-ghost" onClick={() => toast.info("Coverage search returned 18 recording segments")}>Check coverage <SearchCheck size={14} /></button></section></div><section className="glass-panel"><SectionHeader eyebrow="RECORDING INDEX" title={`Coverage on 10 Sep 2026 · ${selectedCamera}`} detail="Logical recording intervals discovered from the OEM index." /><div className="coverage-table"><div className="coverage-row heading"><span>Interval</span><span>Type</span><span>Size</span><span>State</span><span /></div>{[["14:00—14:18", "Continuous", "2.4 GB", "Verified"], ["14:18—14:42", "Motion", "1.1 GB", "Verified"], ["14:45—15:12", "Continuous", "3.6 GB", "Verified"], ["15:12—15:30", "Motion", "842 MB", "Partial"]].map(([interval, type, size, state]) => <div className="coverage-row" key={interval}><strong>{interval}</strong><span>{type}</span><code>{size}</code><StatusPill tone={state === "Verified" ? "lime" : "orange"}>{state}</StatusPill><button className="icon-button" onClick={() => toast.info(`${interval} selected for extraction`)}><ChevronRight size={15} /></button></div>)}</div></section></div>;
}

function FinalizationView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [finalized, setFinalized] = useState(false);
  const checks: [string, string, boolean][] = [["Evidence manifest sealed", "12 sources · 57c2…a11f", true], ["Hash verification complete", "SHA-256 + MD5 match", true], ["Recovery findings classified", "248 recovered · 36 reviewed", true], ["Chain of custody complete", "42 append-only events", true], ["Report generated", "PDF · HTML · JSON ready", true], ["Examiner sign-off", "Required before finalization", false]];
  return <div className="view-stack"><div className="welcome-row compact"><div><div className="eyebrow">FINALIZATION / EVIDENCE PACKAGE</div><h1>Close the case with confidence.</h1><p className="lead">Seal the manifest, preserve the custody history, and export a reproducible case package.</p></div><button className="primary-button" disabled={finalized} onClick={() => { setFinalized(true); toast.success("Case finalized", { description: "Evidence package sealed and ready for transfer." }); }}><PackageCheck size={15} /> {finalized ? "Case finalized" : "Finalize case"}</button></div><div className="finalization-grid"><section className="glass-panel finalize-checklist"><SectionHeader eyebrow="FINALIZATION GATES" title="Readiness checklist" detail="All gates must pass before the package can be sealed." />{checks.map(([label, detail, done]) => <div className="final-check" key={label}><div className={`final-check-icon ${done ? "done" : "pending"}`}>{done ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}</div><div><strong>{label}</strong><span>{detail}</span></div><StatusPill tone={done ? "lime" : "orange"}>{done ? "Passed" : "Pending"}</StatusPill></div>)}<div className="signoff-box"><LockKeyhole size={15} /><div><strong>Examiner attestation</strong><p>Confirm that the report accurately distinguishes original, extracted, recovered, repaired, and AI-assisted artifacts.</p></div><button className="secondary-button small" onClick={() => toast.success("Examiner sign-off recorded")}>Sign off</button></div></section><section className="glass-panel package-preview"><div className="eyebrow">CASE PACKAGE</div><div className="package-icon"><PackageCheck size={31} /></div><h2>DVR-2026-001.EPK</h2><p>Reproducible local evidence package</p><div className="package-stats"><div><span>Package size</span><strong>4.83 TB</strong></div><div><span>Artifacts</span><strong>312</strong></div><div><span>Manifest</span><strong>v1.4</strong></div><div><span>Final hash</span><strong>9c4e…a11f</strong></div></div><button className="full-ghost" onClick={() => toast.success("Evidence package download started")}><Download size={14} /> Download package manifest</button><button className="full-ghost" onClick={() => onNavigate("Reports")}><FileText size={14} /> Open final report</button></section></div><section className="glass-panel transfer-panel"><SectionHeader eyebrow="EVIDENCE TRANSFER" title="Transfer history" detail="Record every handoff with sender, recipient, purpose, and package hash." action="Record transfer" onAction={() => toast.success("Transfer form opened")} /><div className="transfer-row"><div className="avatar">E</div><div><strong>examiner01 → legal-review</strong><span>09 Sep 2026 · 11:32 UTC · Read-only package</span></div><code>9c4e…a11f</code><StatusPill tone="lime">Verified</StatusPill></div></section></div>;
}

export default function Home({ activeView, onNavigate, activeCase }: HomeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const view = useMemo(() => {
    switch (activeView) {
      case "SCAR Flow": return <ScarFlowView onNavigate={onNavigate} />;
      case "Cases": return <CasesView onNavigate={onNavigate} />;
      case "Evidence Intake": return <EvidenceIntake onNavigate={onNavigate} />;
      case "Acquisition": return <Acquisition onNavigate={onNavigate} />;
      case "Discovery": return <DiscoveryView onNavigate={onNavigate} />;
      case "Recordings": return <RecordingsView onNavigate={onNavigate} />;
      case "Recovery Lab": return <RecoveryLab onNavigate={onNavigate} />;
      case "Timeline": return <TimelineView onNavigate={onNavigate} />;
      case "Integrity": return <IntegrityView onNavigate={onNavigate} />;
      case "Compatibility": return <CompatibilityView onNavigate={onNavigate} />;
      case "AI Analytics": return <AnalyticsView onNavigate={onNavigate} />;
      case "Reports": return <ReportsView onNavigate={onNavigate} />;
      case "Finalization": return <FinalizationView onNavigate={onNavigate} />;
      case "SOP & Validation": return <SopView onNavigate={onNavigate} />;
      default: return <ReferenceDashboard onNavigate={onNavigate} />;
    }
  }, [activeView, onNavigate]);

  const isElectron = typeof window !== "undefined" && Boolean((window as any).electronAPI?.isElectron);

  return <div className="app-shell"><div className="grain" /><aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}><div className="brand"><div className="brand-mark"><ShieldCheck size={20} /></div>{sidebarOpen && <div className="brand-copy"><strong>SCAR</strong><span>FORENSIC ENTERPRISE</span></div>}<button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <Menu size={17} /> : <ChevronRight size={17} />}</button></div><div className="case-switcher"><div className="case-avatar">D1</div>{sidebarOpen && <div className="case-copy"><span>ACTIVE CASE</span><strong>{activeCase?.id || "DVR-2026-001"}</strong></div>}<ChevronDown size={14} className="muted-icon" /></div><nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${activeView === item.label ? "active" : ""}`} onClick={() => onNavigate(item.label)} title={item.label}><Icon size={17} />{sidebarOpen && <span>{item.label}</span>}{sidebarOpen && item.label === "Recovery Lab" && <span className="nav-badge">36</span>}</button>; })}</nav><div className="sidebar-bottom">{sidebarOpen && <div className="system-status"><span className="status-dot" />System nominal<span>v0.1.0</span></div>}<button className="nav-item" onClick={() => toast.info("Settings panel is available in the full desktop build")}><Settings2 size={17} />{sidebarOpen && <span>Settings</span>}</button><div className="examiner-card"><div className="avatar">E</div>{sidebarOpen && <div><strong>{activeCase?.examiner || "examiner01"}</strong><span>Forensic examiner</span></div>}<MoreHorizontal size={16} className="muted-icon" /></div></div></aside><main className={`main-content ${sidebarOpen ? "with-sidebar" : "wide"}`}><header className="topbar"><div className="breadcrumbs"><span>Case workspace</span><ChevronRight size={13} /><strong>{activeView}</strong></div><div className="topbar-actions"><div className="global-search"><Search size={15} /><input placeholder="Search evidence, events…" /><kbd>⌘ K</kbd></div><button className="icon-button notification"><Bell size={17} /><i /></button><div className="top-avatar">E</div></div></header><div className="content-scroll">{view}</div><footer className="statusbar"><span><span className="status-dot" /> All systems operational</span><span>{isElectron ? "Electron Linux Desktop Mode" : "Local workspace · Read-only source policy enabled"}</span><span>SCAR <b>0.1.0</b> {isElectron ? "(Linux Desktop)" : ""}</span></footer></main></div>;
}

