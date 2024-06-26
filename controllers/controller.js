const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.login = (req, res) => {
  const { user_email, user_password } = req.body;
  if (!user_email || !user_password) {
    res.render("login", {
      message: "Please fill the form!",
      alert: "alert-danger",
    });
  } else {
    db.query(
      "SELECT * FROM users WHERE user_email = ?",
      user_email,
      (err, loginData) => {
        if (loginData.length == 0) {
          res.render("login", {
            message: "Username or password is incorrect!",
            alert: "alert-danger",
          });
        } else if (user_password != loginData[0].user_password) {
          res.render("login", {
            message: "Username or password is incorrect!",
            alert: "alert-danger",
          });
        } else {
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
                // userData: loginData[0],
              });
            }
          });
        }
      }
    );
  }
};

exports.register = (req, res) => {
  const { first_name, last_name, user_email, user_password } = req.body;
  if (!first_name || !last_name || !user_email || !user_password) {
    res.render("register", {
      message: "All fields are required!",
      alert: "alert-danger",
    });
  } else {
    db.query(
      "SELECT * FROM users WHERE user_email = ?",
      user_email,
      (err, result) => {
        if (result.length != 0) {
          res.render("register", {
            message: "Email already exist, please use another email!",
            alert: "alert-danger",
          });
        } else {
          db.query(
            "INSERT INTO users SET ?",
            {
              first_name: first_name,
              last_name: last_name,
              user_email: user_email,
              user_password: user_password,
            },
            (err) => {
              if (err) {
                console.log(`Error message : ${err}`);
              } else {
                res.render("register", {
                  message: "Account created successfully!",
                  alert: "alert-success",
                });
              }
            }
          );
        }
      }
    );
  }
};

//view students
exports.viewStudent = (req, res) => {
  let student_id = req.params.student_id;
  db.query(
    "SELECT * FROM students WHERE student_id = ?",
    student_id,
    (err, result) => {
      if (err) {
        console.log(`Error message : ${err}`);
      } else {
        res.render("dashboard", {
          title: "Dashboard : View Student",
          dashboard1: "active",
          viewStudent: true,
          viewStudentData: result[0],
        });
      }
    }
  );
};

//update student
exports.updateStudent = (req, res) => {
  const {
    student_id,
    first_name,
    last_name,
    gender,
    address,
    email,
    phone,
    student_status,
  } = req.body;
  db.query(
    "UPDATE students SET first_name = ?, last_name = ?, gender = ?, address = ?, email = ?, phone = ?, student_status = ? WHERE student_id = ?",
    [
      first_name,
      last_name,
      gender,
      address,
      email,
      phone,
      student_status,
      student_id,
    ],
    (err) => {
      if (err) {
        console.log(`Error message : ${err}`);
      } else {
        db.query(
          "SELECT * FROM students WHERE student_id = ?",
          student_id,
          (err, result) => {
            if (err) {
              console.log(`Error message : ${err}`);
            } else {
              res.render("dashboard", {
                title: "Dashboard : View Student",
                dashboard1: "active",
                viewStudent: true,
                viewStudentData: result[0],
                message: "Student updated successfully!",
                alert: "alert-success",
              });
            }
          }
        );
      }
    }
  );
};

//delete student
exports.deleteStudent = (req, res) => {
  let student_id = req.params.student_id;
  db.query("DELETE FROM students WHERE student_id = ?", student_id, (err) => {
    if (err) {
      console.log(`Error message : ${err}`);
    } else {
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
            message: "Student deleted successfully!",
            alert: "alert-success",
          });
        }
      });
    }
  });
};

//add student
exports.addStudent = (req, res) => {
  let { first_name, last_name, gender, address, phone, email, student_status } =
    req.body;
  if (
    !first_name ||
    !last_name ||
    !gender ||
    !address ||
    !phone ||
    !email ||
    !student_status
  ) {
    res.render("dashboard", {
      title: "Add Student",
      student1: "active",
      student: true,
      message: "All fields are required!",
      alert: "alert-danger",
    });
  }
  db.query(
    "INSERT INTO students SET ?",
    {
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      address: address,
      phone: phone,
      email: email,
      student_status: student_status,
    },
    (err) => {
      if (err) {
        console.log(`Error message : ${err}`);
      } else {
        res.render("dashboard", {
          title: "Add Student",
          student1: "active",
          student: true,
          message: "Student addedd successfully!",
          alert: "alert-success",
        });
      }
    }
  );
};
