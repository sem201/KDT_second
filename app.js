const express = require("express");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const session = require("express-session");
dotenv.config();
const db = require("./models");
const app = express();
const router = require("./routes/main");
const userrouter = require("./routes/User");
const moimrouter = require("./routes/Moim");
const updateReview = require("./controller/Cuser");
const multer = require("multer");

const PORT = process.env.PORT;

app.use("/static", express.static(__dirname + "/static")); // 정적 파일 접근 위해
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const sessionConfig = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1시간
  },
};

const uploadDetail = multer({
  // storage : 저장할 공간에 대한 정보
  storage: multer.diskStorage({
    // destination : 경로 설정
    destination(req, file, done) {
      // done: callback function
      // done(null, "~~") 여기서 null은 error를 의미하는 매개변수
      // 에러가 없으므로 "null" 이라고 전달하여 콜백함수를 호출
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 파일 "확장자"를 추출
      // console.log("ext", ext);
      // console.log(path.basename(file.originalname, ext));
      // done(null, path.basename(file.originalname, ext) + Date.now() + ext);

      // 실습
      console.log("file name > req.body", req.body);
      done(null, req.body.moim_id + ext);
    },
    // limits : 파일 제한 정보
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }),
});

app.use(session(sessionConfig));

app.use("/", router);
app.use("/user", userrouter);
app.use("/moim", moimrouter);

app.get("*", (req, res) => {
  res.render("404");
});

schedule.scheduleJob("0 0 * * *", async () => {
  console.log("Scheduled task executed at 00:00");
  await updateReview(); // updateReview 함수 호출
});

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
