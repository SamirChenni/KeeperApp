require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
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

// --- 3. SESSION & PASSPORT SETUP ---
app.use(session({
  secret: process.env.SECRET, // This signs the cookie
  resave: false,
  saveUninitialized: false
}));

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
  res.sendFile(path.join(__dirname,".." , "frontend", "index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));