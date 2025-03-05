import React, { useEffect, useState, useCallback, useMemo } from "react";
import NoteCard from "./NoteCard";
import AddNote from "../../components/AddNote/AddNote";
// import "../DashboardContainer/Dashboard.css";
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
  const [editingNote, setEditingNote] = useState(null); // New state for managing the expanded/edited note
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
    if (action === "update" && editingNote && editingNote.id === updatedNote.id) {
      setEditingNote(updatedNote); // Sync editingNote with updates
    }
  }, [editingNote]); // Updated dependencies to include editingNote

  const handleEdit = (note) => {
    setEditingNote(note); // Open expanded box with the selected note
  };

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
              onEdit={handleEdit} // Pass onEdit to trigger expanded box
            />
          ))
        ) : (
          <p>No notes match your search</p>
        )}
      </div>
      {editingNote && (
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
              <IconButton size="small" className="pin-icon">
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
              <IconButton size="small">
                <NotificationsNoneIcon />
              </IconButton>
              <IconButton size="small">
                <PersonAddIcon />
              </IconButton>
              <IconButton size="small">
                <PaletteIcon />
              </IconButton>
              <IconButton size="small">
                <ImageIcon />
              </IconButton>
              <IconButton size="small" onClick={() => updateNotesList(editingNote, "archive")}>
                <ArchiveIcon />
              </IconButton>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
              <IconButton size="small">
                <ArrowBackIcon />
              </IconButton>
              <IconButton size="small">
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
      )}
    </div>
  );
}

export default Notes;