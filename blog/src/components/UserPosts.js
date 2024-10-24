import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const UserPosts = () => {
  const { isAuthenticated, username, userid } = useSelector(
    (state) => state.auth
  );

  const [notes, setNotes] = useState([]); // Ensure notes is initialized as an empty array
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  //   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newNote = {
      title,
      content,
    };

    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users/${editId}`
      : "https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error("Failed to submit note");
      }

      const updatedNotes = await response.json();
      setNotes(updatedNotes.notes || []); // Ensure updated data is handled safely
      setTitle("");
      setContent("");
      setEditMode(false);
    } catch (err) {
      console.error("Error during post submission:", err);
    }
  };

  // Edit a note
  //   const handleEdit = (note) => {
  //     setTitle(note.title);
  //     setContent(note.content);
  //     setEditId(note.id);
  //     setEditMode(true);
  //   };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Welcome {username}, your notes dashboard!</h2>
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    theme="snow"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  {editMode ? "Update Post" : "Create Post"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPosts;
