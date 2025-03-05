import React, { useEffect, useState, useCallback, useMemo } from "react";
import NoteCard from "./NoteCard";
import AddNote from "../../components/AddNote/AddNote";
// import "../DashboardContainer/Dashboard.css";
import { getUserNotes } from "../../services/api";
import { useOutletContext } from "react-router-dom";
import "../NotesContainer/NotesContainer.scss";

function Notes() {
  const [notesList, setNotesList] = useState([]);
  const { searchQuery = "" } = useOutletContext() || {}; // Default to empty string if undefined
  console.log("Notes rendering with searchQuery:", searchQuery);

  useEffect(() => {
    fetchNotes();
  }, []); // Fetch notes on mount, no dependencies for initial load

  const fetchNotes = async () => {
    try {
      const res = await getUserNotes();
      const activeNotes = res?.data?.data?.filter((note) => !note.isArchived) || [];
      setNotesList(activeNotes.map(note => ({
        ...note,
        color: note.color || "#FFFFFF" // Use API's color or default to white
      })));
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotesList([]);
    }
  };

  const filteredNotes = useMemo(() => {
    return notesList.filter(note => 
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notesList, searchQuery]); // Memoize filtered notes to prevent unnecessary re-renders

  const updateNotesList = useCallback((updatedNote, action) => {
    if (action === "add") {
      setNotesList(prevNotes => [updatedNote, ...prevNotes]);
    } else if (action === "archive" || action === "delete" || action === "trash") {
      setNotesList(prev => prev.filter((note) => note.id !== updatedNote.id));
    } else if (action === "update") {
      setNotesList(prevNotes => prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    }
  }, []); // Memoize to prevent unnecessary re-renders in NoteCard

  return (
    <div className="notes-section">
      <AddNote onNoteAdded={(newNote) => updateNotesList(newNote, "add")} />
      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
            <NoteCard 
              key={note.id} // Use note.id for better performance
              handleNoteList={updateNotesList} 
              note={note} 
              container="notes" 
            />
          ))
        ) : (
          <p>No notes match your search</p>
        )}
      </div>
    </div>
  );
}

export default Notes;