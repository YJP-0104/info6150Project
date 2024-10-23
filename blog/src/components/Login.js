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
} from "react-bootstrap";
import { PersonFill, LockFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
