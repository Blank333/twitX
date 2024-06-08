import { Button, Col, Container, Row } from "react-bootstrap";
import Tweets from "../components/Tweets";
import "./Home.css";
import TweetModal from "../components/TweetModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StyledLoading from "../components/StyledLoading";
function Home() {
  const [show, setShow] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [tweetId, setTweetId] = useState();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    // Fetch all tweets
    axios
      .get(`${import.meta.env.VITE_API_URL}/tweet`, { headers: { Authorization: token } })
      .then((res) => {
        setTweets(res.data.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container className='border-start border-end h-100'>
      <Row className='border-bottom py-2 position-sticky start-0 top-0 bg-white d-flex align-items-center'>
        <Col>
          <h5>Home</h5>
        </Col>
        <Col className='d-flex justify-content-end '>
          <Button className='bg-main border-0 bg-hover' onClick={() => setShow("New Tweet")}>
            Tweet
          </Button>
        </Col>
      </Row>
      {loading ? (
        <StyledLoading />
      ) : (
        <Tweets tweets={tweets} setTweets={setTweets} setReply={setShow} setTweetId={setTweetId} />
      )}

      <TweetModal onHide={() => setShow(false)} show={show} id={tweetId} />
    </Container>
  );
}

export default Home;
