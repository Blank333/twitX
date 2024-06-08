import { useEffect, useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function FollowsModal({ show = false, onHide, followers = [], following = [] }) {
  const [data, setData] = useState([]);

  // Set the data depending on which button is clicked
  useEffect(() => {
    if (show === "Followers") {
      setData(followers);
    } else {
      setData(following);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{show}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex flex-column gap-1'>
          {data.map((follow) => (
            <Link
              to={`/${follow.username}`}
              onClick={onHide}
              key={follow._id}
              className='text-decoration-none text-dark d-flex justify-content-start gap-4 align-items-center rounded-5 bg-lighthover p-2'
            >
              <Image src={follow.profilePicURL || defaultProfile} alt='profile picture' className='profile-picture' />
              <div>
                <p>{follow.name}</p>
                <p className='text-secondary'>@{follow.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='bg-main bg-hover border-0' onClick={onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FollowsModal;
