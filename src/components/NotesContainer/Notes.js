import React, { useEffect, useState, useCallback, useMemo } from "react";
import NoteCard from "./NoteCard";
import AddNote from "../../components/AddNote/AddNote";
import { getUserNotes } from "../../services/api";
import { useOutletContext } from "react-router-dom";
import "../NotesContainer/NotesContainer.scss";
import { IconButton } from "@mui/material";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import ImageIcon from "@mui/icons-material/Image";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Notes() {
  const [notesList, setNotesList] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchQuery = "" } = useOutletContext() || {};

  console.log("Notes rendering with searchQuery:", searchQuery);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUserNotes();
      console.log("Raw API response:", res);
      const notes = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : res.data?.details || res.data?.data || [];
      const activeNotes = notes.filter((note) => !note.isArchived);
      console.log("Active notes:", activeNotes);
      setNotesList(activeNotes.map(note => ({
        id: note._id || note.id || Date.now().toString(),
        title: note.title || "",
        description: note.description || "",
        color: note.color || "#FFFFFF",
        isArchived: note.isArchived || false,
        reminder: note.reminder || null,
      })));
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
      setNotesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = useMemo(() => {
    const result = notesList.filter(note => 
      (note.title || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      (note.description || "").toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    );
    console.log("Filtered notes for searchQuery:", searchQuery, "Result:", result);
    return result;
  }, [notesList, searchQuery]);

  const updateNotesList = useCallback((updatedNote, action) => {
    console.log("Updating notes list with:", updatedNote, "Action:", action);
    if (action === "add") {
      setNotesList(prevNotes => [updatedNote, ...prevNotes]);
    } else if (action === "archive" || action === "delete" || action === "trash") {
      setNotesList(prev => prev.filter((note) => note.id !== updatedNote.id));
    } else if (action === "update") {
      setNotesList(prevNotes => prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    }
    if (action === "update" && editingNote && editingNote.id === updatedNote.id) {
      setEditingNote(updatedNote);
    }
  }, [editingNote]);

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  return (
    <div className="notes-section">
      <AddNote onNoteAdded={(newNote) => updateNotesList(newNote, "add")} />
      
      {isLoading && <p>Loading notes...</p>}
      {error && <p className="error">{error}</p>}
      
      {!isLoading && !error && (
        <div className="notes-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard 
                key={note.id}
                handleNoteList={updateNotesList} 
                note={note} 
                container="notes" 
                onEdit={handleEdit}
              />
            ))
          ) : (
            <p>No notes match your search</p>
          )}
        </div>
      )}

      {/* {editingNote && (
        <div className="expanded-note-overlay" onClick={() => setEditingNote(null)}>
          <div className="expanded-note" onClick={(e) => e.stopPropagation()}>
            <div className="note-input-header">
              <input
                type="text"
                placeholder="Title"
                value={editingNote.title || ""}
                onChange={(e) => updateNotesList({ ...editingNote, title: e.target.value }, "update")}
                className="note-input-title"
              />
              <IconButton size="small" className="pin-icon" aria-label="Pin note">
                <PushPinOutlinedIcon />
              </IconButton>
            </div>
            <textarea
              placeholder="Note"
              value={editingNote.description || ""}
              onChange={(e) => updateNotesList({ ...editingNote, description: e.target.value }, "update")}
              className="note-input-description"
            />
            <div className="note-input-actions">
              <IconButton size="small" aria-label="Add reminder">
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton size="small" aria-label="Collaborate">
                <PersonAddIcon />
              </IconButton>
              <IconButton size="small" aria-label="Change color">
                <PaletteIcon />
              </IconButton>
              <IconButton size="small" aria-label="Add image">
                <ImageIcon />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="Archive note"
                onClick={() => updateNotesList(editingNote, "archive")}
              >
                <ArchiveIcon />
              </IconButton>
              <IconButton size="small" aria-label="More options">
                <MoreVertIcon />
              </IconButton>
              <IconButton size="small" aria-label="Undo">
                <ArrowBackIcon />
              </IconButton>
              <IconButton size="small" aria-label="Redo">
                <ArrowForwardIcon />
              </IconButton>
              <button className="close-button" onClick={() => setEditingNote(null)}>
                Close
              </button>
              <span className="edited-date">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Notes;