import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={7}>
          <Card className="text-center shadow">
            <Card.Header>
              <h2>Logout</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>Are you sure you want to logout?</Card.Text>
              <Button
                variant="danger"
                size="lg"
                onClick={handleLogout}
                className="px-3"
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Logout;
