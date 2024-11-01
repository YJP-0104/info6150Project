import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Pagination,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});

  const postsPerPage = 5;
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };
  // Fetch posts with filtering
  useEffect(() => {
    fetchposts();
    fetchUsers();
  }, [filter]);

  // Get Posts from the Api
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
      setposts(result.data || []);
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
  // Get User from the Api
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
  // Get Comments from the Api
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
  // Store comments to the Api
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
        // Update local comments state immediately
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

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          {/* Filter Section */}
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

          {/* Posts List */}
          {currentPosts.map((note) => (
            <Card className="shadow-sm mb-4" key={note._id}>
              <Card.Body>
                {/* <div className="d-flex justify-content-between mb-2">
                  <Card.Title>{note.title || "Untitled"}</Card.Title>
                  <Badge bg="primary">{note.category || "General"}</Badge>
                </div> */}

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

          {/* Post Detail Modal */}
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
                    <div className="post-content mb-3">
                      {selectedPost.content}
                    </div>
                    <div className="mt-3">
                      {selectedPost.tags?.map((tag, index) => (
                        <Badge bg="secondary" className="me-2" key={index}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <hr />

                  {/* Comments Section */}
                  <h5 className="mb-3">Comments</h5>
                  <div className="mb-4">
                    <ReactQuill
                      theme="snow"
                      value={comment}
                      onChange={setComment}
                      modules={modules}
                      placeholder="Write a comment..."
                      style={{ height: "150px", marginBottom: "50px" }}
                    />
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => handleComment(selectedPost._id)}
                      disabled={!comment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>

                  <div className="comments-section">
                    {comments[selectedPost._id]?.map((comment, index) => (
                      <Card key={index} className="mb-3 border-0 bg-light">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong className="text-primary">
                              {comment.username}
                            </strong>
                            <small className="text-muted">
                              {formatDate(comment.timestamp)}
                            </small>
                          </div>
                          <div className="comment-content">
                            {comment.content}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Modal.Body>
              </>
            )}
          </Modal>

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
