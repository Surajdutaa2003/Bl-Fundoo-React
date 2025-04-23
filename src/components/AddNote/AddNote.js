import React, { useState, useRef, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
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
            <Tooltip title="Checklist" arrow>
              <IconButton size="small" onClick={handleAddNote}>
                <CheckBoxOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Text Note" arrow>
              <IconButton size="small">
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Image" arrow>
              <IconButton size="small">
                <ImageIcon />
              </IconButton>
            </Tooltip>
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
            <Tooltip title="Pin Note" arrow>
              <IconButton size="small" className="pin-icon">
                <PushPinOutlinedIcon />
              </IconButton>
            </Tooltip>
          </div>
          <textarea
            name="description"
            placeholder="Take a note..."
            value={note.description}
            onChange={handleChange}
            className="note-input-description"
          />
          <div className="note-input-actions">
            <Tooltip title="Set Reminder" arrow>
              <IconButton size="small">
                <NotificationsNoneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Collaborate" arrow>
              <IconButton size="small">
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change Color" arrow>
              <IconButton size="small" onClick={() => {}}>
                <PaletteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Image" arrow>
              <IconButton size="small">
                <ImageIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archive" arrow>
              <IconButton size="small" onClick={handleAddNote}>
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More Options" arrow>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo" arrow>
              <IconButton size="small">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo" arrow>
              <IconButton size="small">
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
            <button className="close-button" onClick={handleAddNote}>
              Close
            </button>
          </div>
          <div>
        hii 
            </div>
        </div>
      )}
    </div>
  );
}

export default AddNote;   
