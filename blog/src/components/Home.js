import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import CommentSection from "./Comment";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { username } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showComments, setShowComments] = useState(false);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "http://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs",
        {
          method: "GET",
          headers: {
            Authorization: process.env.REACT_APP_AUTH_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      const fetchedPosts = result.data || [];
      fetchedPosts.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, filter]);

  const filterPosts = () => {
    let filtered = posts;

    if (filter === "recent") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), "MMM dd, yyyy");
    } catch {
      return "Recent";
    }
  };

  const handleShowPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    setShowComments(false); // Reset comments visibility for new post
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <div className="mb-4">
            <h3 className="mb-3">Community Posts</h3>
            <Form.Control
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-100"
            />
          </div>

          {filteredPosts.map((note) => (
            <Card className="shadow-sm mb-4" key={note._id}>
              <Card.Body>
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
                  <Button
                    variant="outline-primary"
                    onClick={() => handleShowPost(note)}
                  >
                    Read More
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="lg"
            scrollable
          >
            {selectedPost && (
              <>
                <Modal.Header closeButton>
                  <Modal.Title>{selectedPost.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text-muted mb-2">
                        Posted by{" "}
                        {selectedPost.username || username || "Anonymous"}
                      </p>
                      <small className="text-muted">
                        {formatDate(selectedPost.timestamp)}
                      </small>
                    </div>
                    <p
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                    <div>
                      {selectedPost.tags?.map((tag, index) => (
                        <Badge bg="secondary" className="me-2" key={index}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleToggleComments}
                    className="mb-3"
                  >
                    {showComments ? "Hide Comments" : "Show Comments"}
                  </Button>

                  <CommentSection
                    postId={selectedPost._id}
                    username={username}
                    isVisible={showComments}
                  />
                </Modal.Body>
              </>
            )}
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
