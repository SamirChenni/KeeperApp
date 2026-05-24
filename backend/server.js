require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const User = require("./models/User"); // Path to your User model
const app = express();
const path = require("path");
// --- 1. DATABASE CONNECTION ---
mongoose.connect("mongodb://127.0.0.1:27017/keeperDB");

// --- 2. MIDDLEWARE ---
// Credentials: true is vital for keeping users logged in
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProd = process.env.NODE_ENV === "production";
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // Allow Vite's inline scripts in development only
          ...(!isProd ? ["'unsafe-inline'", "http://localhost:5173"] : []),
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // inline styles are common in React
        imgSrc: [
          "'self'",
          "data:",
          // Allow the texture image you were loading
          "https://www.transparenttextures.com",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png",
        ],
        connectSrc: [
          "'self'",
          // Allow Vite's WebSocket for HMR in development
          ...(!isProd ? ["ws://localhost:5173", "http://localhost:5173"] : []),
        ],
        fontSrc: ["'self'",
          "https://fonts.gstatic.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com", // ✅ the stylesheet
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  }),
); // In development, we relax some CSP rules to allow Vite's HMR and inline scripts/styles.

// --- 3. SESSION & PASSPORT SETUP ---

app.use(
  session({
    secret: process.env.SECRET, // This signs the cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd, // set true in production (requires HTTPS)
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);
// rate limiter for login route to mitigate brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts from this IP, please try again later.",
});

// apply limiter to the login endpoint

app.use("/login", loginLimiter);
app.use(passport.initialize());
app.use(passport.session());

// Tell Passport to use the Strategy we set up in the User Model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- 4. ROUTES ---
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

app.use("/", authRoutes);
app.use("/api/notes", noteRoutes);

app.get(/^(?!\/api\/).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
