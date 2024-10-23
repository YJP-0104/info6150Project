import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = {
      user: username,
      email: Email,
      pass: password,
    };

    try {
      const response = await fetch(
        "https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjI2YmNmMTdkODMwMjQzZWQ2NTVkMCIsInVzZXJuYW1lIjoiWWFzaCIsImlhdCI6MTcyNzE2MzM0OCwiZXhwIjoxNzI5MzIzMzQ4fQ.ejygD3heL5fwP8Dguvw7_WKowD1wJv9oWPR2uKKtkt4",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(`Registration failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Register</h2>
              </Card.Title>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
