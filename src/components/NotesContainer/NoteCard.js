import React, { useState, useEffect } from "react"; // Ensure useState and useEffect are imported
import "../DashboardContainer/Dashboard.css";
import NoteActions from "../NotesAction/NotesAction";

function NoteCard({ note, handleNoteList, container }) {
  const [backgroundColor, setBackgroundColor] = useState(note?.color || "#FFFFFF");
  const [isHovered, setIsHovered] = useState(false); // Add state for hover

  useEffect(() => {
    // Sync backgroundColor with the note prop whenever it changes
    setBackgroundColor(note?.color || "#FFFFFF");
  }, [note]);

  if (!note) {
    return null;
  }

  const handleColorChange = (noteId, color) => {
    if (noteId === note.id) {
      setBackgroundColor(color);
    }
  };

  return (
    <div
      className="note-card relative p-4 border rounded-md shadow-md"
      style={{ backgroundColor, position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{note.title || "Untitled"}</h3>
      <p>{note.description || "No description available"}</p>
      <div className={`note-actions-container ${container === "trash" ? "trash-actions" : ""}`}>
        {container === "trash" ? (
          isHovered && (
            <NoteActions 
              handleNoteList={handleNoteList} 
              note={note} 
              container={container}
              onColorChange={handleColorChange}
            />
          )
        ) : (
          <NoteActions 
            handleNoteList={handleNoteList} 
            note={note} 
            container={container}
            onColorChange={handleColorChange}
          />
        )}
      </div>
    </div>
  );
}

export default NoteCard;
// mm