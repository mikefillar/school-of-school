const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.post("/login", controller.login);
//view-student
router.get("/edit-student/:student_id", controller.viewStudent);
//update student
router.post("/update-student", controller.updateStudent);
//delete student
router.get("/delete-student/:student_id", controller.deleteStudent);
//add student
router.post("/add-student", controller.addStudent);
//register
router.post("/register", controller.register);
//logout
router.get("/logout", controller.logout);

module.exports = router;
