import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Database, FolderOpen, HardDrive, LockKeyhole, MonitorCheck, ShieldCheck, Sparkles, UserRound, XCircle } from "lucide-react";
import { toast } from "sonner";

type LaunchStage = "boot" | "setup" | "login" | "start" | "new-case";
type CaseRecord = { id: string; name: string; examiner: string; description: string; createdAt: string };

type Props = { onReady: (caseRecord: CaseRecord) => void };

const checkItems = [
  ["Application configuration", "Local workspace settings", true],
  ["Database availability", "Browser-local case store ready", true],
  ["Evidence storage", "Choose a destination before acquisition", false],
  ["FFmpeg / ffprobe", "Optional until video analysis", false],
  ["Device access", "Requires the desktop helper", false],
];

export default function LaunchFlow({ onReady }: Props) {
  const [stage, setStage] = useState<LaunchStage>("boot");
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [caseName, setCaseName] = useState("");
  const [caseId, setCaseId] = useState("");
  const [examiner, setExaminer] = useState("");
  const [description, setDescription] = useState("");
  const [storagePath, setStoragePath] = useState("");
  const [cases, setCases] = useState<CaseRecord[]>(() => JSON.parse(localStorage.getItem("scar_cases") || "[]"));
  const [diagnostics, setDiagnostics] = useState(false);
  const setupComplete = localStorage.getItem("scar_setup_complete") === "true";

  useEffect(() => {
    if (stage !== "boot") return;
    const started = Date.now();
    const interval = window.setInterval(() => setProgress(Math.min(100, Math.round(((Date.now() - started) / 1350) * 100))), 80);
    const timer = window.setTimeout(() => setStage(setupComplete ? "login" : "setup"), 1450);
    return () => { window.clearInterval(interval); window.clearTimeout(timer); };
  }, [stage, setupComplete]);

  const currentCase = useMemo(() => cases[0], [cases]);
  const finishSetup = () => { if (!storagePath.trim()) { toast.error("Choose an evidence storage location before continuing"); return; } localStorage.setItem("scar_setup_complete", "true"); localStorage.setItem("scar_storage_path", storagePath); toast.success("SCAR initial configuration complete"); setStage("login"); };
  const signIn = () => { if (!username.trim() || !password.trim()) { toast.error("Enter your local examiner username and password"); return; } localStorage.setItem("scar_session", username.trim()); setExaminer(username.trim()); setStage("start"); };

  const createCase = () => { if (!caseName.trim() || !caseId.trim()) { toast.error("Case name and case ID are required"); return; } const record = { id: caseId.trim(), name: caseName.trim(), examiner: examiner || username || "examiner", description, createdAt: new Date().toLocaleDateString() }; const updated = [record, ...cases]; setCases(updated); localStorage.setItem("scar_cases", JSON.stringify(updated)); toast.success("Case created successfully"); onReady(record); };

  if (stage === "boot") return <div className="launch-screen"><div className="launch-card"><div className="launch-logo"><ShieldCheck size={34} /></div><div className="launch-wordmark">SCAR</div><div className="launch-subtitle">Surveillance Camera Analysis &amp; Recovery</div><div className="launch-caption">Digital Video Evidence Forensics Platform</div><div className="launch-progress"><span style={{ width: `${progress}%` }} /></div><div className="launch-status"><Sparkles size={14} /> Initializing local forensic workspace… <b>{progress}%</b></div></div></div>;

  if (stage === "setup") return <div className="launch-screen"><div className="setup-card"><div className="setup-brand"><div className="launch-logo"><ShieldCheck size={25} /></div><strong>SCAR</strong></div><div className="launch-eyebrow">FIRST-RUN WORKSPACE SETUP</div><h1>Welcome to SCAR</h1><p className="launch-lead">Before starting an investigation, configure the local forensic workspace.</p><label>Evidence storage<input value={storagePath} onChange={(e) => setStoragePath(e.target.value)} placeholder="/mnt/evidence" /><small>Choose the destination where case packages and forensic images will be stored.</small></label><div className="setup-info"><Database size={17} /><div><strong>Database</strong><span>Local browser workspace for this prototype · SQLite in the desktop build</span></div></div><button className="launch-primary" onClick={finishSetup}>Continue <ChevronRight size={16} /></button><button className="launch-text-button" onClick={() => setStage("login")}>Continue with limited functionality</button></div></div>;

  if (stage === "login") return (
    <div className="launch-screen">
      <div className="login-card">
        <div className="launch-logo"><ShieldCheck size={31} /></div>
        <div className="launch-wordmark">SCAR</div>
        <div className="launch-subtitle">Surveillance Camera Analysis &amp; Recovery</div>
        <div className="launch-caption">Local Forensic Workstation</div>
        <div className="login-fields">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Examiner username (e.g. demo_examiner)" autoFocus />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Local password (e.g. demo1234)" onKeyDown={(e) => e.key === "Enter" && signIn()} />
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
          <button className="launch-primary" onClick={signIn} style={{ marginTop: 0 }}>
            Sign in <ChevronRight size={16} />
          </button>
        </div>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "10px", color: "#64748b" }}>
          <span>Demo creds: <b>demo_examiner</b> / <b>demo1234</b></span>
        </div>
        <span className="prototype-note">Prototype local session · desktop build uses Argon2id-backed authentication</span>
      </div>
    </div>
  );

  if (stage === "new-case") return <div className="launch-screen"><div className="new-case-card"><div className="setup-brand"><div className="launch-logo"><FolderOpen size={24} /></div><strong>Create New Case</strong></div><p className="launch-lead">Create a case workspace before registering evidence.</p><div className="new-case-grid"><label>Case name *<input value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="Main Gate Incident" /></label><label>Case ID / Reference *<input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="CASE-2026-001" /></label><label>Examiner<input value={examiner || username} onChange={(e) => setExaminer(e.target.value)} /></label><label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Investigation description" /></label></div><div className="new-case-actions"><button className="launch-text-button" onClick={() => setStage("start")}>Cancel</button><button className="launch-primary" onClick={createCase}>Create case <ChevronRight size={16} /></button></div></div></div>;

  return <div className="start-screen"><div className="start-header"><div className="setup-brand"><div className="launch-logo"><ShieldCheck size={25} /></div><strong>SCAR</strong></div><button className="start-exit" onClick={() => { localStorage.removeItem("scar_session"); setStage("login"); }}>Sign out</button></div><div className="start-content"><div className="launch-eyebrow">CASE SELECTION</div><h1>Welcome back, {examiner || username}</h1><p className="launch-lead">What would you like to do?</p><div className="start-actions"><button onClick={() => setStage("new-case")}><div><FolderOpen size={31} /><strong>New Case</strong><span>Create a new investigation and begin evidence registration.</span></div><ChevronRight size={18} /></button><button disabled={!currentCase} onClick={() => currentCase && onReady(currentCase)}><div><MonitorCheck size={31} /><strong>Open Existing Case</strong><span>{currentCase ? `${currentCase.id} · ${currentCase.name}` : "No cases have been created on this workstation."}</span></div><ChevronRight size={18} /></button></div><section className="recent-case-panel"><div className="recent-case-heading"><span>Recent Cases</span><small>{cases.length} local case{cases.length === 1 ? "" : "s"}</small></div>{cases.length === 0 ? <div className="start-empty"><FolderOpen size={28} /><strong>No cases have been created on this workstation.</strong><span>Create a new case to get started.</span></div> : cases.map((item) => <button className="recent-case-row" key={item.id} onClick={() => onReady(item)}><div><strong>{item.id}</strong><span>{item.name}</span></div><small>{item.createdAt}</small><ChevronRight size={15} /></button>)}</section></div></div>;
}

export type { CaseRecord };
