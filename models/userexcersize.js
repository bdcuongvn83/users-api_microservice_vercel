import mongoose from "mongoose";

const userExSchema = new mongoose.Schema({
  //username: { type: String, required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String, required: false },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const UserExcersizeModel = mongoose.model(
  "UserExcercise",
  userExSchema,
  "userexcersize"
);

export default UserExcersizeModel;
