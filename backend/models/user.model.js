const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => {
          //Simple regular expression for validating email
          return /\S+@\w+\.\w+(\.\w+)?/.test(value);
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profilePicURL: {
      type: String,
      default:
        "https://res.cloudinary.com/djpawrjb6/image/upload/v1717699055/_475fdc35-ecac-427c-8e45-75417919161f_qvepau.jpg",
    },
    location: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    followers: {
      type: [ObjectId],
      ref: "User",
    },
    following: {
      type: [ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
