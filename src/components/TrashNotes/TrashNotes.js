import React, { useEffect, useState } from "react";
import NoteCard from "../NotesContainer/NoteCard";
import "../DashboardContainer/Dashboard.css";
import { getTrashNotes } from "../../services/api";
import { useOutletContext } from "react-router-dom";

function TrashNotes() {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const { searchQuery } = useOutletContext();

  useEffect(() => {
    fetchTrashedNotes();
  }, []);

  const fetchTrashedNotes = async () => {
    try {
      const res = await getTrashNotes();
      const trashedNotesList = res?.data?.data?.map(note => ({
        ...note,
        color: note.color || "#FFFFFF" // Use API's color or default to white
      })) || [];
      setTrashedNotes(trashedNotesList);
    } catch (err) {
      console.error("Error fetching trashed notes:", err);
      setTrashedNotes([]);
    }
  };

  const filteredNotes = trashedNotes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateNotesList = (updatedNote, action) => {
    if (action === "delete" || action === "restore" || action === "deleteForever") {
      setTrashedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
    } else if (action === "update") {
      setTrashedNotes(prevNotes => prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    }
  };

  return (
    <div className="notes-section">
      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <NoteCard
              key={index}
              handleNoteList={updateNotesList}
              note={note}
              container="trash"
            />
          ))
        ) : (
          <p>No notes in trash match your search</p>
        )}
      </div>
    </div>
  );
}

export default TrashNotes;