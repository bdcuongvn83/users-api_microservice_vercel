import express from "express";
import shortid from "shortid";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserModel from "./models/user.js";
import connectDB from "./database.js"; // Import hàm kết nối MongoDB
import UserExcersizeModel from "./models/userexcersize.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

const userDatabase = {}; // Lưu trữ các id và Object
const userExcersize = []; // Lưu trữ các id và Excersize

// POST: /api/users
app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;

    console.log(req.body); // Kiểm tra URL nhận được

    const newUser = await createUser(username);

    // Trả về JSON chứa user
    return res
      .status(201)
      .json({ username: newUser.username, _id: newUser._id.toString() }); // Trả về JSON chứa user
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createUser = async (username) => {
  //await mongoose.connect("mongodb://localhost:27017/mydatabase");
  const newUser = new UserModel({ username: username });
  await newUser.save();

  console.log(newUser); // Sẽ có _id tự động sinh ra
  return newUser; // Trả về user đã tạo
};

class User {
  constructor(username, _id = "") {
    this.username = username;
    this._id = _id;
  }

  // Hàm mô phỏng việc tạo User với thông tin cơ bản
  static fromBasicInfo(username, _id) {
    return new User(username, _id);
  }
}

class UserExcersize {
  constructor(username, _id, description = "", duration = 0, date = "") {
    this.username = username;
    this._id = _id;
    this.description = description;
    this.duration = duration;
    this.date = date;
  }
  // Hàm mô phỏng việc tạo User với thông tin đầy đủ
  static fromFullInfo(username, _id, description, duration, date) {
    return new UserExcersize(username, _id, description, duration, date);
  }
}

// post: exercises date YYYY-MM-DD
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;

  // Kiểm tra xem id có tồn tại trong map không
  const user = await findUserById(_id);
  if (!user) {
    return res.json({ error: "invalid id" });
  }
  try {
    // Lấy user trong map and update

    let userDate = date ? new Date(date) : new Date();
    if (userDate.toString() === "Invalid Date") {
      return res.json({ error: "Invalid Date" });
    }

    const newExercise = new UserExcersizeModel({
      userid: user._id, // Một ObjectId hợp lệ
      description: description,
      duration: Number(duration),
      date: userDate, // Lưu ngày hiện tại
    });

    await newExercise.save();
    console.log("Exercise saved:", newExercise);

    let resultInfo = UserExcersize.fromFullInfo(
      user.username,
      user._id.toString(),
      description,
      duration,
      userDate.toDateString()
    );

    return res.status(201).json(resultInfo);
  } catch (error) {
    console.error(error);
  }
});

// result:
// {
//   username: "fcc_test",
//   count: 1,
//   _id: "5fb5853f734231456ccb3b05",
//   log: [{
//     description: "test",
//     duration: 60,
//     date: "Mon Jan 01 1990",
//   }]
// }
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;

  // Kiểm tra xem _id có tồn tại trong map không
  const user = await findUserById(_id);
  if (!user) {
    return res.json({ error: "invalid id" });
  }
  //let user = userDatabase[_id];
  console.log("_id:" + _id);
  const result = await findUserExcersizeByUserId(_id);

  console.log(`userExcersizeLst:${result}`);

  let logLst = result.map((item) => ({
    description: item.description,
    duration: item.duration,
    date: item.date?.toDateString(), // Chuyển đổi ngày thành chuỗi
  }));

  return res.status(200).json({
    username: user.username,
    count: logLst.length,
    _id: user._id,
    log: logLst,
  });
});

// Endpoint để xuất toàn bộ dữ liệu của urlDatabase
app.get("/api/users", async (req, res) => {
  // Trả về toàn bộ dữ liệu của urlDatabase
  await connectDB();
  const users = await fetchUsers(); // Gọi hàm fetchUsers để lấy dữ liệu từ MongoDB
  return res.status(200).json(users);
});

const fetchUsers = async () => {
  //const UserModel = mongoose.model("User", new mongoose.Schema({}), "users"); // Kết nối tới collection `users`
  return await UserModel.find(); // Lấy tất cả dữ liệu
};

const findUserById = async (id) => {
  // Tìm kiếm người dùng theo id
  const user = await UserModel.findById(id);

  return user;
};

const findUserExcersizeByUserId = async (id) => {
  // Tìm kiếm người dùng theo id
  const userexcersizeLst = await UserExcersizeModel.find({ userid: id });

  return userexcersizeLst;
};

// Chạy server trên cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Xuất mặc định
