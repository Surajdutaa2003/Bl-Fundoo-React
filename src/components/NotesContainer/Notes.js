import React, { useEffect, useState, useCallback, useMemo } from "react";
import NoteCard from "./NoteCard";
import AddNote from "../../components/AddNote/AddNote";
import { getUserNotes, deletePermanently } from "../../services/api";
import { useOutletContext } from "react-router-dom";
import "../NotesContainer/NotesContainer.scss";

function Notes({ container = "notes" }) {
  const [notesList, setNotesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchQuery = "", setTrashedNotes, isGridView } = useOutletContext() || {};

  console.log("Notes rendering with searchQuery:", searchQuery, "Container:", container, "NotesList:", notesList, "isGridView:", isGridView);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUserNotes({ cache: "no-store" });
      console.log("Raw API response from getUserNotes:", res);
      const notes = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : res.data?.details || res.data?.data || [];
      const activeNotes = notes.filter((note) => !note.isArchived && !note.isDeleted);
      const trashedNotes = notes.filter((note) => note.isDeleted);
      console.log("Fetched Active notes:", activeNotes, "Fetched Trashed notes:", trashedNotes);
      setNotesList(activeNotes.map(note => ({
        id: note._id || note.id,
        title: note.title || "",
        description: note.description || "",
        color: note.color || "#FFFFFF",
        isArchived: note.isArchived || false,
        isDeleted: note.isDeleted || false,
        reminder: note.reminder || null,
      })));
      if (setTrashedNotes) {
        setTrashedNotes(trashedNotes.map(note => ({
          id: note._id || note.id,
          title: note.title || "",
          description: note.description || "",
          color: note.color || "#FFFFFF",
          isArchived: note.isArchived || false,
          isDeleted: note.isDeleted || true,
          reminder: note.reminder || null,
        })));
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
      setNotesList([]);
    } finally {
      setIsLoading(false);
    }
  }, [setTrashedNotes]);

  useEffect(() => {
    fetchNotes();
  }, [container, fetchNotes]);

  const filteredNotes = useMemo(() => {
    const result = notesList.filter(note => 
      (note.title || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      (note.description || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    );
    console.log("Filtered notes for searchQuery:", searchQuery, "Result:", result);
    return result;
  }, [notesList, searchQuery]);

  const updateNotesList = useCallback((updatedNote, action) => {
    console.log("Updating notes list with:", updatedNote, "Action:", action, "Current NotesList:", notesList);
    if (action === "add") {
      setNotesList(prevNotes => [updatedNote, ...prevNotes]);
    } else if (action === "archive") {
      setNotesList(prev => prev.filter((note) => note.id !== updatedNote.id));
    } else if (action === "trash") {
      setNotesList(prev => prev.filter((note) => note.id !== updatedNote.id));
      if (setTrashedNotes) {
        setTrashedNotes(prev => [...prev, { ...updatedNote, isDeleted: true }]);
      }
      fetchNotes();
    } else if (action === "restore") {
      if (setTrashedNotes) {
        setTrashedNotes(prev => prev.filter((note) => note.id !== updatedNote.id));
      }
      setNotesList(prev => [...prev, { ...updatedNote, isDeleted: false }]);
      fetchNotes();
    } else if (action === "delete") {
      if (setTrashedNotes) {
        setTrashedNotes(prev => prev.filter((note) => note.id !== updatedNote.id));
      }
      handlePermanentDelete(updatedNote.id);
      fetchNotes();
    } else if (action === "update") {
      setNotesList(prevNotes => prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
      if (setTrashedNotes) {
        setTrashedNotes(prevNotes => prevNotes.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        ));
      }
    }
  }, [setTrashedNotes, fetchNotes]);

  const handlePermanentDelete = async (noteId) => {
    try {
      const response = await deletePermanently(noteId);
      console.log(`Permanently deleted note ${noteId}, Response:`, response);
    } catch (error) {
      console.error("Failed to permanently delete note:", error);
      alert("Failed to delete note permanently. Please try again.");
    }
  };

  return (
    <div className="notes-section">
      {container === "notes" && <AddNote onNoteAdded={(newNote) => updateNotesList(newNote, "add")} />}
      
      {isLoading && <p>Loading notes...</p>}
      {error && <p className="error">{error}</p>}
      
      {!isLoading && !error && (
        <div className={`notes-grid ${isGridView ? "grid-view" : "list-view"}`}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard 
                key={note.id}
                handleNoteList={updateNotesList} 
                note={note} 
                container={container} 
                onEdit={() => {}}
                isGridView={isGridView}
              />
            ))
          ) : (
            <p>No notes match your search</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Notes;