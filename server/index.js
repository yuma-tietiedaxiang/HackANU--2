const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const invoicesDir = path.resolve(__dirname, "..", "src", "assets", "invoices");
const publicDir = path.resolve(__dirname, "..", "public");
if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, invoicesDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Upload invoices
app.post("/api/upload", upload.array("files", 50), (req, res) => {
  res.json({ uploaded: req.files.map((f) => f.filename) });
});

// List invoices
app.get("/api/invoices", (req, res) => {
  const files = fs
    .readdirSync(invoicesDir)
    .filter((f) => /\.(png|jpg|jpeg|tiff|bmp|pdf)$/i.test(f));
  res.json({ files });
});

// Delete an invoice
app.delete("/api/invoices/:file", (req, res) => {
  const filePath = path.join(invoicesDir, req.params.file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ ok: true });
  }
  res.status(404).json({ ok: false, error: "Not found" });
});

// Process invoices and regenerate dashboard JSON
app.post("/api/process", (req, res) => {
  const scriptPath = path.resolve(
    __dirname,
    "..",
    "src",
    "invoiceDashboard.py"
  );
  const py = spawn("python3", [scriptPath], {
    cwd: path.resolve(__dirname, ".."),
  });

  let stdout = "";
  let stderr = "";
  py.stdout.on("data", (d) => {
    stdout += d.toString();
  });
  py.stderr.on("data", (d) => {
    stderr += d.toString();
  });
  py.on("close", (code) => {
    if (code === 0) {
      return res.json({ ok: true, log: stdout.trim() });
    }
    res.status(500).json({ ok: false, code, error: stderr || stdout });
  });
});

// Scenario simulation via Python Gemini script
app.post("/api/simulate", (req, res) => {
  const scriptPath = path.resolve(__dirname, "..", "scenario", "generate.py");
  const py = spawn("python3", [scriptPath], {
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env },
  });

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (d) => {
    stdout += d.toString();
  });
  py.stderr.on("data", (d) => {
    stderr += d.toString();
  });

  // Send JSON body to Python stdin
  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    return res.status(400).json({ ok: false, error: "Invalid request body" });
  }

  // Optional timeout (65s)
  const timeoutMs = 65000;
  const timeout = setTimeout(() => {
    py.kill("SIGKILL");
  }, timeoutMs);

  py.on("close", (code) => {
    clearTimeout(timeout);
    if (code === 0) {
      try {
        const parsed = JSON.parse(stdout.trim());
        return res.json(parsed);
      } catch (e) {
        return res.status(500).json({
          ok: false,
          error: "Failed to parse Python output",
          raw: stdout.trim(),
        });
      }
    }
    res.status(500).json({ ok: false, code, error: stderr || stdout });
  });
});

// Fetch current dashboard JSON
app.get("/api/dashboard", (req, res) => {
  const jsonPath = path.join(publicDir, "invoice-dashboard.json");
  if (!fs.existsSync(jsonPath))
    return res.status(404).json({ ok: false, error: "dashboard not found" });
  res.sendFile(jsonPath);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
