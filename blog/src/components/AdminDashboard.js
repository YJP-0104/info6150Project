import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Alert,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const API_URL =
    "https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users/";

  const DELETE_URL =
    "https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/users";
  const AUTH_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I"; // Update with your actual token

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: AUTH_KEY,
        },
      });

      const data = await response.json();

      // Check if data.data is an array before setting it
      if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setError("Invalid user data received.");
      }
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await fetch(`${DELETE_URL}/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: AUTH_KEY,
          },
        });
        fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        setError("Failed to delete user.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);

    const userId = selectedUser._id; // Assuming the user ID is in _id field

    try {
      const response = await fetch(
        `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/${userId}`, // Ensure you're using the correct endpoint
        {
          method: "PUT", // Use PUT to update the existing resource
          headers: {
            "Content-Type": "application/json",
            Authorization: AUTH_KEY,
          },
          body: JSON.stringify(updatedData), // Send only the updated data
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Update successful:", data);
        fetchUsers(); // Refresh the list after updating
        handleCloseModal();
      } else {
        console.error("Update failed:", data.message);
        setError(data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error during update:", error);
      setError("Error during update.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th> {/* Added Password Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td> {/* Displaying the User ID */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td> {/* Displaying the Password */}
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal(user)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Update User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={selectedUser?.name}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={selectedUser?.email}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                defaultValue={selectedUser?.password} // If needed
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;