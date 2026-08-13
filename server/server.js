import express from "express";
import cors from "cors"; //conneting to the frontend
import "dotenv/config" ; //loading environment variables
import connectDB from "./configs/db.js"; //connecting to the database
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";



const app = express();
const port = 3000;

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

app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter); //user routes for getting the user bookings and adding favorite movies


//we r usning postman to test the server

app.listen(port,()=>console.log(`Server is running on port http://localhost:${port}`));


export default app;