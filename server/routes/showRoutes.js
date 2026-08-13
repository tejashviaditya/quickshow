import express from "express"; // for making routes and server
import { addShow } from "../controller/showController.js"; 

import { getNowPlayingMovies,getShows,getShow } from "../controller/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router(); // we are making a router from the express router means big router

showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies); //getNowPlayingMovies is the function which is called when we call the route

showRouter.post("/add",protectAdmin, addShow); //addShow is the function which is called when we call the route

showRouter.get("/all",getShows); //getShows is the function which is called when we call the route
showRouter.get("/:movieId",getShow); //getShow is the function which is called when we call the route
export default showRouter;