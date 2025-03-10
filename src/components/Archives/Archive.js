import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getArchivedNotes } from "../../services/api";
import NoteCard from "../NotesContainer/NoteCard";
import "../DashboardContainer/Dashboard.css";

function Archive() {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const { searchQuery = "",isGridView } = useOutletContext() || {}; // Access searchQuery from Dashboard

  // Debug searchQuery to confirm it's being received
  console.log("Archive rendering with searchQuery:", searchQuery);

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getArchivedNotes();
      console.log("Raw archived notes API response:", response);
      const notes = Array.isArray(response) ? response : response?.data?.details || response?.data?.data || [];
      setArchivedNotes(notes.map(note => ({
        id: note._id || note.id || Date.now().toString(),
        title: note.title || "",
        description: note.description || "",
        color: note.color || "#FFFFFF",
        isArchived: note.isArchived || true,
        reminder: note.reminder || null,
      })) || []);
    } catch (err) {
      console.error("Error fetching archived notes:", err);
      setError("Failed to load archived notes. Please try again.");
      setArchivedNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter archived notes based on searchQuery
  const filteredNotes = useMemo(() => {
    const result = archivedNotes.filter(note =>
      (note.title || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      (note.description || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    );
    console.log("Filtered archived notes for searchQuery:", searchQuery, "Result:", result);
    return result;
  }, [archivedNotes, searchQuery]);

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
      {isLoading && <p>Loading archived notes...</p>}
      {error && <p className="error">{error}</p>}
      
      {!isLoading && !error && (
        <div className={`notes-grid ${isGridView ? "grid-view" : "list-view"}`}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                handleNoteList={handleNotes} 
                container="archive" 
                isGridView={isGridView}
              />
            ))
          ) : (
            <p>No archived notes match your search</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Archive;