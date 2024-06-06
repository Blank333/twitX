const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const cors = require("cors");
const app = express();

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");

// Middlewares
app.use(cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(`Connected to database (${process.env.DB_URL})`);
  })
  .catch((err) => {
    console.error(`Error connecting to database ${err}`);
  });

// Image upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
