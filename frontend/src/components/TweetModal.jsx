import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";

function TweetModal({ show, onHide, action = "New Tweet" }) {
  const [content, setContent] = useState();

  const handleTweet = (e) => {
    e.preventDefault();

    console.log(content);
  };
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const newFile = event.target.files[0];
    if (newFile && newFile.type.startsWith("image/")) {
      setFile(newFile); // Update state with the selected file
    } else {
      alert("Please select an image file."); // Handle invalid file types
    }
    console.log(file);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{action}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleTweet}>
          <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
            <Form.Control
              as='textarea'
              rows={4}
              placeholder='Write your tweet'
              autoFocus
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='formFile' className='d-flex align-items-center custom-upload'>
            <Button variant='light' className='custom-upload-button'>
              <Form.Control type='file' accept='image/*' onChange={handleFileUpload} />
              <FontAwesomeIcon icon={faImage} />
            </Button>
            {file && <Image src={file.value} />}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button className='bg-main' onClick={onHide}>
          Tweet
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TweetModal;
