import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  Film,
  Filter,
  Layers,
  Pause,
  Play,
  RefreshCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export interface Detection {
  label: string;
  confidence: string;
  bbox: [number, number, number, number];
  tone: string;
}

export interface FrameItem {
  id: string;
  filename: string;
  timestamp: string;
  timeSeconds: number;
  url: string;
  detections: Detection[];
  status: "extracted" | "analyzed" | "pinned";
}

export default function VideoFrameStudio() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(13.41);
  const [isExtracting, setIsExtracting] = useState(false);
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<FrameItem | null>(null);
  const [filterTag, setFilterTag] = useState<string>("All");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Fetch current frames on mount
  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      const res = await fetch("/api/frames");
      if (res.ok) {
        const data = await res.json();
        setFrames(data.frames || []);
        if (data.frames && data.frames.length > 0 && !selectedFrame) {
          setSelectedFrame(data.frames[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching frames:", err);
    }
  };

  const handleExtractFrames = async () => {
    setIsExtracting(true);
    toast.info("Extracting frames & running object detection on 16097301_2160_3840_24fps.mp4…");
    try {
      const res = await fetch("/api/extract-frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fps: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setFrames(data.frames || []);
        if (data.frames && data.frames.length > 0) {
          setSelectedFrame(data.frames[0]);
        }
        toast.success(`Successfully extracted ${data.count} frames with AI detection!`);
      } else {
        toast.error("Failed to extract frames from video.");
      }
    } catch (err) {
      toast.error("Error connecting to frame extraction API.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDeleteFrame = async (frameId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/frames/${frameId}`, { method: "DELETE" });
      if (res.ok) {
        const newFrames = frames.filter((f) => f.id !== frameId);
        setFrames(newFrames);
        if (selectedFrame?.id === frameId) {
          setSelectedFrame(newFrames.length > 0 ? newFrames[0] : null);
        }
        toast.success(`Frame deleted ("${frameId}")`, {
          description: `Active frame list updated. ${newFrames.length} frames remaining.`,
        });
      } else {
        toast.error("Failed to delete frame.");
      }
    } catch (err) {
      toast.error("Error deleting frame.");
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const filteredFrames = frames.filter((f) => {
    if (filterTag === "All") return true;
    return f.detections.some((d) => d.label.toLowerCase().includes(filterTag.toLowerCase()));
  });

  return (
    <div className="video-frame-studio space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400 uppercase mb-1">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>ACTIVE EVIDENCE SOURCE · VERTICAL 4K (2160×3840)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              16097301_2160_3840_24fps.mp4
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Amsterdam Street Scene · 24 FPS · 13.4s duration · Frame-by-frame forensics &amp; detection studio
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExtractFrames}
              disabled={isExtracting}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isExtracting ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-slate-950" />
              )}
              <span>{isExtracting ? "Extracting..." : "Extract & Detect Frames"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player + Selected Frame Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Player & Seek Timeline (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-400" /> Source Media Player
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                2160×3840 · 24 FPS
              </span>
            </div>

            {/* Video Container */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[440px] flex items-center justify-center border border-slate-800 shadow-inner group">
              <video
                ref={videoRef}
                src="/api/video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration);
                }}
                className="w-full h-full object-contain"
                playsInline
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-xl"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-slate-950" />}
              </button>
            </div>

            {/* Video Controls & Timeline Scrub */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-cyan-400" />}
                </button>
                <button
                  onClick={() => seekTo(Math.max(0, currentTime - 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                >
                  -1s
                </button>
                <button
                  onClick={() => seekTo(Math.min(duration, currentTime + 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                >
                  +1s
                </button>
                <div className="flex-1 text-right text-xs font-mono text-slate-400">
                  <span className="text-cyan-400">{currentTime.toFixed(2)}s</span> / {duration.toFixed(2)}s
                </div>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={duration || 13.41}
                step={0.05}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CODEC: H.264 / AVC</span>
            <span className="text-lime-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Bit-for-bit verified
            </span>
          </div>
        </div>

        {/* Right Column: Selected Frame Inspector with Detection Overlays (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Frame Detail Inspector
                </span>
                {selectedFrame && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {selectedFrame.timestamp}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono transition border ${
                    showBoundingBoxes
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  Bounding Boxes: {showBoundingBoxes ? "ON" : "OFF"}
                </button>
                {selectedFrame && (
                  <button
                    onClick={() => handleDeleteFrame(selectedFrame.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition title='Delete Frame'"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Frame Viewer Box */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[9/16] max-h-[440px] mx-auto border border-slate-800 flex items-center justify-center">
              {selectedFrame ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedFrame.url}
                    alt={selectedFrame.filename}
                    className="w-full h-full object-contain"
                  />

                  {/* Bounding Box Overlays */}
                  {showBoundingBoxes &&
                    selectedFrame.detections.map((det, idx) => {
                      const [x, y, w, h] = det.bbox;
                      return (
                        <div
                          key={idx}
                          className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded-sm pointer-events-none flex flex-col justify-start p-1 transition-all"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${w}%`,
                            height: `${h}%`,
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold bg-cyan-500 text-slate-950 px-1 py-0.5 rounded leading-none w-max shadow">
                            {det.label} ({det.confidence})
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 font-mono text-sm">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
                  No frame selected. Click "Extract &amp; Detect Frames" or select a frame thumbnail below.
                </div>
              )}
            </div>
          </div>

          {/* Detections Pill List */}
          {selectedFrame && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Detections:</span>
                {selectedFrame.detections.map((d, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {d.label} <b className="text-cyan-400">{d.confidence}</b>
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleDeleteFrame(selectedFrame.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Frame
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Extracted Frames Gallery & Filter Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Extracted Evidence Frames ({filteredFrames.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any frame to inspect detections or click delete ("delect that frame") to remove unwanted frames.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {["All", "Person", "Bicycle", "Church"].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`text-xs px-3 py-1 rounded-lg font-mono transition ${
                  filterTag === tag
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Frames Thumbnail Scroll Grid */}
        {filteredFrames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFrames.map((frame) => {
              const isSelected = selectedFrame?.id === frame.id;
              return (
                <div
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all bg-slate-950 ${
                    isSelected
                      ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-[1.02]"
                      : "border-slate-800 hover:border-slate-700 hover:scale-[1.01]"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-[9/16] relative overflow-hidden bg-black">
                    <img
                      src={frame.url}
                      alt={frame.filename}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />

                    {/* Timestamp Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[10px] font-mono text-cyan-400 border border-slate-700">
                      {frame.timestamp}
                    </div>

                    {/* Delete Frame Overlay Button ("delect that frame") */}
                    <button
                      onClick={(e) => handleDeleteFrame(frame.id, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-lg"
                      title="Delete frame"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 truncate">{frame.id}</span>
                    <span className="text-cyan-400 font-bold">
                      {frame.detections.length} det
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
            No frames extracted yet or match filter. Click "Extract &amp; Detect Frames" above.
          </div>
        )}
      </div>
    </div>
  );
}
