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

const Home = () => {
  const [posts, setposts] = useState([]);
  const user = useSelector((state) => state.auth);
  const { username } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  useEffect(() => {
    fetchposts();
    fetchUsers();
  }, [filter]);

  const fetchposts = async () => {
    try {
      const response = await fetch(
        "http://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs",
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
      const fetchedPosts = result.data || [];

      // Sort posts by timestamp in descending order (latest first)
      fetchedPosts.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setposts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setposts([]);
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
        "http://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users",
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
      setUsers(result.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(
        `http://smooth-comfort-405104.uc.r.appspot.com/document/findOne/comments/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
          },
        }
      );
      const result = await response.json();
      setComments({ ...comments, [postId]: result.data || [] });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const cleanContent = stripHtmlTags(comment);

  const handleComment = async (postId) => {
    try {
      const commentData = {
        postId,
        content: cleanContent,
        username: username,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        "http://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
          },
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: [...(prevComments[postId] || []), commentData],
        }));
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleShowPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    fetchComments(post._id);
  };

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

          {posts.map((note) => (
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
                  <div>
                    <h6>Comments:</h6>
                    {comments[selectedPost._id]?.length > 0 ? (
                      comments[selectedPost._id].map((comment, index) => (
                        <div className="mb-3" key={index}>
                          <strong>{comment.username}:</strong>{" "}
                          <span>{comment.content}</span>
                          <br />
                          <small className="text-muted">
                            {formatDate(comment.timestamp)}
                          </small>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}
                  </div>
                  <Form.Control
                    as={ReactQuill}
                    modules={modules}
                    value={comment}
                    onChange={(content) => setComment(content)}
                    className="my-2"
                    placeholder="Add a comment..."
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleComment(selectedPost._id)}
                    disabled={!comment.trim()}
                  >
                    Comment
                  </Button>
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
