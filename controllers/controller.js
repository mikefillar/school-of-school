const mysql = require("mysql2");
//jasonwebtoken
const jwt = require("jsonwebtoken");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
});

exports.login = async (req, res) => {
  try {
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
            //get the id of the user login
            const id = loginData[0].user_id;
            //putting jasonwebtoken to sign in
            const token = jwt.sign(id, process.env.JWT_SECRET);
            //assigning cookie
            const cookieOption = {
              expires:
                //on login, assigning the date to now, then concut the cookie expiration for a day
                new Date(
                  Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 1000
                ),
              httpOnly: true,
            };
            //passing the cookie and the token to the server
            res.cookie("/cookie_access_token", token, cookieOption);
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
  } catch (error) {
    console.log(`Error message : ${err}`);
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

//logout
exports.logout = (req, res) => {
  res.clearCookie("/cookie_access_token").status(200);
  res.render("login");
};
