import React, { useEffect, useState } from "react";
import NoteCard from "../NotesContainer/NoteCard";
import { getUserNotes } from "../../services/api";

function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    try {
      const res = await getUserNotes();
      console.log("Fetched Archived Notes:", res);
      // 🔹 Filter only archived notes
      const archived = res?.data?.data?.filter((note) => note.isArchived) || [];
      setArchivedNotes(archived);
    } catch (err) {
      console.error("Error fetching archived notes:", err);
      setArchivedNotes([]);
    }
  };

  const updateArchivedList = (updatedNote, action) => {
    if (action === "unarchive") {
      // 🔹 Remove unarchived notes from archive list
      setArchivedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
    }
  };

  return (
    <div className="notes-section">
      <h2>Archived Notes</h2>
      <div className="notes-grid">
        {archivedNotes.length > 0 ? (
          archivedNotes.map((note, index) => (
            <NoteCard key={index} handleNoteList={updateArchivedList} note={note} />
          ))
        ) : (
          <p>No archived notes</p>
        )}
      </div>
    </div>
  );
}

// export default Archive;
