import React, { useState, useEffect } from "react"; // Ensure useState and useEffect are imported
// import "../DashboardContainer/Dashboard.css";
import NoteActions from "../NotesAction/NotesAction";
import "../NotesContainer/NotesContainer.scss";
import { IconButton } from "@mui/material"; // Added for action icons
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined"; // Added for pin icon
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"; // Added for bell icon
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // Added for person add icon
import PaletteIcon from "@mui/icons-material/Palette"; // Added for palette icon
import ImageIcon from "@mui/icons-material/Image"; // Added for image icon
import ArchiveIcon from "@mui/icons-material/Archive"; // Added for archive icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Added for more options icon
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Added for navigation
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Added for navigation
import { updateNote } from "../../services/api"; // Added import for updateNote API**

function NoteCard({ note, handleNoteList, container, onEdit }) {
  const [backgroundColor, setBackgroundColor] = useState(
    note?.color || "#FFFFFF"
  );
  const [isHovered, setIsHovered] = useState(false); // State for hover
  const [isExpanded, setIsExpanded] = useState(false); // State for expanded box
  const [editedNote, setEditedNote] = useState({ ...note }); // **New state to track edited title and description**

  useEffect(() => {
    // Sync backgroundColor with the note prop whenever it changes
    setBackgroundColor(note?.color || "#FFFFFF");
    setEditedNote({ ...note }); // **Sync editedNote with note prop on mount or update**
  }, [note]);

  if (!note) {
    return null;
  }

  const handleColorChange = (noteId, color) => {
    if (noteId === note.id) {
      setBackgroundColor(color);
    }
  };

  const handleCardClick = (e) => {
    if (onEdit) {
      onEdit(note); // Trigger edit in parent (e.g., Notes.js) if provided
    }
    setIsExpanded(true); // Show expanded box on click
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false); // Close expanded box
    setEditedNote({ ...note }); // **Reset editedNote to original note on close**
  };

  const handleInputChange = (field, value) => {
    setEditedNote((prev) => ({ ...prev, [field]: value })); // **Update editedNote state for title or description**
  };

  const handleSaveNote = async () => {
    try {
      const updatedData = {
        title: editedNote.title,
        description: editedNote.description,
      };
      const updatedNoteData = await updateNote(note.id, updatedData); // **Call updateNote API**
      // console.log("response",updatedNoteData)
      handleNoteList(
        {
          ...note,
          title: updatedData.title,
          description: updatedData.description,
        },
        "update"
      ); // **Update UI via handleNoteList**
      setIsExpanded(false); // Close after saving
    } catch (error) {
      console.error("❌ Failed to update note:", error.message);
      alert("Failed to update note. Please try again."); // Optional user feedback
    }
  };

  return (
    <>
      <div
        className="note-card relative p-4 border rounded-md shadow-md"
        style={{ backgroundColor, position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick} // Add click handler to open expanded box
      >
        <div className="note-content">
          <h3>{note.title || "Untitled"}</h3>
          <p>{note.description || "No description available"}</p>
        </div>
        <div
          className={`note-actions-container ${
            container === "trash" ? "trash-actions" : ""
          }`}
        >
          {container === "trash" ? (
            isHovered && (
              <NoteActions
                handleNoteList={handleNoteList}
                note={note}
                container={container}
                onColorChange={handleColorChange}
              />
            )
          ) : (
            <NoteActions
              handleNoteList={handleNoteList}
              note={note}
              container={container}
              onColorChange={handleColorChange}
            />
          )}
        </div>
      </div>
      {isExpanded && (
        <div
          className="expanded-note-overlay"
          style={{ position: "absolute", zIndex: 1000 }} // Position absolutely, above the card
          onClick={handleCloseExpanded}
        >
          <div
            className="expanded-note"
            style={{
              top: "24.103px", // Fixed position as previously requested
              left: "83.44px", // Fixed position as previously requested
              width: "500.109px", // Fixed width as previously requested
              position: "absolute", // Fixed positioning
              background: "#ffffff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="note-input-header">
              <input
                type="text"
                placeholder="Title"
                value={editedNote.title || ""} // **Use editedNote for real-time updates**
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="note-input-title"
              />
              <IconButton size="small" className="pin-icon">
                <PushPinOutlinedIcon />
              </IconButton>
            </div>
            <textarea
              placeholder="Note"
              value={editedNote.description || ""} // **Use editedNote for real-time updates**
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              <IconButton
                size="small"
                onClick={() => handleNoteList(note, "archive")}
              >
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
              <button className="close-button" onClick={handleSaveNote}>
                Close
              </button>
              <span className="edited-date">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteCard;
