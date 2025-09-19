import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "../routes/index.js";

dotenv.config();

console.log("Starting Vercel serverless function...");

const app = express();

app.use(
  cors({
    origin: [
      "https://techolution-frontend.vercel.app",
      "https://techolution-frontend-git-main-adityanehares-projects.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// db connection
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB Connected successfully.");
} catch (err) {
  console.error("Failed to connect to DB:", err);
}

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome to Techolution API",
    });
  } catch (err) {
    console.error("Error in root route:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// http:localhost:500/api-v1/
app.use("/api-v1", routes);

// error middleware
app.use((err, req, res, next) => {
  console.error("Error middleware:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

console.log("Vercel serverless function initialized.");

export default app;
