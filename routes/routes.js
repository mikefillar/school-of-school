const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

//homepage
router.get("/", (req, res) => {
  res.render("index");
});
//login
router.get("/login", (req, res) => {
  res.render("login");
});
//register
router.get("/register", (req, res) => {
  res.render("register");
});
//dashboard
router.get("/dashboard", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) {
      console.log(`Error message: ${err}`);
    } else {
      let enrolled = result.filter(
        (data) => data.student_status === "Enrolled"
      );
      let notEnrolled = result.filter(
        (data) => data.student_status === "Not Enrolled"
      );
      res.render("dashboard", {
        title: "Dashboard",
        dashboard1: "active",
        dashboard: true,
        dashboardData: result,
        enrolled: enrolled.length,
        notEnrolled: notEnrolled.length,
      });
    }
  });
});
//student page
router.get("/student", (req, res) => {
  res.render("dashboard", {
    title: "Add Student",
    student1: "active",
    student: true,
  });
});
//account page
router.get("/account", (req, res) => {
  res.render("dashboard", {
    title: "Account",
    account1: "active",
    account: true,
  });
});
//report
router.get("/report", (req, res) => {
  res.render("dashboard", {
    title: "Report",
    report1: "active",
    report: true,
  });
});
//pending
router.get("/pending", (req, res) => {
  res.render("dashboard", {
    title: "Add Student - Pending",
    student1: "active",
    pending: true,
  });
});

module.exports = router;
