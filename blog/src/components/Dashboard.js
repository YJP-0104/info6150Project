// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Dashboard = () => {
  // const { username } = useSelector((state) => state.auth);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tags, setTags] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const API_BASE_URL =
    "https://smooth-comfort-405104.uc.r.appspot.com/document";
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I";

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/findAll/blogs`, {
        method: "GET",
        headers: {
          Authorization: AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const result = await response.json();
      setNotes(result.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEdit = (note) => {
    setTitle(note.title || "");
    setContent(note.content || "");
    setEditId(note._id);
    setTags(note.tags?.join(", ") || "");
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blogs",
        {
          method: "PUT",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: editId,
            title: title,
            tags: tags.split(",").map((tag) => tag.trim()),
            content: content,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      // Check response status and log if there’s an error
      if (!response.ok) {
        const text = await response.text();
        console.error("Response Error Text:", text);
        throw new Error(
          "Failed to update blog. Please check the server response."
        );
      }

      const result = await response.json();

      if (result.status === "success") {
        // Update the local state with the new blog data
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editId ? { ...note, title, content } : note
          )
        );

        // Reset form
        setEditMode(false);
        setEditId(null);
        setTitle("");
        setContent("");

        // Optionally refetch the notes
        await fetchNotes();
      } else {
        throw new Error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Update failed: " + error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteOne/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete the note");

      // Fetch updated notes after deletion
      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Your Posts</h3>
          {editMode ? (
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    theme="snow"
                    modules={modules}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas (e.g., technology, programming)
                  </Form.Text>
                </Form.Group>
                <Button
                  variant="success"
                  className="mt-3 me-2"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => {
                    setEditMode(false);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Cancel
                </Button>
              </Card.Body>
            </Card>
          ) : notes && notes.length > 0 ? (
            notes.map((note) => (
              <Card className="shadow-sm mb-3" key={note._id}>
                <Card.Body>
                  <Card.Title>{note.title || "Untitled"}</Card.Title>
                  <Card.Text>
                    {note.content
                      ? note.content.slice(0, 200)
                      : "No content available."}
                    ...
                  </Card.Text>
                  <div className="mb-3">
                    {note.tags?.map((tag, index) => (
                      <Badge bg="secondary" className="me-2" key={index}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="me-2"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </Button>
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
