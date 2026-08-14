import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Use Render's dynamic PORT in production, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

app.use(clerkMiddleware());

await connectDB();

// CORS — allow local dev + deployed Vercel frontend
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://quickshow-bice-mu.vercel.app",
    process.env.FRONTEND_URL, // optional override via Render env var
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, server-to-server)
        // Also allow any *.vercel.app preview deployment of this project
        if (!origin || allowedOrigins.includes(origin) || /^https:\/\/quickshow.*\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(null, false); // 403, not 500
        }
    },
    credentials: true,
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server is live");
});

// Inngest
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

export default app;