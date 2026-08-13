import { Inngest } from "inngest";
import User from "../models/User.js";

//create client to send and receive events
export const inngest = new Inngest({
  id: "movie-ticket-booking"
});

//inngest function to save user data to a database

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }]
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address || '',
      name,
      image: image_url || ''
    };

    await User.create(userData);
  }
);


const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }]
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);


const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-with-clerk",
    triggers: [{ event: "clerk/user.updated" }]
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address || '',
      name,
      image: image_url || ''
    };

    await User.findByIdAndUpdate(id, userData);
  }
);


export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate
];