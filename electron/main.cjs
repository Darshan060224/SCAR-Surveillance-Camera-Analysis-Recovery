const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const http = require("http");

let mainWindow = null;
let expressAppInstance = null;

const PORT = process.env.PORT || 3000;
const DEV_URL = process.env.VITE_DEV_SERVER_URL || `http://localhost:${PORT}`;

async function startServerIfNeeded() {
  return new Promise((resolve) => {
    // Check if server is already running
    const req = http.get(`http://localhost:${PORT}/api/video/info`, (res) => {
      console.log(`[Electron] Connected to active server on port ${PORT}`);
      resolve(true);
    });

    req.on("error", async () => {
      console.log(`[Electron] Starting embedded Express forensic server on port ${PORT}...`);
      try {
        // Dynamically import tsx / compiled server api router
        const { createApiRouter } = require("../server/api.js");
        const express = require("express");
        const app = express();
        app.use("/api", createApiRouter());

        // Serve dist/public static files if built
        const staticPath = path.resolve(__dirname, "..", "dist", "public");
        app.use(express.static(staticPath));
        app.get("*", (_req, res) => {
          res.sendFile(path.join(staticPath, "index.html"));
        });

        expressAppInstance = app.listen(PORT, () => {
          console.log(`[Electron] Embedded Express server listening on http://localhost:${PORT}/`);
          resolve(true);
        });
      } catch (err) {
        console.error("[Electron] Error starting embedded server:", err);
        resolve(false);
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    title: "SCAR — Surveillance Camera Analysis & Recovery (Linux Desktop)",
    backgroundColor: "#090d16",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(DEV_URL);
  } else {
    mainWindow.loadURL(DEV_URL);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServerIfNeeded();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (expressAppInstance) {
      expressAppInstance.close();
    }
    app.quit();
  }
});
