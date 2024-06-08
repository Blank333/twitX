import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import "./Authentication.css";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/logo.png";
function Authentication({ sideMessage, action, handleAction }) {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const [formInfo, setFormInfo] = useState({
    name: "",
    username: username || "",
    email: "",
    password: "",
  });
  const [isNotValid, setIsNotValid] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    isNotValid[id] = false;

    // Form validations
    if (!value) {
      setIsNotValid({ ...isNotValid, [id]: `${id[0].toUpperCase() + id.substring(1)} is required` });
    }
    if (id === "email" && !/\S+@\w+\.\w+(\.\w+)?/.test(value)) {
      setIsNotValid({ ...isNotValid, [id]: "Invalid email" });
    }
    if (id === "password" && value.length < 8) {
      setIsNotValid({ ...isNotValid, [id]: "Passwords needs to have atleast 8 characters" });
    }
    if (id === "username" && value.includes(" ")) {
      setIsNotValid({ ...isNotValid, [id]: "Username should have no spaces (use _)" });
    }

    setFormInfo({ ...formInfo, [id]: value });
  };

  // Acts as a middleware between the handleAction method for validations
  const handleSubmit = (e) => {
    e.preventDefault();
    // Only continue if all items are valid
    if (!Object.values(isNotValid).every((item) => item === false))
      return toast.error("Please check form fields again!");

    handleAction(formInfo);
  };

  return (
    <Container className='bg-white h-75 rounded-4 shadow width-custom'>
      <Row className='h-100'>
        <Col
          sm={12}
          md={5}
          className='bg-main text-white d-flex flex-column justify-content-center align-items-center border-custom'
        >
          <div className='d-flex flex-column justify-content-center align-items-center text-center gap-4'>
            <h3>{sideMessage}</h3>
            <Image src={logo} alt='logo' fluid className='logo' />
          </div>
        </Col>
        <Col sm={12} md={6} className='d-flex flex-column justify-content-center ps-5 gap-3 '>
          {action === "Login" ? (
            <>
              <div>
                <h2>Log In</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      placeholder='Username'
                      id='username'
                      onChange={handleChange}
                      value={formInfo.username}
                    />
                    <Form.Text hidden={!isNotValid.username} className='text-danger'>
                      {isNotValid.username}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type='password' placeholder='Password' id='password' onChange={handleChange} />
                    <Form.Text hidden={!isNotValid.password} className='text-danger'>
                      {isNotValid.password}
                    </Form.Text>
                  </Form.Group>

                  <Button type='submit' className='bg-main bg-hover border-0'>
                    {action}
                  </Button>
                </Form>
              </div>
              <p>
                Don&apos;t have an account? <Link to='/register'>Register here!</Link>
              </p>
            </>
          ) : (
            <>
              <div>
                <h2>Register</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-3'>
                    <Form.Control type='text' placeholder='Full name' id='name' onChange={handleChange} />
                    <Form.Text hidden={!isNotValid.name} className='text-danger'>
                      {isNotValid.name}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control type='text' placeholder='Email' id='email' onChange={handleChange} />
                    <Form.Text hidden={!isNotValid.email} className='text-danger'>
                      {isNotValid.email}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Control type='text' placeholder='Username' id='username' onChange={handleChange} />
                    <Form.Text hidden={!isNotValid.username} className='text-danger'>
                      {isNotValid.username}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Control type='password' placeholder='Password' id='password' onChange={handleChange} />
                    <Form.Text hidden={!isNotValid.password} className='text-danger'>
                      {isNotValid.password}
                    </Form.Text>
                  </Form.Group>

                  <Button type='submit' className='bg-main bg-hover border-0'>
                    {action}
                  </Button>
                </Form>
              </div>
              <p>
                Already registered? <Link to='/login'>Log In here!</Link>
              </p>
            </>
          )}
        </Col>
      </Row>
      <ToastContainer newestOnTop={true} autoClose={2000} closeOnClick />
    </Container>
  );
}

export default Authentication;
