import axios from "axios";
import { useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function UploadPicModal({ show, onHide, userInfo, setUserInfo }) {
  const token = localStorage.getItem("token");
  const [image, setImage] = useState();

  const handleUpload = (e) => {
    // Attach image to form data for multer
    const formData = new FormData();
    formData.append("image", image);

    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL}/user/${userInfo._id}/uploadProfilePic`, formData, {
        headers: { Authorization: token },
      })
      .then((res) => {
        toast.success(res.data.message);
        const { profilePicURL } = res.data;
        // Update the state variable for UI
        setUserInfo({
          ...userInfo,
          profilePicURL,
        });
        onHide();
        setImage();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setImage();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label className='bg-lightmain color-main border border-primary-subtle px-3 py-2 w-100 rounded'>
              Note: The image should be a square in shape
            </Form.Label>

            <Form.Control type='file' id='image' onChange={(e) => setImage(e.target.files[0])} />
          </Form.Group>
          {/* Show the image */}
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
          }}
        >
          Cancel
        </Button>
        <Button className='bg-main bg-hover border-0' type='submit' onClick={handleUpload}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadPicModal;
