import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const { isAuthenticated, username, userid } = useSelector(
    (state) => state.auth
  );

  // Dummy notes data
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch notes (here we use dummy data)
    const dummyNotes = [
      {
        id: 1,
        title: "First Note",
        content: "This is the content of the first note.",
      },
      {
        id: 2,
        title: "Second Note",
        content: "Here is some more content for the second note.",
      },
      {
        id: 3,
        title: "Third Note",
        content: "Third note with some different content.",
      },
    ];

    setNotes(dummyNotes);
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome {username} your notes dashboard!</p>

      <div>
        <h3>Your Notes:</h3>
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
              }}
            >
              <h4>{note.title}</h4>
              <p>{note.content.slice(0, 100)}...</p>
              {/* Link to the note details page */}
              <Link to={`/note/${note.id}`}>Read More</Link>{" "}
            </div>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
