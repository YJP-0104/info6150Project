import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateLogin } from "../Store/authSliceThunk";
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
  InputGroup,
} from "react-bootstrap";
import {
  PersonFill,
  LockFill,
  EyeFill,
  EyeSlashFill,
  EnvelopeFill,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Reset Password States
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/posts");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(validateLogin({ username, password }));
  };

  const validateResetForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(resetEmail)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (validateResetForm()) {
      setResetLoading(true);
      setResetMessage("");

      try {
        const fetchResponse = await fetch(
          "https://smooth-comfort-405104.uc.r.appspot.com/document/findALL/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
            },
          }
        );

        const data = await fetchResponse.json();

        if (!fetchResponse.ok || data.status !== "success") {
          throw new Error("Error fetching user data");
        }

        const user = data.data.find((user) => user.email === resetEmail);

        if (!user) {
          setResetMessage("No user found with that email address");
          return;
        }

        const updateResponse = await fetch(
          `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/${user._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
            },
            body: JSON.stringify({ pass: newPassword }),
          }
        );

        const updateData = await updateResponse.json();

        if (updateResponse.ok && updateData.status === "success") {
          setResetMessage("Password has been successfully updated");
          setTimeout(() => {
            setShowResetModal(false);
            resetForm();
          }, 2000);
        } else {
          throw new Error("Error updating password");
        }
      } catch (error) {
        setResetMessage("Error updating password. Please try again");
      } finally {
        setResetLoading(false);
      }
    }
  };

  const resetForm = () => {
    setResetEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setResetMessage("");
    setResetErrors({});
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
                <Alert variant="danger">
                  <Alert.Heading className="h6">Login Error</Alert.Heading>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleLogin}>
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
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
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
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setShowResetModal(true)}
                    disabled={loading}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resetMessage && (
            <Alert
              variant={
                resetMessage.includes("successfully") ? "success" : "danger"
              }
            >
              {resetMessage}
            </Alert>
          )}
          <Form onSubmit={handlePasswordReset}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <EnvelopeFill className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                isInvalid={!!resetErrors.email}
                disabled={resetLoading}
              />
              <Form.Control.Feedback type="invalid">
                {resetErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <LockFill className="me-2" />
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isInvalid={!!resetErrors.newPassword}
                disabled={resetLoading}
              />
              <Form.Control.Feedback type="invalid">
                {resetErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <LockFill className="me-2" />
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!resetErrors.confirmPassword}
                disabled={resetLoading}
              />
              <Form.Control.Feedback type="invalid">
                {resetErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Updating Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
