import express from "express"; // for making routes and server
import { getUserBookings, hideBooking, hideBookingsBulk } from "../controller/userController.js";
import { getFavorites,addFavorite } from "../controller/userController.js";


const userRouter = express.Router(); // we are making a router from the express router means big router

userRouter.get("/bookings", getUserBookings);
userRouter.post("/bookings/hide/:bookingId", hideBooking);
userRouter.post("/bookings/hide-bulk", hideBookingsBulk);
userRouter.post("/update-favorite",addFavorite);
userRouter.get("/favorite",getFavorites);


export default userRouter;


