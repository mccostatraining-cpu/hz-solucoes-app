// Attempt to load .env in development without failing if not present
try {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import("dotenv/config");
  console.log("[Env] dotenv/config loaded (if present)");
} catch (error) {
  console.warn("[Env] Failed to load dotenv/config (this may be expected in production)", error);
}
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerWhatsappWebhook } from "../whatsapp-webhook";
import { getDb, closeDb } from "../db";

// Railway healthcheck: expose /health and bind exactly to process.env.PORT

function validateEnv() {
  const requiredVars = [
    // DB
    "DATABASE_URL",
    // Twilio / WhatsApp (opcionais, mas logamos se faltarem)
    // "TWILIO_AUTH_TOKEN",
  ];

  const missing = requiredVars.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.warn("[Env] Missing required variables:", missing.join(", "));
  }
}

async function startServer() {
  try {
    console.log("[Server] Starting server initialization...");
    console.log(`[Server] NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    console.log(`[Server] PORT: ${process.env.PORT || "not set (will use 3000)"}`);
    validateEnv();
    
    const app = express();
    const server = createServer(app);
    
    // Healthcheck endpoint - must be before static files
    app.get("/health", async (_req, res) => {
      const dbStatus = {
        connected: false,
      } as { connected: boolean; error?: string };
      try {
        const db = await getDb();
        dbStatus.connected = !!db;
        if (!db) {
          dbStatus.error = "Database not available";
        }
      } catch (error) {
        dbStatus.connected = false;
        dbStatus.error = error instanceof Error ? error.message : String(error);
      }

      res.status(200).json({
        status: "ok",
        env: process.env.NODE_ENV || "unknown",
        db: dbStatus,
      });
    });
    console.log("[Server] Healthcheck endpoint registered at /health");
    
    // Configure body parser with safer default limits
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ limit: "5mb", extended: true }));
    console.log("[Server] Body parsers configured (5mb limit)");
    
    // OAuth callback under /api/oauth/callback
    registerOAuthRoutes(app);
    console.log("[Server] OAuth routes registered");
    
    // WhatsApp webhook endpoint (Twilio)
    registerWhatsappWebhook(app);
    console.log("[Server] WhatsApp webhook registered");
    
    // tRPC API
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
    console.log("[Server] tRPC API registered");
    
    // development mode uses Vite, production mode uses static files
    // Default to production if NODE_ENV is not set (Railway production)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment) {
      console.log("[Server] Setting up Vite for development...");
      await setupVite(app, server);
      console.log("[Server] Vite setup complete");
    } else {
      console.log("[Server] Setting up static file serving for production...");
      serveStatic(app);
      console.log("[Server] Static file serving configured");
    }

    const port = Number(process.env.PORT) || 3000;
    console.log(`[Server] Starting server on port ${port}...`);
    
    server.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server running on http://0.0.0.0:${port}/`);
      console.log(`✅ Healthcheck available at http://0.0.0.0:${port}/health`);
    });
    
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${port} is already in use`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });

    const shutdown = async (signal: string) => {
      console.log(`[Server] Received ${signal}, shutting down...`);
      try {
        server.close(() => {
          console.log("[Server] HTTP server closed");
        });
        await closeDb();
        console.log("[Server] Database pool closed");
      } catch (error) {
        console.error("[Server] Error during shutdown:", error);
      } finally {
        process.exit(0);
      }
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed during server initialization:", error);
    throw error;
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
