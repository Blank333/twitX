import { Button, Container, Image, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slices/userSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out", { autoClose: 500 });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  useEffect(() => {
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
      <Container className='px-4 py-2 pb-4 d-flex flex-column justify-content-between vh-100 position-sticky start-0 top-0'>
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
        <Link to={`/${userInfo.username}`} className='d-flex gap-3 nav-link rounded-5 p-1'>
          <Image src={userInfo.profilePicURL} alt='profile picture' className='profile-picture object-fit-cover' />
          <div className='d-flex flex-column justify-content-center'>
            <p className='fs-5'>{userInfo.name}</p>
            <p className='text-secondary'>@{userInfo.username}</p>
          </div>
        </Link>
      </Container>
    </>
  );
}

export default Sidebar;
