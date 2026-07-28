import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//Innject function to save user data in database
const syncUserCreation = inngest.createFunction(
   { _id: "sync-User-from-clerk"},

   { event: "clerk/user.created" }, // Listen for the clerk/user.created event from Clerk
   async ({event}) => {
    const {id,first_name,last_name,email_addresses,image_url} = event.data;
    const userData={
        _id:id,
        email:email_addresses[0].email_address,
        name: first_name+" "+last_name,
        image:image_url
    }
    await User.create(userData);
   }


)
// Inngect function to delete user data from database
const syncUserDeletion = inngest.createFunction(
    { _id: "delete-User-with-clerk"},
    { event: "clerk/user.deleted" }, // Listen for the clerk/user.deleted event from Clerk
    async (event) => {
        const {id} = event.data;
        await User.findByIdAndDelete(id);
        
    }


)

//Inngest function to update user data in database
const syncUserUpdate = inngest.createFunction(
    { _id: "update-User-with-clerk"},
    { event: "clerk/user.updated" }, // Listen for the clerk/user.updated event from Clerk
    async (event) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data;
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name: first_name+" "+last_name,
            image:image_url
        }
        await User.findByIdAndUpdate(id,userData);
        
    }

)

// Create an empty array where we'll export future Inngest functions
export const functions = [ syncUserCreation,syncUserDeletion ];
