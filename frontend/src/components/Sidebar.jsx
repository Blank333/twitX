import { Button, Container, Image, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <Container className='px-4 py-2 pb-4 d-flex flex-column justify-content-between h-100'>
      <div>
        <Link to='/'>
          <Image src={logo} alt='logo' fluid className='main-logo' />
        </Link>
        <Nav className='d-flex flex-column gap-1 mt-2' variant='pills'>
          <NavLink to='/' className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'>
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </NavLink>
          <NavLink to='/profile' className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'>
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </NavLink>
          <Button className='d-flex gap-2 align-items-center rounded-5 text-dark nav-link'>
            <FontAwesomeIcon icon={faSignOut} />
            <span>Logout</span>
          </Button>
        </Nav>
      </div>
      <div className='d-flex gap-3'>
        <Image src='' alt='' fluid className='profile-picture' />
        <div className='d-flex flex-column justify-content-center'>
          <p className='fs-5 m-0'>Name</p>
          <p className='text-secondary'>@Username</p>
        </div>
      </div>
    </Container>
  );
}

export default Sidebar;
