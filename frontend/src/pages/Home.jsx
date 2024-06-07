import { Button, Col, Container, Row } from "react-bootstrap";
import Tweets from "../components/Tweets";
import "./Home.css";
import TweetModal from "../components/TweetModal";
import { useState } from "react";
function Home() {
  const [show, setShow] = useState(false);

  return (
    <Container className='border-start border-end h-100'>
      <Row className='border-bottom py-2 position-sticky start-0 top-0 bg-white d-flex align-items-center'>
        <Col>
          <h5>Home</h5>
        </Col>
        <Col className='d-flex justify-content-end '>
          <Button className='bg-main' onClick={() => setShow("New Tweet")}>
            Tweet
          </Button>
        </Col>
      </Row>
      <Tweets />

      <TweetModal onHide={() => setShow(false)} show={show} action={show} />
    </Container>
  );
}

export default Home;
