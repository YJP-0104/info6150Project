import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Dashboard = () => {
  const { isAuthenticated, username, userid } = useSelector(
    (state) => state.auth
  );
  const [notes, setNotes] = useState([]); // Ensure notes is initialized as an empty array
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  // const navigate = useNavigate();

  // Fetch user's posts from API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(
          "https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users",
          {
            method: "GET",
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();
        setNotes(data.notes || []); // Safely set notes or fallback to an empty array
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]); // Set an empty array on error to prevent further issues
      }
    };

    fetchNotes();
  }, []);

  // Edit a note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
    setEditMode(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Your Posts</h3>
          {notes && notes.length > 0 ? ( // Check if notes exist before rendering
            notes.map((note) => (
              <Card className="shadow-sm mb-3" key={note.id}>
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.content.slice(0, 200)}...</Card.Text>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </Button>
                  <Link to={`/note/${note.id}`}>Read More</Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
