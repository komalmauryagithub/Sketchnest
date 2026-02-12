require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const sketchBotRouter = require("./backend/sketchbot");
const app = express();
const PORT = process.env.PORT || 3000;
/* ------------------- MIDDLEWARE ------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
/* ------------------- DATABASE CONNECTION ------------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));
/* ------------------- USER MODEL ------------------- */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);
/* ------------------- AUTH MIDDLEWARE ------------------- */
function auth(req, res, next) {
  if (!req.session.user) return res.redirect("/"); 
  next();
}
/* ------------------- ROUTES ------------------- */
// Login Page
app.get("/", (req, res) => res.render("login"));
// Signup Page
app.get("/signup", (req, res) => res.render("signup"));
// Handle Signup
app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (!username || !email || !password)
      return res.send("All fields are required! <a href='/signup'>Try again</a>");

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.send("Email already registered! <a href='/signup'>Try again</a>");

    const newUser = new User({ username, email, password });
    await newUser.save();

    req.session.user = newUser;
    res.redirect("/Sketchnest/index.html");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});
// Handle Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      req.session.user = user;
      res.redirect("/Sketchnest/index.html");
    } else {
      res.send("Invalid credentials! <a href='/'>Try again</a>");
    }
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});
// Home (protected)
app.get("/home", auth, (req, res) => {
  res.render("home", { username: req.session.user.username });
});
// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/signup");
  });
});
/* ------------------- STATIC SITE ------------------- */
app.use("/Sketchnest", auth, express.static(path.join(__dirname, "public/Sketchnest")));
/* ------------------- TEST ROUTE ------------------- */
app.get("/test-sketchbot", async (req, res) => {
  try {
    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello, SketchBot!" })
    });
    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ SketchBot API test failed.");
  }
});

/* ------------------- START SERVER ------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
