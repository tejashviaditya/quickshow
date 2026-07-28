import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // this is the schema for the user

 _id:{ type:String, required:true},
 name:{ type:String, required:true},
 email:{ type:String, required:true},
 image:{ type:String, required:true},
 

})
//this is the model for the user using the schema
const User = mongoose.model("User", userSchema);

export default User; //we will get user data from clerk 