const User = require("../models/users");
const passport = require("passport");
const bcrypt = require("bcrypt");
const sendEmail = require("../helpers/sendEmail");
const bcryptSalt = 10;
require("dotenv").config();

const authController = {
  getLogin: (req, res) => {
    res.render("login", {
      messageLogin: req.flash().error,
    });
  },

  getSignUp: (req, res, next) => {
    const { name, username, email, password } = req.body;

    if (username === "" || password === "") {
      res.render("login", {
        message: "Indicate username and password",
      });
      return;
    }

    User.findOne({
      username: username,
    }).then((user) => {
      if (user !== null) {
        res.render("login", {
          message: "The username already exists",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        username,
        email,
        password: hashPass,
      });

      newUser
        .save()
        .then((user) => {
          console.log(user);
          req.login(user, (err) => {
            if (err) {
              res.redirect("/login");
            } else {
              sendEmail(
                email,
                "Welcome",
                "Welcome to easyCooking",
                "welcome",
                username
              );
              res.redirect("/home");
            }
          });
        })
        .catch((error) =>
          res.render("login", {
            message: "Something went wrong",
          })
        )
        .catch((error) => next(error));
    });
  },

  postLogin: passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  }),

  getHome: (req, res) => {
    res.render("home", {
      user: req.user,
    });
  },

  getLogout: (req, res) => {
    req.logout();
    res.redirect("/login");
  },

  getResetPassword: (req, res) => {
    res.render("resetPassword");
  },

  postResetPassword: (req, res) => {
    const { email } = req.body;
    User.find({ email })
      .then((user) => {
        console.log(user[0]);
        sendEmail(
          user[0].email,
          "Reset Password",
          "Reset your password",
          "reset",
          user[0]._id,
          user[0].username
        );
      })
      .catch((err) => console.log(err));
  },

  getAbout: (req, res) => {
    res.render("aboutUs", {
      user: req.user,
    });
  },

  getResetPasswordId: (req, res) => {
    const { id, username } = req.params;
    res.render("userPassword", {
      id,
      username,
    });
  },

  postResetPasswordId: (req, res) => {
    const { id } = req.params;

    const { username, password, confirm } = req.body;

    if (password === confirm) {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.findOneAndUpdate(
        { _id: id },
        { $set: { password: hashPass } },
        { new: true }
      )
        .then((user) => {
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    } else {
      res.send("error");
    }
  }
};

module.exports = authController;
