import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getReminderNotes } from "../../services/api";
import NoteCard from "../NotesContainer/NoteCard";
import "../NotesContainer/NotesContainer.scss";

function Reminders() {
  const [reminderNotes, setReminderNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchQuery = "",isGridView } = useOutletContext() || {};

  console.log("Reminders rendering with searchQuery:", searchQuery);

  useEffect(() => {
    fetchReminderNotes();
  }, []);

  const fetchReminderNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getReminderNotes();
      console.log("Raw reminder notes API response:", response);
      const notes = Array.isArray(response) ? response : response?.data?.details || response?.data?.data || [];
      setReminderNotes(notes.map(note => ({
        id: note._id || note.id || Date.now().toString(),
        title: note.title || "",
        description: note.description || "",
        color: note.color || "#FFFFFF",
        isArchived: note.isArchived || false,
        reminder: note.reminder || null,
      })) || []);
    } catch (err) {
      console.error("Error fetching reminder notes:", err);
      setError("Failed to load reminder notes. Please try again.");
      setReminderNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = useMemo(() => {
    const result = reminderNotes.filter(note =>
      (note.title || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      (note.description || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    );
    console.log("Filtered reminder notes for searchQuery:", searchQuery, "Result:", result);
    return result;
  }, [reminderNotes, searchQuery]);

  const handleNotes = (noteDetails, action) => {
    if (action === "unarchive" || action === "delete" || action === "trash") {
      setReminderNotes((prev) => prev.filter((note) => note.id !== noteDetails?.id));
    } else if (action === "update") {
      setReminderNotes(prevNotes => prevNotes.map(note =>
        note.id === noteDetails.id ? noteDetails : note
      ));
    }
  };

  return (
    <div className="notes-section">
      {isLoading && <p>Loading reminder notes...</p>}
      {error && <p className="error">{error}</p>}
      
      {!isLoading && !error && (
        <div className={`notes-grid ${isGridView ? "grid-view" : "list-view"}`}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                handleNoteList={handleNotes}
                container="reminders"
                isGridView={isGridView}
              />
            ))
          ) : (
            <p>No reminder notes match your search</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Reminders;