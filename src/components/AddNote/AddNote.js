import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "@mui/material";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"; // For collapsed state
import CreateIcon from "@mui/icons-material/Create"; // For collapsed state
import ImageIcon from "@mui/icons-material/Image"; // For collapsed state
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"; // For pin and bell icons
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // For person add icon
import PaletteIcon from "@mui/icons-material/Palette"; // For palette icon
import ArchiveIcon from "@mui/icons-material/Archive"; // For archive icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // For more options
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // For arrow back
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // For arrow forward
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { addNote } from "../../services/api";
import "../DashboardContainer/Dashboard.css"; // Using Dashboard.css for styling

function AddNote({ onNoteAdded }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({ title: "", description: "" });
  const noteRef = useRef(null);

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleAddNote = async (e) => {
    e.stopPropagation();
    // setIsExpanded(false);
  
    if (!note.title.trim() && !note.description.trim()) {
      setIsExpanded(false);
      return;
    }
  
    // // **Optimistically update UI first**
    // const tempNote = { ...note, _id: Date.now().toString() }; // Temporary ID
    // onNoteAdded(tempNote); // **Instant UI update**

    if(isExpanded){
      console.log("Expanded",isExpanded)
      addNote(note)
        .then((res) => {
          // console.log(res)
          onNoteAdded(res?.status?.details,"add"); // **Instant UI update**
          setNote({ title: "", description: "" }); // Reset form after successful submission
          setIsExpanded(false); 
        })
        .catch(err => {
          console.log(err.message)
        })
      // try {
      //   const result = await addNote(note);
      //   console.log("Added Note:", result);
      //   const newNote = result?.data?.data;
      //   if(newNote){
      //     onNoteAdded(newNote,"add"); 
      //   }
      // } catch (err) {
      //   console.error("Error adding note:", err);
      // } finally {
      //   setNote({ title: "", description: "" });
      //   setIsExpanded(false);
      // }
    }
  };
  
  // Close note when clicking outside
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
        // Collapsed State (Simple Input with Three Icons)
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
        // Expanded State (Matching Your Image)
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
              < PushPinOutlinedIcon/> {/* Pin icon as shown in the image */}
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
            <IconButton size="small" onClick={() => {/* Add color change logic if needed */}}>
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
// fine