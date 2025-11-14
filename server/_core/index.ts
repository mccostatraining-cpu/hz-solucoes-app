// Log imediato para confirmar que o arquivo está sendo executado
console.log("========================================");
console.log("🚀 SERVER FILE LOADED - Starting...");
console.log("========================================");

// Attempt to load .env in development without failing if not present
try {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import("dotenv/config");
  console.log("[Env] dotenv/config loaded (if present)");
} catch (error) {
  console.warn("[Env] Failed to load dotenv/config (this may be expected in production)", error);
}

console.log("[Server] Importing express...");
import express from "express";
console.log("[Server] Express imported");

console.log("[Server] Importing http...");
import { createServer } from "http";
console.log("[Server] HTTP imported");

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
    console.log("========================================");
    console.log("[Server] Starting server initialization...");
    console.log(`[Server] NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    console.log(`[Server] PORT: ${process.env.PORT || "not set (will use 3000)"}`);
    console.log("========================================");
    
    console.log("[Server] Creating Express app...");
    const app = express();
    console.log("[Server] Express app created");
    
    console.log("[Server] Creating HTTP server...");
    const server = createServer(app);
    console.log("[Server] HTTP server created");
    
    // Healthcheck endpoint - DEVE ser o primeiro endpoint registrado
    // Simplificado para responder rapidamente sem depender do banco
    console.log("[Server] Registering healthcheck endpoint...");
    app.get("/health", (_req, res) => {
      console.log("[Server] Healthcheck requested");
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "unknown",
      });
    });
    console.log("[Server] Healthcheck endpoint registered at /health");
    
    // Garantir que o healthcheck sempre responda, mesmo se houver erros
    app.get("/", (_req, res) => {
      res.status(200).json({ status: "ok", message: "Server is running" });
    });
    
    // INICIAR O SERVIDOR IMEDIATAMENTE para que o healthcheck funcione
    const port = Number(process.env.PORT) || 3000;
    console.log(`[Server] Starting server on port ${port}...`);
    console.log(`[Server] Binding to 0.0.0.0:${port}...`);
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error("[Server] Timeout waiting for server to start");
        reject(new Error("Server start timeout"));
      }, 10000); // 10 segundos timeout
      
      server.listen(port, "0.0.0.0", () => {
        clearTimeout(timeout);
        console.log("========================================");
        console.log(`✅ Server running on http://0.0.0.0:${port}/`);
        console.log(`✅ Healthcheck available at http://0.0.0.0:${port}/health`);
        console.log("========================================");
        resolve();
      });
      
      server.on("error", (error: NodeJS.ErrnoException) => {
        clearTimeout(timeout);
        if (error.code === "EADDRINUSE") {
          console.error(`❌ Port ${port} is already in use`);
        } else {
          console.error("❌ Server error:", error);
        }
        reject(error);
      });
    });
    
    // Agora que o servidor está rodando, carregar e configurar o resto de forma lazy
    console.log("[Server] Loading additional modules...");
    
    // Configure body parser with safer default limits
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ limit: "5mb", extended: true }));
    console.log("[Server] Body parsers configured (5mb limit)");
    
    // Carregar módulos de forma lazy para não travar a inicialização
    try {
      validateEnv();
      
      // OAuth callback under /api/oauth/callback
      try {
        const { registerOAuthRoutes } = await import("./oauth");
        registerOAuthRoutes(app);
        console.log("[Server] OAuth routes registered");
      } catch (error) {
        console.warn("[Server] Failed to register OAuth routes:", error);
      }
      
      // WhatsApp webhook endpoint (Twilio)
      try {
        const { registerWhatsappWebhook } = await import("../whatsapp-webhook");
        registerWhatsappWebhook(app);
        console.log("[Server] WhatsApp webhook registered");
      } catch (error) {
        console.warn("[Server] Failed to register WhatsApp webhook:", error);
      }
      
      // tRPC API
      try {
        const { createExpressMiddleware } = await import("@trpc/server/adapters/express");
        const { appRouter } = await import("../routers");
        const { createContext } = await import("./context");
        
        app.use(
          "/api/trpc",
          createExpressMiddleware({
            router: appRouter,
            createContext,
          })
        );
        console.log("[Server] tRPC API registered");
      } catch (error) {
        console.warn("[Server] Failed to register tRPC API:", error);
      }
      
      // development mode uses Vite, production mode uses static files
      // Default to production if NODE_ENV is not set (Railway production)
      const isDevelopment = process.env.NODE_ENV === "development";
      if (isDevelopment) {
        try {
          console.log("[Server] Setting up Vite for development...");
          const { setupVite } = await import("./vite");
          await setupVite(app, server);
          console.log("[Server] Vite setup complete");
        } catch (error) {
          console.warn("[Server] Failed to setup Vite:", error);
        }
      } else {
        try {
          console.log("[Server] Setting up static file serving for production...");
          const { serveStatic } = await import("./vite");
          serveStatic(app);
          console.log("[Server] Static file serving configured");
        } catch (error) {
          console.warn("[Server] Failed to setup static files:", error);
        }
      }
    } catch (error) {
      console.error("[Server] Error loading additional modules:", error);
      // Não falhar - o servidor já está rodando e o healthcheck funciona
    }
    

    const shutdown = async (signal: string) => {
      console.log(`[Server] Received ${signal}, shutting down...`);
      try {
        server.close(() => {
          console.log("[Server] HTTP server closed");
        });
        try {
          const { closeDb } = await import("../db");
          await closeDb();
          console.log("[Server] Database pool closed");
        } catch (error) {
          console.warn("[Server] Error closing database:", error);
        }
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

console.log("[Server] Calling startServer()...");
startServer().catch((error) => {
  console.error("========================================");
  console.error("❌ FAILED TO START SERVER");
  console.error("========================================");
  console.error("Error:", error);
  console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");
  process.exit(1);
});
