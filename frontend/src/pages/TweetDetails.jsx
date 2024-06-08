import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Tweets from "../components/Tweets";
import { Col, Container, Row } from "react-bootstrap";
import TweetModal from "../components/TweetModal";
import StyledLoading from "../components/StyledLoading";

function TweetDetails() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [replies, setReplies] = useState();
  const [tweet, setTweet] = useState();
  const [tweetId, setTweetId] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/tweet/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        setTweet([res.data.message]);
        setReplies(res.data.message.replies);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Container className='border-start border-end h-100'>
      <Row className='border-bottom py-2 position-sticky start-0 top-0 bg-white d-flex align-items-center'>
        <Col>
          <h5>Tweet</h5>
        </Col>
        <Col className='d-flex justify-content-end '></Col>
      </Row>
      {loading ? (
        <StyledLoading />
      ) : (
        <div>
          {tweet && <Tweets tweets={tweet} setTweets={setTweet} setReply={setShow} setTweetId={setTweetId} />}

          {replies && (
            <div className='px-3 mt-2'>
              <h5>Replies</h5>
              <Tweets tweets={replies} setTweets={setReplies} setReply={setShow} setTweetId={setTweetId} />
            </div>
          )}
        </div>
      )}

      <TweetModal onHide={() => setShow(false)} show={show} id={tweetId} />
    </Container>
  );
}

export default TweetDetails;
