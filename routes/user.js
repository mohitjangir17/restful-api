const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { requireAuth } = require("../authentication/auth");
const { checkUser } = require("../authentication/auth");

const bcrypt = require("bcryptjs");
const { JsonWebTokenError } = require("jsonwebtoken");
router.get("/", requireAuth, checkUser, (req, res) => {
  User.find()
    .exec()
    .then((doc) => {
      res.render("userDetail", { title: "Users", items: doc });
    });
});

router.post(
  "/",
  body("email", "Invalid Email address").isEmail(),
  body("password", "Password must be 5+ characters").isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    const alert = errors.array();
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("index", { alert });
    }

    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length) {
          return res.render("index", { error: "email already exists" });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.send("err occoured");
            } else {
              const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              // console.log(user);
              user
                .save()
                .then((result) => {
                  res.render("index", { success: "user created" });
                })
                .catch((err) => {
                  console.log(err);
                  res.render("index", { error: err });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.render("index", {
          error: "Enter valid Email address",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "mohitjangir17",
            {
              expiresIn: "1h",
            }
          );
          // console.log(token);
          res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 });
          return res.render("index", { success: "Logged in sucessfully" });
          // return res.status(200).json({
          //   message: "Auth sucessful",
          //   token: token,
          // });
        }
        res.render("index", { error: "Enter correct Email/Password" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/:userId", (req, res) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.redirect("/signup");
      console.log(result[1]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1000 });
  res.render("index", { success: "Logged out sucessfully" });
});

module.exports = router;
