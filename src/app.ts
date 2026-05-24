// External dependencies
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Fixly API is running" });
});

// Routes not found handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
