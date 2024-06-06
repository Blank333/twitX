const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//For handling file upload
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Authenticate user
exports.authenticate = (req, res) => {
  const { user } = req;
  return user ? res.status(200).json({ message: user }) : res.status(500).json({ error: "Unauthorized" });
};

//Get all users
exports.getAll = (req, res) => {
  //For pagination and sorting
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const sort = parseInt(req.query.sort) || 1;

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  //Remove password from returned users
  User.find({}, { password: 0 })
    .sort({ createdAt: sort })
    .skip((page - 1) * limit)
    .limit(limit)
    .then((users) => {
      return res.status(200).json({ message: users });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Get one user
exports.getOne = (req, res) => {
  const { id } = req.params;
  //Remove password from returned user
  User.findById(id, { password: 0 })
    .populate({
      path: "following followers",
      select: "-password",
    })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: user });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Follow a user
exports.follow = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (user._id.equals(id)) return res.status(400).json({ error: "You cannot follow yourself!" });

  //Find the user to follow
  User.findById(id, { password: 0 })
    .then((userToFollow) => {
      if (!userToFollow) return res.status(404).json({ error: "User not found" });

      //Find the user who wants to follow
      User.findById(user, { password: 0 })
        .then((userFollowing) => {
          if (!userFollowing) return res.status(404).json({ error: "User not found" });
          if (userFollowing.following.includes(userToFollow._id))
            return res.status(400).json({ error: "User is already followed!" });

          // Update the followers on both ends
          userFollowing.following.push(userToFollow._id);
          userToFollow.followers.push(userFollowing._id);

          // Save the users
          userFollowing
            .save()
            .then(() => {
              userToFollow
                .save()
                .then(() => {
                  return res.status(200).json({ message: "User has been followed successfuly!" });
                })
                .catch((err) => {
                  return res.status(500).json({ error: `Server Error ${err}` });
                });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server Error ${err}` });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Unfollow a user
exports.unfollow = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (user._id.equals(id)) return res.status(400).json({ error: "You cannot unfollow yourself!" });

  //Find the user to unfollow
  User.findById(id, { password: 0 })
    .then((userToUnfollow) => {
      if (!userToUnfollow) return res.status(404).json({ error: "User not found" });

      //Find the user who wants to unfollow
      User.findById(user, { password: 0 })
        .then((userUnfollowing) => {
          if (!userUnfollowing) return res.status(404).json({ error: "User not found" });
          if (!userUnfollowing.following.includes(userToUnfollow._id))
            return res.status(400).json({ error: "User is not followed!" });

          // Update the followers on both ends
          userUnfollowing.following = userUnfollowing.following.filter(
            (following) => !following.equals(userToUnfollow._id)
          );
          userToUnfollow.followers = userToUnfollow.followers.filter(
            (followers) => !followers.equals(userUnfollowing._id)
          );

          // Save the users
          userUnfollowing
            .save()
            .then(() => {
              userToUnfollow
                .save()
                .then(() => {
                  return res.status(200).json({ message: "User has been unfollowed successfuly!" });
                })
                .catch((err) => {
                  return res.status(500).json({ error: `Server Error ${err}` });
                });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server Error ${err}` });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Update one user with ID
exports.updateOne = (req, res) => {
  const { name, dateOfBirth, location } = req.body;
  const { id } = req.params;
  const { user } = req;

  if (!user._id.equals(id)) return res.status(400).json({ error: "Unauthorized" });

  // Save updated information
  const updateInfo = {
    name,
    dateOfBirth,
    location,
  };

  User.findByIdAndUpdate(user, updateInfo, { projection: { password: 0 }, new: true, runValidators: true })
    .then(() => {
      return res.status(200).json({ message: `Information updated!`, updatedFields: { name, dateOfBirth, location } });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

exports.uploadImage = (req, res) => {
  const { user } = req;
  const image = req.file;
  if (!image) return res.status(400).json({ error: "Please provide required fields" });

  if (!(image.mimetype == "image/jpg" || image.mimetype == "image/jpeg" || image.mimetype == "image/png"))
    return res.status(500).json({ error: `Invalid file type! (use jpg, jpeg or png)` });

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  //Upload to cloudinary and save the url to the user's profile pic
  cloudinary.uploader
    .upload(image.path, options)
    .then((data) => {
      User.findByIdAndUpdate(
        user,
        { profilePicURL: data.secure_url },
        { projection: { password: 0 }, new: true, runValidators: true }
      )
        .then(() => {
          return res.status(200).json({ message: `Profile picture updated!` });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server error ${err}` });
    })
    .finally(() => {
      //Delete the locally stored file
      fs.unlink(image.path, (err) => {
        if (err) console.error(`Error deleting local file ${err}`);
      });
    });
};

//Register a new user
exports.register = (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) return res.status(400).json({ error: "Please provide all fields." });
  if (!/\S+@\w+\.\w+(\.\w+)?/.test(email)) return res.status(400).json({ error: "Invalid email" });
  if (password.length < 8) return res.status(400).json({ error: "Password needs to be atleast 8 characters long" });

  //Hash the password with 10 rounds of salt
  bcrypt.hash(password, 10).then((hashedPassword) => {
    //Check if email already exists in database
    User.findOne({ email })
      .then((userEmail) => {
        if (userEmail) return res.status(400).json({ error: "User with email already exists!" });

        // Check if username already exists in database
        User.findOne({ username })
          .then((user) => {
            if (user) return res.status(400).json({ error: "Username taken!" });

            // Register new user with the information and hashed password
            const newUser = new User({
              name,
              username,
              email,
              password: hashedPassword,
            });

            newUser
              .save()
              .then((data) => {
                if (!data) return res.status(400).json({ error: "Something went wrong" });
                return res.status(200).json({ message: "Registered successfully!" });
              })
              .catch((err) => {
                return res.status(500).json({ error: `Server Error ${err}` });
              });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Server Error ${err}` });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  });
};

//Logging in a user
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Please provide all fields." });

  // Find the user with their username
  User.findOne({ username })
    .then((user) => {
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      // Compare the hashed password
      bcrypt
        .compare(password, user.password)
        .then((compare) => {
          if (!compare) return res.status(401).json({ error: "Invalid credentials" });

          // Create a jwt token
          const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          const userInfo = {
            name: user.name,
            username: user.username,
            email: user.email,
          };
          return res.status(200).json({ message: "Logged in successfully!", token: jwtToken, user: userInfo });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};
