import express, { type Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { registerRoutes } from "./routes";

const app = express();

const log = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
};

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Simple upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({ 
    message: 'File uploaded successfully', 
    filename: req.file.filename,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// 🚨 ADD THESE BASIC ROUTES IMMEDIATELY 🚨
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? "Connected" : "Missing",
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "API is healthy",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json({
    users: [],
    message: "Users endpoint ready",
    total: 0,
  });
});

app.get("/api/auth", (req: Request, res: Response) => {
  res.json({
    auth: "Authentication endpoint ready",
    message: "Add authentication logic here",
  });
});

// Handle undefined routes - return JSON instead of HTML
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    message: "The requested endpoint does not exist",
    availableEndpoints: ["/health", "/api/health", "/api/users", "/api/auth"],
  });
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error("Error:", err);
  });

  // Backend API only - no static file serving
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`Backend API serving on port ${port}`);
  });
})();
