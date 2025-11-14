// server/_core/index.ts
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "../node_modules/@trpc/server/dist/adapters/express.mjs";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../server/routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerWhatsappWebhook } from "../server/whatsapp-webhook";
try {
  import("dotenv/config");
} catch {
}
async function startServer() {
  try {
    console.log("Starting server initialization...");
    console.log(`NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
    console.log(`PORT: ${process.env.PORT || "not set (will use 3000)"}`);
    const app = express();
    const server = createServer(app);
    app.get("/health", (_req, res) => {
      res.status(200).send("OK");
    });
    console.log("Healthcheck endpoint registered at /health");
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    console.log("Body parsers configured");
    registerOAuthRoutes(app);
    console.log("OAuth routes registered");
    registerWhatsappWebhook(app);
    console.log("WhatsApp webhook registered");
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext
      })
    );
    console.log("tRPC API registered");
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
    const port = Number(process.env.PORT) || 3e3;
    console.log(`Starting server on port ${port}...`);
    server.listen(port, "0.0.0.0", () => {
      console.log(`\u2705 Server running on http://0.0.0.0:${port}/`);
      console.log(`\u2705 Healthcheck available at http://0.0.0.0:${port}/health`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`\u274C Port ${port} is already in use`);
      } else {
        console.error("\u274C Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("\u274C Failed during server initialization:", error);
    throw error;
  }
}
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
