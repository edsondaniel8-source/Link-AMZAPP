import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();

const log = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
};

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://link-amzapp-*.vercel.app",
    "https://link-amzapp-production.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;
  if (
    origin &&
    allowedOrigins.some((allowed) => origin.includes(allowed.replace("*", "")))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

      console.log(logLine); // ← FIXED: Changed log() to console.log()
    }
  }); // ← FIXED: Added missing closing parenthesis for res.on("finish")

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
