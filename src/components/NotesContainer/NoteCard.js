import React, { useState, useEffect, useRef } from "react";
import NoteActions from "../NotesAction/NotesAction";
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
import { updateNote } from "../../services/api";

function NoteCard({ note, handleNoteList, container, onEdit }) {
  const [backgroundColor, setBackgroundColor] = useState(
    note?.color || "#FFFFFF"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedNote, setEditedNote] = useState({ ...note });
  const expandedRef = useRef(null);

  useEffect(() => {
    setBackgroundColor(note?.color || "#FFFFFF");
    setEditedNote({ ...note });
  }, [note]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  if (!note) {
    return null;
  }

  const handleColorChange = (noteId, color) => {
    if (noteId === note.id) {
      setBackgroundColor(color);
    }
  };

  const handleTitleOrDescriptionClick = () => {
    if (onEdit) {
      onEdit(note);
    }
    setIsExpanded(true);
  };

  const handleInputChange = (field, value) => {
    setEditedNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNote = async () => {
    try {
      const updatedData = {
        title: editedNote.title,
        description: editedNote.description,
      };
      const updatedNoteData = await updateNote(note.id, updatedData);
      handleNoteList(
        {
          ...note,
          title: updatedData.title,
          description: updatedData.description,
        },
        "update"
      );
      setIsExpanded(false);
    } catch (error) {
      console.error("❌ Failed to update note:", error.message);
      alert("Failed to update note. Please try again.");
    }
  };

  return (
    <>
      <div
        className="note-card relative p-4 border rounded-md shadow-md"
        style={{ backgroundColor, position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="note-content">
          <h3 onClick={handleTitleOrDescriptionClick}>{note.title || "Untitled"}</h3>
          <p onClick={handleTitleOrDescriptionClick}>{note.description || "No description available"}</p>
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
        <div className="expanded-note-overlay">
          <div
            ref={expandedRef}
            className="expanded-note"
            style={{
              top: "24.103px",
              left: "83.44px",
              width: "500.109px",
              position: "absolute",
              background: "#ffffff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div className="note-input-header">
              <input
                type="text"
                placeholder="Title"
                value={editedNote.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="note-input-title"
              />
              <IconButton size="small" className="pin-icon">
                <PushPinOutlinedIcon />
              </IconButton>
            </div>
            <textarea
              placeholder="Note"
              value={editedNote.description || ""}
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
              <IconButton size="small" onClick={() => handleNoteList(note, "archive")}>
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
