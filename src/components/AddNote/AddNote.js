import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { addNote } from "../../services/api";
import "../DashboardContainer/Dashboard.css";

function AddNote({ onNoteAdded }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({ title: "", description: "" });
  const noteRef = useRef(null);

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleAddNote = async (e) => {
    e.stopPropagation();
    if (!note.title.trim() && !note.description.trim()) {
      setIsExpanded(false);
      return;
    }

    if (isExpanded) {
      console.log("Expanded", isExpanded);
      addNote(note)
        .then((res) => {
          onNoteAdded(res?.status?.details, "add");
          setNote({ title: "", description: "" });
          setIsExpanded(false);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="note-input" ref={noteRef} onClick={() => setIsExpanded(true)}>
      {!isExpanded ? (
        <div className="collapsed-note-input">
          <input
            type="text"
            name="description"
            placeholder="Take a note..."
            value={note.description}
            onChange={handleChange}
            className="note-input-field"
          />
          <div className="note-input-icons">
            <IconButton size="small" onClick={handleAddNote}>
              <CheckBoxOutlinedIcon />
            </IconButton>
            <IconButton size="small">
              <CreateIcon />
            </IconButton>
            <IconButton size="small">
              <ImageIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="expanded-note-input">
          <div className="note-input-header">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={note.title}
              onChange={handleChange}
              className="note-input-title"
            />
            <IconButton size="small" className="pin-icon">
              <PushPinOutlinedIcon />
            </IconButton>
          </div>
          <textarea
            name="description"
            placeholder="Take a note..."
            value={note.description}
            onChange={handleChange}
            className="note-input-description"
          />
          <div className="note-input-actions">
            <IconButton size="small">
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton size="small">
              <PersonAddIcon />
            </IconButton>
            <IconButton size="small" onClick={() => {}}>
              <PaletteIcon />
            </IconButton>
            <IconButton size="small">
              <ImageIcon />
            </IconButton>
            <IconButton size="small" onClick={handleAddNote}>
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
            <button className="close-button" onClick={handleAddNote}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNote;