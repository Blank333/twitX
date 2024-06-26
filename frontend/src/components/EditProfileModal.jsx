import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import StyledLoading from "./StyledLoading";

function EditProfileModal({ show, onHide, userInfo, setUserInfo }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [formInfo, setFormInfo] = useState({
    name: userInfo.name,
    location: userInfo.location || "",
    dateOfBirth: userInfo.dateOfBirth || "",
  });

  const handleEdit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formInfo.name || !formInfo.location || !formInfo.dateOfBirth) {
      return toast.error("Fill all fields before saving!");
    }
    setLoading(true);

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/user/${userInfo._id}`,
        { ...formInfo },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        toast.success(res.data.message);
        // Get the updatedFields from the backend and set the state variable for dynamic updates
        const { updatedFields } = res.data;
        setUserInfo({
          ...userInfo,
          ...updatedFields,
        });
        onHide();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormInfo({ ...formInfo, [id]: value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <StyledLoading />}
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' id='name' value={formInfo.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Location</Form.Label>
            <Form.Control type='text' id='location' value={formInfo.location} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type='date'
              id='dateOfBirth'
              value={formInfo.dateOfBirth.split("T")[0]}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='border-0' onClick={onHide}>
          Cancel
        </Button>
        <Button className='bg-main bg-hover border-0' type='submit' onClick={handleEdit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProfileModal;
