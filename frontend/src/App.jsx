import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Col, Row } from "react-bootstrap";

function App() {
  return (
    <Row className='vh-100'>
      <Col md={2} sm={12}>
        <Sidebar />
      </Col>
      <Col md={10} sm={12}>
        <Outlet />
      </Col>
    </Row>
  );
}

export default App;
