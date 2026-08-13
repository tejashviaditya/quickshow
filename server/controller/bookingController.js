//function to check availability of seats for a particular show
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import { getAuth } from "@clerk/express";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_k9G7r5H2WfLpQ3",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "8oR4vE1sLpQ2XzW7yN8vM3aB"
});

const checkAvailability = async (showId,selectedSeats) => {
    try {
        const showData = await Show.findById(showId); //getting the show details from the database
        if(!showData)
            return false;

            const occupiedSeats = showData.occupiedSeats; //getting the occupied seats from the show details

          const isAnySeatTaken=selectedSeats.some(seat=>occupiedSeats[seat]); //checking if any seat is taken if yes then return false

          return !isAnySeatTaken;
}
catch (error) {
    console.log(error);
    return false;
}
}

//function to create a booking for a particular show
export const CreateBooking = async (req,res) => {
    try {
        let userId;
        try {
            userId = getAuth(req)?.userId;
        } catch (e) {
            userId = req.auth?.userId;
        }
        if (!userId) {
            return res.json({ success: false, message: 'Unauthorized. Please log in to book tickets.' });
        }
        const {showId,selectedSeats} = req.body; //getting the showId and selected seats from the request body
        const {origin} = req.headers; //getting the origin from the request headers

        //check if the seat is available for the selected show
        const isAvailable = await checkAvailability(showId,selectedSeats);
        if(!isAvailable){
            return res.json({success:false,message:"Seat is not available"});
        }

        //get the show details from the database
        const showData = await Show.findById(showId).populate("movie"); //getting the show details from the database and populating the movie details

        const bookingAmount = showData.showPrice * selectedSeats.length;

        //create a booking for the show
        const booking = await Booking.create({
            user:userId,
            show:showId,
            amount:bookingAmount, //calculating the amount for the booking
            bookedSeats:selectedSeats,
            isPaid: false
        });

        // Initialize Razorpay Order
        const options = {
            amount: bookingAmount * 100, // in paise
            currency: "INR",
            receipt: booking._id.toString()
        };
        const order = await razorpay.orders.create(options);

        // Save order id to booking
        booking.razorpayOrderId = order.id;
        await booking.save();

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat]=userId; //updating the occupied seats in the show details
        });
        showData.markModified("occupiedSeats"); //marking the show details as modified

        await showData.save(); //saving the show details in the database

        res.json({
            success:true,
            message:"Booking created. Proceed to payment.",
            booking,
            order,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    }
    catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// Verification function for Razorpay payment
export const VerifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "8oR4vE1sLpQ2XzW7yN8vM3aB")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
            res.json({ success: true, message: "Payment verified and booking successful." });
        } else {
            res.json({ success: false, message: "Payment verification failed. Invalid signature." });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
 
export const getOccupiedSeats = async (req,res) => {
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId); //getting the show details from the database
         
        const occupiedSeats = Object.keys(showData.occupiedSeats); //getting the occupied seats from the show details
        res.json({success:true,occupiedSeats});
    }
    catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}   

export const getShowPrice = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        if (!showData) return res.json({ success: false, message: 'Show not found' });
        res.json({ success: true, showPrice: showData.showPrice });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
