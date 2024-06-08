import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import StyledLoading from "./StyledLoading";

function TweetModal({ show = false, onHide, id = null }) {
  const [content, setContent] = useState();
  const [image, setImage] = useState();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleTweet = () => {
    if (!content) return toast.error("Please provide tweet content!");
    setLoading(true);

    // Save tweet info in form data for submission
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("content", content);

    // Different requests for new tweet or reply
    if (show === "Reply") {
      axios
        .post(`${import.meta.env.VITE_API_URL}/tweet/${id}/reply`, formdata, { headers: { Authorization: token } })
        .then((res) => {
          toast.success(res.data.message);
          onHide();
          setContent();
          setImage();
          id = null;
          window.location.reload();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_API_URL}/tweet`, formdata, { headers: { Authorization: token } })
        .then((res) => {
          toast.success(res.data.message);
          onHide();
          setContent();
          setImage();
          window.location.reload();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setContent();
        setContent();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{show}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <StyledLoading />}
        <Form>
          <Form.Group className='mb-3'>
            <Form.Control
              as='textarea'
              rows={4}
              placeholder='Write your tweet'
              autoFocus
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='d-flex align-items-center custom-upload'>
            <Form.Control
              type='file'
              id='image'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
              hidden
            />
            <Form.Label htmlFor='image'>
              <FontAwesomeIcon
                icon={faImage}
                className='color-main color-hover bg-lightmain bg-normalhover rounded fs-5 p-2'
                style={{ cursor: "pointer" }}
              />
            </Form.Label>
          </Form.Group>
          {image && <Image src={URL.createObjectURL(image)} className='w-100' />}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          className='border-0'
          onClick={() => {
            onHide();
            setImage();
            setContent();
          }}
        >
          Cancel
        </Button>
        <Button className='bg-main bg-hover border-0' onClick={handleTweet}>
          {show}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TweetModal;
