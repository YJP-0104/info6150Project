import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Pagination,
  Form,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const { username } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  const postsPerPage = 5;

  // Fetch posts with filtering
  useEffect(() => {
    fetchNotes();
    fetchUsers();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs",
        {
          method: "GET",
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      setNotes(result.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };
  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), "MMM dd, yyyy");
    } catch {
      return "Recent";
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users",
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = notes.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(notes.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Community Posts</h3>
            <Form.Select
              style={{ width: "200px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Posts</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </Form.Select>
          </div>

          {currentPosts.map((note) => (
            <Card className="shadow-sm mb-4" key={note._id}>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <Card.Title>{note.title || "Untitled"}</Card.Title>
                  <Badge bg="primary">{note.category || "General"}</Badge>
                </div>

                <Card.Subtitle className="mb-2 text-muted">
                  Posted by {note.username || username || "Anonymous"} •{" "}
                  {formatDate(note.timestamp)}
                </Card.Subtitle>

                <Card.Text>
                  {note.content
                    ? note.content.slice(0, 200) + "..."
                    : "No content available."}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {note.tags?.map((tag, index) => (
                      <Badge bg="secondary" className="me-2" key={index}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
