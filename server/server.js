import express from "express";
import cors from "cors"; //conneting to the frontend
import "dotenv/config" ; //loading environment variables
import connectDB from "./configs/db.js"; //connecting to the database
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";


const app = express();

app.use(clerkMiddleware())

await connectDB();//connecting to the database

//Middleware The middleware checks or prepares the request before it reaches the route.
app.use(express.json());
app.use(cors());

//Routes
app.get("/", (req, res) => {
  res.send("Server is live");
});
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));



export default app;