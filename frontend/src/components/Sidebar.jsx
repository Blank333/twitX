import { Button, Col, Container, Image, Nav, Offcanvas, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOut, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slices/userSlice";
import defaultProfile from "../assets/defaultProfile.jpg";

function Sidebar() {
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  // On logout remove token and redirect user to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out", { autoClose: 500 });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  useEffect(() => {
    // Update redux store
    if (token && !userInfo.token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/auth`, { headers: { Authorization: token } })
        .then((res) => {
          dispatch(addUser(res.data.message));
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error);
        });
    }
  }, []);

  return (
    <>
      {/* Desktop View */}
      <Container className='px-4 py-2 pb-4 d-md-flex d-none flex-column justify-content-between sidebar position-sticky start-0 top-0'>
        <div>
          <Link to='/'>
            <Image src={logo} alt='logo' fluid className='main-logo' />
          </Link>
          <Nav className='d-flex flex-column gap-1 mt-2' variant='pills'>
            <NavLink to='/' className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'>
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </NavLink>
            <NavLink
              to={`/${userInfo.username}`}
              className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </NavLink>
            <Button className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link' onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOut} />
              <span>Logout</span>
            </Button>
          </Nav>
        </div>
        <Link to={`/${userInfo.username}`} className='d-flex gap-3 nav-link rounded-5 py-1 px-2'>
          <Image
            src={userInfo.profilePicURL || defaultProfile}
            alt='profile picture'
            className='profile-picture object-fit-cover'
          />
          <div className='d-flex flex-column justify-content-center'>
            <p className='fs-5'>{userInfo.name}</p>
            <p className='text-secondary'>@{userInfo.username}</p>
          </div>
        </Link>
      </Container>

      {/* Mobile view */}
      <Container className='px-4 py-2 pb-4 d-flex d-md-none flex-column justify-content-between sidebar position-sticky start-0 top-0 border-start border-end'>
        <Row>
          <Col xs={5}>
            <Button className='border-0 p-0' variant='clear' onClick={() => setShow(true)}>
              <Image
                src={userInfo.profilePicURL || defaultProfile}
                alt='profile picture'
                className='profile-picture object-fit-cover '
              />
            </Button>
          </Col>
          <Col>
            <Link to='/' className=''>
              <Image src={logo} alt='logo' fluid className='main-logo' />
            </Link>
          </Col>
        </Row>

        {/* Sidebar */}

        <Offcanvas show={show} onHide={() => setShow(false)}>
          <Offcanvas.Header>
            <Offcanvas.Title className=' w-100'>
              <div className='d-flex justify-content-between align-items-start'>
                <Link
                  to={`/${userInfo.username}`}
                  className='d-flex flex-column  text-decoration-none text-dark'
                  onClick={() => setShow(false)}
                >
                  <Image
                    src={userInfo.profilePicURL || defaultProfile}
                    alt='profile picture'
                    className='profile-picture object-fit-cover'
                  />
                  <div className='d-flex flex-column justify-content-center'>
                    <p className='fs-5 tweet-user'>{userInfo.name}</p>
                    <p className='text-secondary'>@{userInfo.username}</p>
                  </div>
                </Link>
                <Button variant='clear' className='bg-lighthover border-0' onClick={() => setShow(false)}>
                  <FontAwesomeIcon icon={faX} />
                </Button>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className='d-flex flex-column gap-1 mt-2' variant='pills'>
              <NavLink
                to='/'
                className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'
                onClick={() => setShow(false)}
              >
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
              </NavLink>
              <NavLink
                to={`/${userInfo.username}`}
                className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'
                onClick={() => setShow(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
              </NavLink>
              <Button className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link' onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOut} />
                <span>Logout</span>
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </>
  );
}

export default Sidebar;
