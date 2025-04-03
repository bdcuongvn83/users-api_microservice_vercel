import express from "express";
import shortid from "shortid";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// {
//   username: "fcc_test",
//   description: "test",
//   duration: 60,
//   date: "Mon Jan 01 1990",
//   _id: "5fb5853f734231456ccb3b05"
// }
const userDatabase = {}; // Lưu trữ các id và Object
const userExcersize = []; // Lưu trữ các id và Excersize

// POST: /api/users
app.post("/api/users", (req, res) => {
  const { username, _id } = req.body;

  console.log(req.body); // Kiểm tra URL nhận được

  let user = User.fromBasicInfo(username, _id);
  userDatabase[_id] = user;

  // Trả về JSON chứa user
  return res.status(201).json(user);
});

class User {
  constructor(username, _id) {
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
app.post("/api/users/:_id/exercises", (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;

  // Kiểm tra xem id có tồn tại trong map không
  if (!userDatabase[_id]) {
    return res.json({ error: "invalid _id" });
  }

  // Lấy user trong map and update
  let user = userDatabase[_id];
  let userDate = date ? new Date(date) : new Date();
  if (userDate.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  let userExecersize = UserExcersize.fromFullInfo(
    user.username,
    user._id,
    description,
    duration,
    userDate.toDateString()
  );

  userExcersize.push(userExecersize);

  return res.status(201).json(userExecersize);
});

// const employees = [
//   { empid: 1, empname: "Alice", age: 30, point: 80, date: "2024-04-02" },
//   { empid: 2, empname: "Bob", age: 25, point: 90, date: "2024-03-30" },
//   { empid: 3, empname: "Charlie", age: 35, point: 85, date: "2024-03-25" }
// ];

// const findEmpById = (id) => {
//   return employees.find(emp => emp.empid === id);
// };

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
app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;

  // Kiểm tra xem _id có tồn tại trong map không
  if (!userDatabase[_id]) {
    return res.json({ error: "invalid id" });
  }
  let user = userDatabase[_id];
  console.log("_id:" + _id);
  let userExcersizeLst = userExcersize.filter((item) => item._id == _id);
  console.log(`userExcersizeLst:${userExcersizeLst}`);

  let logLst = userExcersizeLst.map((item) => ({
    description: item.description,
    duration: item.duration,
    date: item.date,
  }));

  return res.status(200).json({
    username: user.username,
    count: logLst.length,
    _id: user._id,
    log: logLst,
  });
});

// GET: /api/shorturl/:short_url
app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;

  // Kiểm tra xem short_url có tồn tại trong map không
  if (!userDatabase[short_url]) {
    return res.json({ error: "invalid url" });
  }

  // Lấy original_url từ map và thực hiện redirect
  const originalUrl = userDatabase[short_url];
  return res.redirect(originalUrl); // Chuyển hướng đến original URL
});

// Endpoint để xuất toàn bộ dữ liệu của urlDatabase
app.get("/api/users", (req, res) => {
  // Trả về toàn bộ dữ liệu của urlDatabase
  return res.status(200).json(userDatabase);
});

// Chạy server trên cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Xuất mặc định
