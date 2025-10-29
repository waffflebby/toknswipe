// Custom Express server for Replit Auth + Next.js hybrid setup
import express from "express";
import { createServer } from "http";
import next from "next";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "5000", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  try {
    await app.prepare();
    const server = express();

    // Trust proxy for Replit environment
    server.set("trust proxy", 1);

    // Set up authentication (includes session middleware)
    await setupAuth(server);

    // Auth API route - get current user
    server.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });

    // All other routes go to Next.js
    server.use((req, res) => {
      return handle(req, res);
    });

    const httpServer = createServer(server);

    httpServer.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Auth routes: /api/login, /api/logout, /api/callback`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
