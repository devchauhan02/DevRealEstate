import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "https://lh3.googleusercontent.com/a/ACg8ocL6yjs9yPH0lVXs3cSYfot37bnYG5ciSRGRJS-3farM6c5s5key=s96-c",
  },

}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;  

