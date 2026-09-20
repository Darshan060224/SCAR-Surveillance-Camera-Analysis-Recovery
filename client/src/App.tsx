import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import LaunchFlow, { type CaseRecord } from "@/components/LaunchFlow";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  const [activeView, setActiveView] = useState("Overview");
  const [activeCase, setActiveCase] = useState<CaseRecord | null>(null);
  const [ready, setReady] = useState(false);

  const enterWorkspace = (caseRecord: CaseRecord) => {
    setActiveCase(caseRecord);
    setReady(true);
    setActiveView("Overview");
  };

  return (
    <ThemeProvider defaultTheme="light">
      <Toaster position="bottom-right" />
      {!ready ? <LaunchFlow onReady={enterWorkspace} /> : <Home activeView={activeView} onNavigate={setActiveView} activeCase={activeCase} />}
    </ThemeProvider>
  );
}

export { };
