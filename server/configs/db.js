import mongoose from "mongoose";



const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("MongoDB connected")) //only event to check if the database is connected on is used to listen to the event
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`) //connecting to the database and await is used to first it is connected to database then it will continue to the next line
    }
    catch (error) {
        console.log(error)
    }
}

export default connectDB;