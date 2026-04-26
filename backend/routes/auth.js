const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
app.use(express.urlencoded({ extended: true }));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile" , "email"],
      state: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id },{ 
          username: profile.emails[0].value, // This satisfies the 'required' path
          name: profile.displayName 
        }, function (err, user) {
        return cb(err, user);
      });
    },
  ),
);


router.get("/auth/google", passport.authenticate("google" , { scope: ["profile", "email"] }));

router.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:5173/dashboard");
  });




/* router.post("/register", (req, res) => {
  User.register(
    { username: req.body.email, name: req.body.name },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
       return res.status(500).json({ message: err.message });
      } else {
        passport.authenticate("local")(req, res, () => {
          return res.status(200).json({ message: "Success", user: user });
        });
      }
    }
  );
}); */

router.post("/register", (req, res, next) => {
  User.register(
    { username: req.body.email, name: req.body.name },
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(500).send({ error: "Internal Server Error" });
      }
      // Explicitly log the user in after registration
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: "Success", user: user });
      });
    }
  );
}); 

// 2. LOGIN ROUTE
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Invalid Email or Password" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res
        .status(200)
        .json({ message: "Successfully Logged In!", user: user });
    });
  })(req, res, next);
});

// 3. LOGOUT ROUTE
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.status(200).json({ message: "Logged out" });
  });
});

// 4. CHECK AUTH STATUS (To protect your Dashboard)
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
