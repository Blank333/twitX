import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <>
      {token && (
        <Row className='home'>
          <Col md={3} sm={12}>
            <Sidebar />
          </Col>
          <Col md={9} sm={12}>
            <Outlet />
          </Col>
        </Row>
      )}
      <ToastContainer newestOnTop={true} autoClose={2000} closeOnClick />
    </>
  );
}

export default App;
