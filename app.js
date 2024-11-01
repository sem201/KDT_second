const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const db = require("./models");
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
