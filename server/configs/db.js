import mongoose from "mongoose"; //ye nodejs ko mongo db se connect krwa rhi h




const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("MongoDB connected"));
        mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err.message));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`, {
            serverSelectionTimeoutMS: 5000 // Fail fast if database is unreachable (5 seconds instead of 30 seconds)
        });
    }
    catch (error) {
        console.error("Failed to connect to MongoDB on startup:", error.message);
        throw error; // Rethrow the error to prevent the server from starting in a broken state
    }
}

export default connectDB;