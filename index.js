const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000","https://nooneshop.onrender.com"]
}));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8000;

// mongo setup
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

const userSignUpSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmpassword: String,
});

const userSignUpModel = mongoose.model("user", userSignUpSchema);
// api
app.get("/", (req, res) => {
  res.send("hello from backend");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userSignUpModel.findOne({ email: email });
    if (result) {
      if (password === result.password) {
        res
          .status(200)
          .send({ message: "Welcome back", alert: true, userData: result });
      } else {
        res.send({ message: "Wrong password", alert: false });
      }
    } else {
      res.send({
        message: "Please signup",
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userSignUpModel.findOne({ email: email });
    if (result) {
      res.send({ message: "You already have an account", alert: false });
    } else {
      const data = userSignUpModel(req.body);
      const save = data.save();
      res.send({
        message: "Welcome to your world",
        userData: save,
        alert: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// listen
app.listen(PORT);
