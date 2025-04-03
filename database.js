import mongoose from "mongoose";

//const MONGO_URI = "mongodb://localhost:27017/mydatabase"; // Thay "mydatabase" bằng tên database của bạn
const MONGO_URI =
  "mongodb+srv://bdcuongvn83:Ait123456@cluster0.6hlqiuj.mongodb.net/mydatabase?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
