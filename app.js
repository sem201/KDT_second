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
