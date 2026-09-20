import { exec } from "child_process";
import express, { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const DEFAULT_VIDEO_PATH = "/home/da24/Desktop/SCAR/16097301_2160_3840_24fps.mp4";
export const FRAMES_DIR = path.join(process.cwd(), "extracted_frames");

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

export interface Detection {
  label: string;
  confidence: string;
  bbox: [number, number, number, number]; // [x%, y%, width%, height%]
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

let inMemoryFrames: FrameItem[] = [];

// Pre-populate simulated bounding boxes for the Amsterdam video frames based on known content
function generateDetectionsForTimestamp(second: number): Detection[] {
  const baseDetections: Detection[] = [];
  
  // Pedestrians and cyclists visible in the Amsterdam street video
  if (second >= 0) {
    baseDetections.push({
      label: "Person / Cyclist",
      confidence: `${(94 + (second % 5) * 1.1).toFixed(1)}%`,
      bbox: [28 + (second * 2) % 40, 64, 14, 22],
      tone: "lime",
    });
    baseDetections.push({
      label: "Bicycle",
      confidence: `${(91 + (second % 4) * 1.5).toFixed(1)}%`,
      bbox: [56 - (second * 3) % 30, 66, 16, 20],
      tone: "cyan",
    });
  }

  if (second % 2 === 0) {
    baseDetections.push({
      label: "Pedestrian Group",
      confidence: `${(96 - (second % 3)).toFixed(1)}%`,
      bbox: [10 + (second % 4) * 3, 65, 12, 18],
      tone: "violet",
    });
  }

  if (second % 3 === 0) {
    baseDetections.push({
      label: "Architecture Feature (Church Spire)",
      confidence: "99.1%",
      bbox: [35, 30, 24, 34],
      tone: "orange",
    });
  }

  return baseDetections;
}

export function createApiRouter(): Router {
  const router = Router();
  router.use(express.json());

  // GET /api/video - Stream video with HTTP 206 Range support
  router.get("/video", (req: Request, res: Response) => {
    const videoPath = (req.query.path as string) || DEFAULT_VIDEO_PATH;

    if (!fs.existsSync(videoPath)) {
      res.status(404).send("Video file not found");
      return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });

  // GET /api/video/info - Return metadata
  router.get("/video/info", async (req: Request, res: Response) => {
    const videoPath = (req.query.path as string) || DEFAULT_VIDEO_PATH;

    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ error: "Video file not found" });
      return;
    }

    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,width,height,r_frame_rate,nb_frames -of json "${videoPath}"`
      );
      const metadata = JSON.parse(stdout);
      res.json({
        path: videoPath,
        filename: path.basename(videoPath),
        metadata,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/extract-frames - Extract frames using FFmpeg
  router.post("/extract-frames", async (req: Request, res: Response) => {
    const videoPath = req.body?.path || DEFAULT_VIDEO_PATH;
    const fps = req.body?.fps || 1; // Default 1 frame per sec

    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ error: "Video file not found" });
      return;
    }

    try {
      // Clear previous frames
      const existing = fs.readdirSync(FRAMES_DIR);
      for (const file of existing) {
        if (file.endsWith(".jpg") || file.endsWith(".png")) {
          fs.unlinkSync(path.join(FRAMES_DIR, file));
        }
      }

      // Run FFmpeg frame extraction
      const outputPattern = path.join(FRAMES_DIR, "frame_%03d.jpg");
      await execAsync(`ffmpeg -y -i "${videoPath}" -vf "fps=${fps}" "${outputPattern}"`);

      // Read extracted files
      const files = fs.readdirSync(FRAMES_DIR).filter((f) => f.startsWith("frame_") && f.endsWith(".jpg")).sort();

      inMemoryFrames = files.map((filename, idx) => {
        const sec = idx / fps;
        const mm = String(Math.floor(sec / 60)).padStart(2, "0");
        const ss = String(Math.floor(sec % 60)).padStart(2, "0");
        const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, "0");
        const timestamp = `00:${mm}:${ss}.${ms}`;

        return {
          id: `frame-${idx + 1}`,
          filename,
          timestamp,
          timeSeconds: sec,
          url: `/api/frames/image/${filename}`,
          detections: generateDetectionsForTimestamp(sec),
          status: "analyzed",
        };
      });

      res.json({
        success: true,
        count: inMemoryFrames.length,
        frames: inMemoryFrames,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/frames - Get list of current frames
  router.get("/frames", (_req: Request, res: Response) => {
    // If no in-memory frames exist yet, try listing files from directory
    if (inMemoryFrames.length === 0 && fs.existsSync(FRAMES_DIR)) {
      const files = fs.readdirSync(FRAMES_DIR).filter((f) => f.startsWith("frame_") && f.endsWith(".jpg")).sort();
      inMemoryFrames = files.map((filename, idx) => {
        const sec = idx;
        const mm = String(Math.floor(sec / 60)).padStart(2, "0");
        const ss = String(Math.floor(sec % 60)).padStart(2, "0");
        return {
          id: `frame-${idx + 1}`,
          filename,
          timestamp: `00:${mm}:${ss}.000`,
          timeSeconds: sec,
          url: `/api/frames/image/${filename}`,
          detections: generateDetectionsForTimestamp(sec),
          status: "analyzed",
        };
      });
    }
    res.json({ frames: inMemoryFrames });
  });

  // DELETE /api/frames/:id - Delete specific frame ("delect that frame")
  router.delete("/frames/:id", (req: Request, res: Response) => {
    const frameId = req.params.id;
    const index = inMemoryFrames.findIndex((f) => f.id === frameId || f.filename === frameId);

    if (index === -1) {
      res.status(404).json({ error: "Frame not found" });
      return;
    }

    const [deleted] = inMemoryFrames.splice(index, 1);
    const filePath = path.join(FRAMES_DIR, deleted.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        // Ignore file deletion error if already missing
      }
    }

    res.json({ success: true, deletedId: deleted.id, remainingCount: inMemoryFrames.length });
  });

  // GET /api/frames/image/:filename - Serve frame images
  router.get("/frames/image/:filename", (req: Request, res: Response) => {
    const filePath = path.join(FRAMES_DIR, req.params.filename);
    if (!fs.existsSync(filePath)) {
      res.status(404).send("Frame image not found");
      return;
    }
    res.sendFile(filePath);
  });

  return router;
}
