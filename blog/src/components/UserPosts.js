import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";

const BlogPostCreator = () => {
  const { username } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const cleanContent = stripHtmlTags(content);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogPost = {
      title,
      content: cleanContent,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const response = await fetch(
        "https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blogs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
          },
          body: JSON.stringify(blogPost),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Blog post created:", result);
        setTitle("");
        setContent("");
        setTags("");
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Create New Blog Post</h2>
                <p className="text-muted">Welcome, {username}</p>
              </Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Blog Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title"
                    required
                    className="form-control-lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Blog Content</Form.Label>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Write your blog content here..."
                    style={{ height: "300px", marginBottom: "50px" }}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
                    className="form-control-lg"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas to help categorize your post
                  </Form.Text>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 mt-4"
                >
                  Publish Blog Post
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogPostCreator;
