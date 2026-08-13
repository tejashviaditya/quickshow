import { clerkClient, getAuth } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movies from "../models/Movies.js";


export const getUserBookings = async (req, res) => {
    try {
        let user;
        try {
            user = getAuth(req)?.userId;
        } catch (e) {
            user = req.auth?.userId;
        }
        const bookings = await Booking.find({ user, isHidden: { $ne: true } }).populate("show").populate({path:"show"
            ,populate:{path:"movie"}}).sort({createdAt:-1}); //sorting the bookings in descending order of createdAt
            res.json({success:true,bookings});
        }
    catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export const hideBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        let userId;
        try {
            userId = getAuth(req)?.userId;
        } catch (e) {
            userId = req.auth?.userId;
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.user !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to remove this booking" });
        }

        booking.isHidden = true;
        await booking.save();

        res.json({ success: true, message: "Booking removed from recent bookings list" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const hideBookingsBulk = async (req, res) => {
    try {
        const { bookingIds } = req.body;
        if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
            return res.json({ success: false, message: "No booking IDs provided" });
        }

        let userId;
        try {
            userId = getAuth(req)?.userId;
        } catch (e) {
            userId = req.auth?.userId;
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const result = await Booking.updateMany(
            { _id: { $in: bookingIds }, user: userId },
            { $set: { isHidden: true } }
        );

        res.json({
            success: true,
            message: `Successfully removed ${result.modifiedCount} bookings`
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api controller function to add favorite movie in clerk user metadata

export const addFavorite= async (req,res) => {

    try {
            const {movieId} = req.body;
            const auth = getAuth(req);
            const userId = auth?.userId;

            const user = await clerkClient.users.getUser(userId);

            if(!user.privateMetadata.favorites){
                user.privateMetadata.favorites=[];
            }
            if(!user.privateMetadata.favorites.includes(movieId)) {
                user.privateMetadata.favorites.push(movieId);
            }
            else{
                user.privateMetadata.favorites=user.privateMetadata.favorites.filter(item=>item!==movieId);//removing the movie from favorites if it already exists
            }
            await clerkClient.users.updateUser(userId,{privateMetadata:user.privateMetadata});
            res.json({success:true,message:"Favorite movie updated successfully"});

    }
    catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}   
//fundtion to see our favorite movies
export const getFavorites = async (req,res) => {
    try {
        const auth = getAuth(req);
        const userId = auth?.userId;
        const user = await clerkClient.users.getUser(userId);

        console.log("USER ID:", userId);

        const favorites=user.privateMetadata.favorites || [];

       // get movie from the database
       const movies = await Movies.find({_id:{$in:favorites}})

        res.json({success:true,movies});


    }
    catch (error) {        
        console.log(error);
        res.json({success:false,message:error.message});
    }
}   
