import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Spinner, Card, Container, Alert } from "react-bootstrap";

const CommentSection = ({ postId, username }) => {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch comments for the specific post when comments are shown
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://smooth-comfort-405104.uc.r.appspot.com/document/findAll/comment`,
        {
          method: "GET",
          headers: {
            Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch comments");

      const result = await response.json();
      const filteredComments = result.data.filter(
        (comment) => comment.postId === postId
      );
      setComments(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Error fetching comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleComment = async () => {
    const cleanContent = stripHtmlTags(commentValue);
    const displayUsername = username || "Anonymous";

    try {
      const commentData = {
        postId,
        content: cleanContent,
        username: displayUsername,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `http://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${process.env.REACT_APP_AUTH_TOKEN}`,
          },
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        setComments((prevComments) => [...prevComments, commentData]);
        setCommentValue("");
      } else {
        console.error("Failed to post comment:", response.statusText);
        setError("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Error posting comment. Please try again.");
    }
  };

  // Only fetch comments when the user opens the comment section
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  return (
    <Container>
      <Button
        variant="primary"
        onClick={() => setShowComments((prev) => !prev)}
        className="my-3"
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </Button>

      {showComments && (
        <Container className="mt-3">
          {loading ? (
            <Spinner animation="border" className="d-block mx-auto my-3" />
          ) : (
            <>
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              <h5 className="text-primary mb-4">Comments</h5>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Card className="p-3 mb-3 shadow-sm" key={index}>
                    <Card.Title className="text-muted">
                      <strong>{comment.username}</strong>
                    </Card.Title>
                    <Card.Text
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                    <Card.Footer
                      className="text-muted text-end"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {new Date(comment.timestamp).toLocaleString()}
                    </Card.Footer>
                  </Card>
                ))
              ) : (
                <p className="text-muted">
                  No comments yet. Be the first to comment!
                </p>
              )}
              <ReactQuill
                value={commentValue}
                onChange={setCommentValue}
                modules={modules}
                theme="snow"
                placeholder="Write your comment here..."
                className="my-3"
              />
              <Button
                variant="success"
                onClick={handleComment}
                className="my-2 d-block mx-auto"
                disabled={!commentValue.trim()}
              >
                Post Comment
              </Button>
            </>
          )}
        </Container>
      )}
    </Container>
  );
};

export default CommentSection;
