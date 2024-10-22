import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const NoteDetail = () => {
  const { id } = useParams(); // Get note ID from URL params
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching the note by ID
    const dummyNotes = {
      id: 1,
      title: "First Note",
      content: "This is the content of the first note.",
    };
    const foundNote = dummyNotes;
    if (foundNote) {
      setNote(foundNote);
    } else {
      setError("Note not found");
    }

    setLoading(false);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {note ? (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ) : (
        <p>Note not found</p>
      )}
    </div>
  );
};

export default NoteDetail;
