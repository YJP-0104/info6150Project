import React from "react";
import {
  Link,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar, Nav, Container, Alert } from "react-bootstrap";

import Dashboard from "./Dashboard";
import UserPosts from "./UserPosts";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import Home from "./Home";
import NoteDetail from "./NoteDetails";
import AdminLogin from "./loginAdmin";
import AdminDashboard from "./AdminDashboard";

const Navigation = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const StyledLink = ({ to, children, icon: Icon }) => (
    <Nav.Link as={Link} to={to} className="d-flex align-items-center gap-2">
      {Icon && <Icon />}
      {children}
    </Nav.Link>
  );

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
              Blog App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <StyledLink to="/">Home</StyledLink>
                {!isAuthenticated ? (
                  <>
                    <StyledLink to="/login">Login</StyledLink>
                    <StyledLink to="/register">Register</StyledLink>
                  </>
                ) : (
                  <>
                    <StyledLink to="/dashboard">Dashboard</StyledLink>
                    <StyledLink to="/posts">Posts</StyledLink>
                    <StyledLink to="/logout">Logout</StyledLink>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="flex-grow-1 mb-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/loginAdmin" element={<AdminLogin />} />

            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/logout"
              element={isAuthenticated ? <Logout /> : <Navigate to="/" />}
            />
            <Route
              path="/posts"
              element={isAuthenticated ? <UserPosts /> : <Navigate to="/" />}
            />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route
              path="/note/:id"
              element={isAuthenticated ? <NoteDetail /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={
                <Container className="text-center mt-5">
                  <Alert variant="warning">
                    <h1>404: Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <Link to="/" className="btn btn-primary mt-3">
                      Return Home
                    </Link>
                  </Alert>
                </Container>
              }
            />
          </Routes>
        </Container>

        <footer className="bg-dark text-light py-4 mt-auto">
          <Container className="text-center">
            <p className="mb-0">© Yash Jatin Patel 2024.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
};

export default Navigation;
