import express from "express"; // for making routes and server
import { CreateBooking, getOccupiedSeats, getShowPrice, VerifyPayment } from "../controller/bookingController.js";

const bookingRouter = express.Router(); // we are making a router from the express router means big router

bookingRouter.post("/create",  CreateBooking); //CreateBooking is the function which is called when we call the route  
bookingRouter.post("/verify-payment", VerifyPayment); // VerifyPayment is called after payment completion to verify Razorpay signature
bookingRouter.get("/seats/:showId",  getOccupiedSeats); //getOccupiedSeats is the function which is called when we call the route
bookingRouter.get("/show-price/:showId", getShowPrice); // returns the showPrice for a given showId

export default bookingRouter;