// Attempt to load .env in development without failing if not present
try {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import("dotenv/config");
} catch {}
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerWhatsappWebhook } from "../whatsapp-webhook";

// Railway healthcheck: expose /health and bind exactly to process.env.PORT

async function startServer() {
  try {
    console.log("Starting server initialization...");
    console.log(`NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    console.log(`PORT: ${process.env.PORT || "not set (will use 3000)"}`);
    
    const app = express();
    const server = createServer(app);
    
    // Healthcheck endpoint - must be before static files
    app.get("/health", (_req, res) => {
      res.status(200).send("OK");
    });
    console.log("Healthcheck endpoint registered at /health");
    
    // Configure body parser with larger size limit for file uploads
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    console.log("Body parsers configured");
    
    // OAuth callback under /api/oauth/callback
    registerOAuthRoutes(app);
    console.log("OAuth routes registered");
    
    // WhatsApp webhook endpoint (Twilio)
    registerWhatsappWebhook(app);
    console.log("WhatsApp webhook registered");
    
    // tRPC API
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
    console.log("tRPC API registered");
    
    // development mode uses Vite, production mode uses static files
    // Default to production if NODE_ENV is not set (Railway production)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment) {
      console.log("Setting up Vite for development...");
      await setupVite(app, server);
      console.log("Vite setup complete");
    } else {
      console.log("Setting up static file serving for production...");
      serveStatic(app);
      console.log("Static file serving configured");
    }

    const port = Number(process.env.PORT) || 3000;
    console.log(`Starting server on port ${port}...`);
    
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
  } catch (error) {
    console.error("❌ Failed during server initialization:", error);
    throw error;
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
