import express from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js";

import noteRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/auth.js"

import dotenv from "dotenv";
import rateLimiter from "../middleware/rateLimitter.js";

import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

app.use(express.json());
app.use("/api", rateLimiter);

app.use("/api/notes", noteRoutes);
app.use("/api/users", authRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendDist));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

const server = connectDB().then(() => {
    return app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});

const gracefulShutdown = async () => {
    console.log("Shutting down server...");
    await mongoose.connection.close();
    process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);