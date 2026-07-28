Package	Purpose
express--	Creates the backend server and APIs.
cors-	Allows your frontend and backend to communicate if they're on different ports/domains.
dotenv-	Loads variables from a .env file (like API keys and database URLs).
mongoose-	Connects your Node.js app to MongoDB and helps manage data.
axios-	Makes HTTP requests to other APIs or servers.
cloudinary	Uploads and stores images/videos in the cloud.

 nodemon --save-dev --

 clerk-express--	Adds authentication to your Express app.
       in clerk middleware we are using clerkMiddleware() function to add authentication to our express app.
       we uses webhook-->a webhook is a way for Clerk to notify your backend automatically whenever something important happens, such as:
                        A user signs up
                            A user signs in
                        A user is deleted
                        A user's profile is updated
                        Why use Clerk webhooks?
                                                
                        You can automatically:
                        Save users in your own database
                        Send welcome emails
                        Create a shopping cart for new users
                        Create a user profile
                        Assign default roles
                        Log user activity
                        Sync data with other services
                                    
       Inngest--> is a platform for running background jobs, workflows, and event-driven functions. It lets you execute tasks asynchronously, outside the normal request-response cycle of your application.
        Think of it as a way to say:

       When this event happens, run these tasks in the background." send email ,create profile etc





 mongo atlas--	Provides a cloud-hosted MongoDB service.