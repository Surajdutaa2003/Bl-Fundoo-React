import React from "react";
import NoteCard from "../components/NotesContainer/NoteCard";

function NotesList({ notes = [], updateNotesList, searchQuery }) {
  if (!Array.isArray(notes)) {
    console.error("Invalid notes prop received:", notes);
    return <p>Error: Notes data is invalid</p>;
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-grid">
      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <NoteCard key={note.id} handleNoteList={updateNotesList} note={note} container="notes" />
        ))
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
}

export default NotesList;
