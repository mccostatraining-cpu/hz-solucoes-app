import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

export async function setupVite(app: Express, server: Server) {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const distPath = path.resolve(__dirname, "../..", "dist-client");
  
  console.log(`Checking for static files in: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.warn(
      `⚠️  Could not find the build directory: ${distPath}`
    );
    console.warn("⚠️  Static files will not be served, but API routes will still work");
    // Don't return - let the server start anyway, just without static files
    // Add a catch-all that returns 404 for non-API routes
    app.use("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path === "/health") {
        return next();
      }
      res.status(404).json({ error: "Static files not found. Build may have failed." });
    });
    return;
  }

  console.log(`✅ Found static files directory: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  // but skip API routes and healthcheck
  app.use("*", (req, res, next) => {
    // Skip if it's an API route or healthcheck
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "index.html not found" });
    }
  });
}
