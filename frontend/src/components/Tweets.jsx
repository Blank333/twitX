import { Row } from "react-bootstrap";
import Tweet from "./Tweet";
import axios from "axios";
import { toast } from "react-toastify";
function Tweets({ tweets, setTweets, setReply, setTweetId }) {
  const token = localStorage.getItem("token");
  const handleLike = (id, userID) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/tweet/${id}/like`, {}, { headers: { Authorization: token } })
      .then((res) => {
        toast.success(res.data.message);
        // Update likes in the state variable
        setTweets(
          tweets.map((tweet) => {
            if (tweet._id === id) {
              const updatedLikes = tweet.likes ? [...tweet.likes, { _id: userID }] : [userID];
              console.log("tweet", tweet);

              return { ...tweet, likes: updatedLikes };
            }
            return tweet;
          })
        );
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  const handleUnlike = (id, userID) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/tweet/${id}/dislike`, {}, { headers: { Authorization: token } })
      .then((res) => {
        toast.success(res.data.message);
        // Update likes in the state variable
        setTweets(
          tweets.map((tweet) => {
            if (tweet._id === id) {
              const updatedLikes = tweet.likes.filter((like) => like._id !== userID);
              return { ...tweet, likes: updatedLikes };
            }
            return tweet;
          })
        );
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  const handleRetweet = (id, userID, username) => {
    console.log("retweet");
    axios
      .post(`${import.meta.env.VITE_API_URL}/tweet/${id}/retweet`, {}, { headers: { Authorization: token } })
      .then((res) => {
        toast.success(res.data.message);
        // Update retweets in the state variable
        setTweets(
          tweets.map((tweet) => {
            if (tweet._id === id) {
              const updatedRetweets = tweet.retweetBy
                ? [...tweet.retweetBy, { _id: userID, username: username }]
                : [userID];
              return { ...tweet, retweetBy: updatedRetweets };
            }
            return tweet;
          })
        );
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  const handleReply = (id) => {
    setTweetId(id);
    setReply("Reply");
  };

  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/tweet/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        toast.success(res.data.message);
        // Delete tweet from the state variable
        setTweets(tweets.filter((tweet) => tweet._id !== id));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  return (
    <>
      <Row className=''>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleReply={handleReply}
            handleRetweet={handleRetweet}
            handleDelete={handleDelete}
          />
        ))}
      </Row>
    </>
  );
}

export default Tweets;
