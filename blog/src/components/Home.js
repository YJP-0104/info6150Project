
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [notes, setNotes] = useState([]);
  
  // Fetch user's posts from API
  useEffect(() => {
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

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const result = await response.json();
        setNotes(result.data || []); // Access the `data` array directly
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]); // Set an empty array on error to prevent further issues
      }
    };

    fetchNotes();
  }, []);

 

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Your Posts</h3>
          {notes && notes.length > 0 ? ( // Check if notes exist before rendering
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

                  {/* <Link to={`/note/${note._id}`}>Read More</Link> */}
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

export default Home;
