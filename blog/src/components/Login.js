import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateLogin } from "../store/authSliceThunk";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Spinner,
  Modal,
} from "react-bootstrap";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validateLogin({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long and strong.");
      return;
    }
    try {
      await fetch(
        `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );
      setShowModal(false);
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">
                  Please enter your credentials to login
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading className="h6">Login Error</Alert.Heading>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <PersonFill className="me-2" />
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center">
                    <LockFill className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 ms-1"
                      onClick={() => navigate("/register")}
                    >
                      Register here
                    </Button>
                  </p>
                  <Button
                    variant="link"
                    className="p-0 ms-1"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </Form>

              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Update Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
