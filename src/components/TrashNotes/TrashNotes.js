import React, { useEffect, useState, useCallback, useMemo } from "react";
import NoteCard from "../NotesContainer/NoteCard";
import { getTrashNotes, getUserNotes, deletePermanently } from "../../services/api";
import { useOutletContext } from "react-router-dom";
import "../NotesContainer/NotesContainer.scss"; // Changed to use shared styles

function TrashNotes() {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const { searchQuery = "", setNotesList, isGridView } = useOutletContext() || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrashedNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTrashNotes({ cache: "no-store" });
      console.log("Raw API response from getTrashNotes:", res);
      const trashedNotesList = res?.data?.data?.map(note => ({
        ...note,
        color: note.color || "#FFFFFF",
        isDeleted: true,
      })) || [];
      console.log("Fetched Trashed notes:", trashedNotesList);
      setTrashedNotes(trashedNotesList);
      if (setNotesList) {
        const activeRes = await getUserNotes({ cache: "no-store" });
        const activeNotes = activeRes?.data?.data?.filter(note => !note.isDeleted && !note.isArchived) || [];
        setNotesList(activeNotes.map(note => ({
          id: note._id || note.id,
          title: note.title || "",
          description: note.description || "",
          color: note.color || "#FFFFFF",
          isArchived: note.isArchived || false,
          isDeleted: note.isDeleted || false,
          reminder: note.reminder || null,
        })));
      }
    } catch (err) {
      console.error("Error fetching trashed notes:", err);
      setError("Failed to load trashed notes. Please try again.");
      setTrashedNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [setNotesList]);

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  const filteredNotes = useMemo(() => {
    const result = trashedNotes.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("Filtered trashed notes for searchQuery:", searchQuery, "Result:", result);
    return result;
  }, [trashedNotes, searchQuery]);

  const updateNotesList = useCallback((updatedNote, action) => {
    console.log("Updating trashed notes with:", updatedNote, "Action:", action, "Current TrashedNotes:", trashedNotes);
    if (action === "delete") {
      setTrashedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
      fetchTrashedNotes();
    } else if (action === "restore") {
      setTrashedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
      if (setNotesList) {
        setNotesList((prev) => [...prev, { ...updatedNote, isDeleted: false }]);
      }
      fetchTrashedNotes();
    } else if (action === "permanentDelete") {
      setTrashedNotes((prev) => prev.filter((note) => note.id !== updatedNote.id));
      handlePermanentDelete(updatedNote.id);
      fetchTrashedNotes();
    } else if (action === "update") {
      setTrashedNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
    }
  }, [setNotesList, fetchTrashedNotes]);

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
      {isLoading && <p>Loading trashed notes...</p>}
      {error && <p className="error">{error}</p>}
      
      {!isLoading && !error && (
        <div className={`notes-grid ${isGridView ? "grid-view" : "list-view"}`}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                handleNoteList={updateNotesList}
                note={note}
                container="trash"
                isGridView={isGridView}
              />
            ))
          ) : (
            <p>No notes in trash match your search</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TrashNotes;