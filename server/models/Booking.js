import mongoose from "mongoose";
//this is the schema for the booking

const bookingSchema = new mongoose.Schema({
    user:{ type: String, required: true, ref: "User" },
    show:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Show" },
    amount:{ type: Number, required: true },
    bookedSeats:{ type: Array, required: true },
    isPaid:{ type: Boolean, default: false },
    paymentLink:{ type: String },
    razorpayOrderId:{ type: String },
    isHidden:{ type: Boolean, default: false }
    
},{ timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
