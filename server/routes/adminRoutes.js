import express from "express"; // for making routes and server
import { protectAdmin } from "../middleware/auth.js";
import { isAdmin,getDashboardData,getAllShows,
  getAllBookings } from "../controller/adminController.js";


const adminRouter = express.Router(); // we are making a router from the express router means big router
adminRouter.get("/is-admin", protectAdmin, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-shows", protectAdmin, getAllShows);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);


export default adminRouter;
