import { Button, Image } from "react-bootstrap";
import "./Tweet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet, faHeart, faCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeaderRegular,
  faMessage as faMessageRegular,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";

function Tweet({ tweet, handleLike, handleUnlike, handleRetweet, handleReply, handleDelete }) {
  const userInfo = useSelector((state) => state.user);
  // Set the names of the people who retweeted (upto 3)
  const retweets =
    tweet.retweetBy.length === 1
      ? tweet.retweetBy[0].username
      : tweet.retweetBy
          .slice(0, 3)
          .map((retweet) => retweet.username)
          .join(", ");

  // Middleware for handling actions
  const handleSubmit = (e) => {
    // Using currentTarget as clicking on the icon itself doesn't register the button id
    const { id } = e.currentTarget;
    if (id === "likes") {
      if (tweet.likes.find((like) => like._id === userInfo._id)) {
        handleUnlike(tweet._id, userInfo._id);
      } else {
        handleLike(tweet._id, userInfo._id);
      }
    } else if (id === "retweets") {
      handleRetweet(tweet._id, userInfo._id, userInfo.username);
    } else if (id === "replies") {
      handleReply(tweet._id, userInfo._id);
    } else {
      handleDelete(tweet._id);
    }
  };

  return (
    <div className='d-flex gap-2 border py-2 tweet m-auto bg-lighthover '>
      {/* User profile picture */}
      <div>
        <Image
          src={tweet.tweetedBy.profilePicURL || defaultProfile}
          alt='profile picture'
          className='profile-picture object-fit-cover'
        />
      </div>
      {/* Tweet */}
      <div className='d-flex flex-column gap-1 w-100'>
        {/* Information */}
        {tweet.retweetBy.length > 0 && (
          <p className='text-secondary fst-italic'>
            <FontAwesomeIcon icon={faRetweet} /> Retweeted by {retweets}
            {tweet.retweetBy.length > 1 && "..."}
          </p>
        )}
        <div className='d-flex justify-content-between '>
          <Link
            to={`/${tweet.tweetedBy.username}`}
            className='d-flex flex-column flex-md-row gap-0 gap-md-2 align-items-md-center text-decoration-none text-dark'
          >
            <p className='tweet-user fw-bold'>{tweet.tweetedBy.name}</p>
            <p className='text-secondary '>@{tweet.tweetedBy.username}</p>
            <FontAwesomeIcon
              icon={faCircle}
              className='text-secondary d-none d-md-block'
              style={{ fontSize: "0.3rem" }}
            />
            <p className='text-secondary'>{new Date(tweet.createdAt).toUTCString().split(" ").slice(0, 4).join(" ")}</p>
          </Link>
          {userInfo._id === tweet.tweetedBy._id && (
            <Button variant='clear' className='delete-tweet p-0' onClick={handleSubmit} id='delete'>
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )}
        </div>

        {/* Content */}
        <Link to={`/tweet/${tweet._id}`} className='text-decoration-none text-dark'>
          <div className='d-flex flex-column gap-2'>
            <p>{tweet.content}</p>
            {tweet.imageURL && <Image src={tweet.imageURL} alt='content media' className='content-media' />}
          </div>
        </Link>

        {/* Likes/Retweets*/}
        <div className='d-flex gap-4'>
          {/* Likes */}
          <Button
            variant='clear'
            className='d-flex align-items-center bg-normalhover'
            onClick={handleSubmit}
            id='likes'
          >
            <FontAwesomeIcon
              icon={tweet.likes.find((like) => like._id === userInfo._id) ? faHeart : faHeaderRegular}
              className='text-danger pe-1 fs-5'
            />
            <span>{tweet.likes.length}</span>
          </Button>

          {/* Replies */}
          <Button
            variant='clear'
            className='d-flex align-items-center bg-normalhover'
            onClick={handleSubmit}
            id='replies'
          >
            <FontAwesomeIcon icon={faMessageRegular} className='text-primary pe-1 fs-5' />
            <span>{tweet.replies.length}</span>
          </Button>

          {/* Retweets */}
          <Button
            variant='clear'
            className='d-flex align-items-center bg-normalhover'
            onClick={handleSubmit}
            id='retweets'
          >
            <FontAwesomeIcon icon={faRetweet} className='text-success pe-1 fs-5' />
            <span>{tweet.retweetBy.length}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Tweet;
