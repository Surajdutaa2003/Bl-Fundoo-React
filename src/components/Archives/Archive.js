import React, { useEffect, useState } from "react";
import { getArchivedNotes } from "../../services/api";
import NoteCard from "../NotesContainer/NoteCard";
import "../DashboardContainer/Dashboard.css";

function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    try {
      const response = await getArchivedNotes();
      setArchivedNotes(response?.data?.data?.map(note => ({
        ...note,
        color: note.color || "#FFFFFF" // Use API's color or default to white
      })) || []);
    } catch (err) {
      console.error("Error fetching archived notes:", err);
    }
  };
  
  const handleNotes = (noteDetails, action) => {
    if (action === "unarchive" || action === "delete" || action === "trash") {
      setArchivedNotes((prev) => prev.filter((note) => note.id !== noteDetails?.id));
    } else if (action === "update") {
      setArchivedNotes(prevNotes => prevNotes.map(note => 
        note.id === noteDetails.id ? noteDetails : note
      ));
    }
  };

  return (
    <div className="notes-section">
     
      <div className="notes-grid">
        {archivedNotes.length > 0 ? (
          archivedNotes.map((note) => (
            <NoteCard key={note.id} note={note} handleNoteList={handleNotes} container="archive" />
          ))
        ) : (
          <p>No archived notes available</p>
        )}
      </div>
    </div>
  );
}

export default Archive;