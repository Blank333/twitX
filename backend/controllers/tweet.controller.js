const Tweet = require("../models/tweet.model");

//For handling file upload
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const User = require("../models/user.model");

// Create new tweet
exports.create = (req, res) => {
  const { content } = req.body;
  const { user } = req;
  const { id } = req.params;

  if (!content) return res.status(400).json({ error: "Please provide the content for your tweet!" });

  const image = req.file;

  // Upload image if user provided one
  if (image) {
    if (!(image.mimetype == "image/jpg" || image.mimetype == "image/jpeg" || image.mimetype == "image/png"))
      return res.status(500).json({ error: `Invalid file type! (use jpg, jpeg or png)` });

    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    //Upload to cloudinary and save the url to the tweet
    cloudinary.uploader
      .upload(image.path, options)
      .then((data) => {
        const newTweet = new Tweet({
          content,
          imageURL: data.secure_url,
          tweetedBy: user,
        });

        newTweet
          .save()
          .then((tweet) => {
            // If the route has an ID then reply to that tweet else just create a new tweet
            if (!id) return res.status(200).json({ message: "Tweeted successfully!" });

            Tweet.findById(id).then((tweetRepliedTo) => {
              tweetRepliedTo.replies.push(tweet._id);

              tweetRepliedTo
                .save()
                .then((tweet) => {
                  return res.status(200).json({ message: "Replied successfully!" });
                })
                .catch((err) => {
                  return res.status(500).json({ error: `Server Error ${err}` });
                });
            });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Server Error ${err}` });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      })
      .finally(() => {
        //Delete the locally stored file
        fs.unlink(image.path, (err) => {
          if (err) console.error(`Error deleting local file ${err}`);
        });
      });
  } else {
    // Save tweet with just content
    const newTweet = new Tweet({
      content,
      tweetedBy: user,
    });

    newTweet
      .save()
      .then((tweet) => {
        // If the route has an ID then reply to that tweet else just create a new tweet
        if (!id) return res.status(200).json({ message: "Tweeted successfully!" });

        Tweet.findById(id).then((tweetRepliedTo) => {
          tweetRepliedTo.replies.push(tweet._id);

          tweetRepliedTo
            .save()
            .then((tweet) => {
              return res.status(200).json({ message: "Replied successfully!" });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Server Error ${err}` });
            });
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  }
};

// Fetch all tweets
exports.getAll = (req, res) => {
  const { username } = req.params;
  // Sort all tweets in descending order according to creation date
  // Populate and remove password

  if (username) {
    // If finding for specific user
    User.findOne({ username: username })
      .then((user) => {
        Tweet.find({ tweetedBy: user })
          .sort({ createdAt: -1 })
          .populate({
            path: "replies likes retweetBy tweetedBy",
            select: "-password",
          })
          .then((data) => {
            return res.status(200).json({ message: data });
          })
          .catch((err) => {
            return res.status(500).json({ error: `Server Error ${err}` });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  } else {
    // Find all tweets
    Tweet.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "replies likes retweetBy tweetedBy",
        select: "-password",
      })
      .then((data) => {
        return res.status(200).json({ message: data });
      })
      .catch((err) => {
        return res.status(500).json({ error: `Server Error ${err}` });
      });
  }
};

// Fetch one tweet
exports.getOne = (req, res) => {
  const { id } = req.params;

  // Populate and remove password
  Tweet.findById(id)
    .populate({
      path: "replies",
      populate: {
        path: "tweetedBy likes retweetBy",
        select: "-password",
      },
      select: "-password",
    })
    .populate({
      path: "likes tweetedBy retweetBy",
      select: "-password",
    })
    .then((data) => {
      return res.status(200).json({ message: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

// Delete one tweet
exports.deleteOne = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) return res.status(404).json({ error: "Tweet not found!" });

      // Only let user delete their own tweets
      if (!tweet.tweetedBy.equals(user._id)) return res.status(400).json({ error: "Unauthorized" });

      Tweet.deleteOne({ _id: id })
        .then(() => {
          return res.status(200).json({ message: "Tweet deleted!" });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Retweet
exports.retweet = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  //Find the tweet to like
  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) return res.status(404).json({ error: "Tweet not found" });

      if (tweet.retweetBy.includes(user._id)) return res.status(400).json({ error: "Tweet already retweeted!" });

      tweet.retweetBy.push(user._id);

      // Save the users
      tweet
        .save()
        .then(() => {
          return res.status(200).json({ message: "Tweet has retweeted!" });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Like a tweet
exports.like = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  //Find the tweet to like
  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) return res.status(404).json({ error: "Tweet not found" });

      if (tweet.likes.includes(user._id)) return res.status(400).json({ error: "Tweet already liked!" });

      tweet.likes.push(user._id);

      // Save the users
      tweet
        .save()
        .then(() => {
          return res.status(200).json({ message: "Tweet has been liked!" });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};

//Dislikle a tweet
exports.unlike = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  //Find the tweet to like
  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) return res.status(404).json({ error: "Tweet not found" });

      if (!tweet.likes.includes(user._id)) return res.status(400).json({ error: "Tweet not liked!" });

      tweet.likes = tweet.likes.filter((like) => !like.equals(user._id));

      // Save the users
      tweet
        .save()
        .then(() => {
          return res.status(200).json({ message: "Tweet has been disliked!" });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Server Error ${err}` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: `Server Error ${err}` });
    });
};
