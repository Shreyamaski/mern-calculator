import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDatabase } from "./config/db.js";
import calculationRoutes from "./routes/calculations.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
];

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      const isAllowedVercelOrigin = normalizedOrigin?.endsWith(".vercel.app");

      if (
        !origin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isAllowedVercelOrigin
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    }
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, message: "Calculator API is running." });
});

app.use("/api/calculations", calculationRoutes);

const startServer = async () => {
  try {
    await connectDatabase(process.env.MONGODB_URI);

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
