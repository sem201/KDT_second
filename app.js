const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const router = require("./routes/Router");
const { sequelize } = require("./models");
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
