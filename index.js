const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const mysql = require("mysql2");
const env = require("dotenv");
env.config({ path: "./.env" });

//asigning the hbs to view engine
app.set("view engine", "hbs");
//define the middleware first
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//routes
app.use("/", require("./routes/routes.js"));
//auth
app.use("/auth", require("./routes/auth.js"));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  // db.connect((err) => {
  //   if (err) {
  //     console.log(`Error message : ${err}`);
  //   } else {
  //     console.log("Database connected!");
  //   }
  // });
});
