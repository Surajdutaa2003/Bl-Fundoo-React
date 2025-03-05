import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { archiveNote, deleteForeverNote, restoreNote, deletePermanently, changeNoteColor } from "../../services/api";
import "../NotesAction/NotesAction.scss";

const NoteActions = ({ handleNoteList, note, container, onColorChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [reminderAnchorEl, setReminderAnchorEl] = useState(null); // **New state for reminder dropdown**
  const open = Boolean(anchorEl);
  const colorOpen = Boolean(colorAnchorEl);
  const reminderOpen = Boolean(reminderAnchorEl); // **New state for reminder dropdown open status**

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleColorMenuOpen = (event) => setColorAnchorEl(event.currentTarget);
  const handleColorMenuClose = () => setColorAnchorEl(null);
  const handleReminderMenuOpen = (event) => setReminderAnchorEl(event.currentTarget); // **New handler for reminder dropdown**
  const handleReminderMenuClose = () => setReminderAnchorEl(null); // **New handler for closing reminder dropdown**

  const handleActionClick = async (action) => {
    try {
      if (action === "archive") {
        await archiveNote(note?.id, true);
        handleNoteList(note, "archive");
      } else if (action === "unarchive") {
        await archiveNote(note?.id, false);
        handleNoteList(note, "unarchive");
      } else if (action === "delete") {
        await deleteForeverNote(note?.id); // Move to trash from notes or archive
        handleNoteList(note, "delete");
      } else if (action === "restore") {
        await restoreNote(note?.id);
        handleNoteList(note, "restore");
      } else if (action === "permanentDelete") { // Permanent deletion from trash
        await deletePermanently(note?.id);
        handleNoteList(note, "delete");
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
    handleMenuClose();
  };

  const handleColorSelect = async (color) => {
    try {
      if (onColorChange && note) {
        await changeNoteColor(note.id, color); // Call API to update color
        onColorChange(note.id, color); // Update local state
      }
    } catch (err) {
      console.error("Error changing note color:", err);
    }
    handleColorMenuClose();
  };

  const handleReminderSelect = (reminder) => {
    console.log(`Selected reminder: ${reminder}`); // **Log the selected reminder for now**
    // **Here, you can add logic to save the reminder via an API call (e.g., updateNote with reminder data)**
    // Example: await updateNote(note.id, { reminder });
    handleReminderMenuClose();
  };

  const colors = [
    "#FFFFFF", "#FAAFA8", "#F39F76", "#FFF8B8", "#E2F6D3",
    "#B4DDD3", "#D4E4ED", "#AECCDC", "#D3BFDB", "#F6E2DD",
    "#E9E3D4", "#EFEFF1",
  ];

  return (
    <div className="note-actions">
      {container === "notes" && (
        <>
          <IconButton size="small" onClick={handleReminderMenuOpen}> {/* **Updated bell icon to open reminder menu** */}
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="small">
            <PersonAddIcon />
          </IconButton>
          <IconButton size="small" onClick={handleColorMenuOpen}>
            <PaletteIcon />
          </IconButton>
          <IconButton size="small">
            <ImageIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleActionClick("archive")}>
            <ArchiveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleActionClick("delete")}>Delete Note</MenuItem>
            <MenuItem onClick={() => handleActionClick("add-label")}>Add Label</MenuItem>
            <MenuItem onClick={() => handleActionClick("add-drawing")}>Add Drawing</MenuItem>
            <MenuItem onClick={() => handleActionClick("make-copy")}>Make a Copy</MenuItem>
            <MenuItem onClick={() => handleActionClick("show-checkboxes")}>
              Show Checkboxes
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("copy-to-docs")}>
              Copy to Google Docs
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("version-history")}>
              Version History
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={colorAnchorEl}
            open={colorOpen}
            onClose={handleColorMenuClose}
            PaperProps={{
              style: { display: "flex", flexWrap: "wrap", padding: "8px", maxWidth: "200px" },
            }}
          >
            {colors.map((color) => (
              <IconButton
                key={color}
                size="small"
                style={{ backgroundColor: color, width: "24px", height: "24px", margin: "4px" }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </Menu>
          <Menu
            anchorEl={reminderAnchorEl}
            open={reminderOpen}
            onClose={handleReminderMenuClose}
            PaperProps={{
              style: {
                width: "250px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "16px",
              },
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
              Remind me later
            </div>
            <div style={{ color: "#757575", fontSize: "12px", marginBottom: "16px" }}>
              Saved in Google Reminders
            </div>
            <MenuItem onClick={() => handleReminderSelect("Later today, 8:00 PM")}>
              Later today
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Tomorrow, 8:00 AM")}>
              Tomorrow
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Next week, Mon, 8:00 AM")}>
              Next week
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick date & time")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="calendar">⭕</span> Pick date & time
              </span>
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick place")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="location">📍</span> Pick place
              </span>
            </MenuItem>
          </Menu>
        </>
      )}
      {container === "archive" && (
        <>
          <IconButton size="small" onClick={handleReminderMenuOpen}> {/* **Updated bell icon for archive** */}
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="small">
            <PersonAddIcon />
          </IconButton>
          <IconButton size="small" onClick={handleColorMenuOpen}>
            <PaletteIcon />
          </IconButton>
          <IconButton size="small">
            <ImageIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleActionClick("unarchive")}>
            <UnarchiveIcon />
          </IconButton>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleActionClick("delete")}>Delete Note</MenuItem>
            <MenuItem onClick={() => handleActionClick("add-label")}>Add Label</MenuItem>
            <MenuItem onClick={() => handleActionClick("add-drawing")}>Add Drawing</MenuItem>
            <MenuItem onClick={() => handleActionClick("make-copy")}>Make a Copy</MenuItem>
            <MenuItem onClick={() => handleActionClick("show-checkboxes")}>
              Show Checkboxes
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("copy-to-docs")}>
              Copy to Google Docs
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("version-history")}>
              Version History
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={colorAnchorEl}
            open={colorOpen}
            onClose={handleColorMenuClose}
            PaperProps={{
              style: { display: "flex", flexWrap: "wrap", padding: "8px", maxWidth: "200px" },
            }}
          >
            {colors.map((color) => (
              <IconButton
                key={color}
                size="small"
                style={{ backgroundColor: color, width: "24px", height: "24px", margin: "4px" }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </Menu>
          <Menu
            anchorEl={reminderAnchorEl}
            open={reminderOpen}
            onClose={handleReminderMenuClose}
            PaperProps={{
              style: {
                width: "250px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "16px",
              },
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
              Remind me later
            </div>
            <div style={{ color: "#757575", fontSize: "12px", marginBottom: "16px" }}>
              Saved in Google Reminders
            </div>
            <MenuItem onClick={() => handleReminderSelect("Later today, 8:00 PM")}>
              Later today, 8:00 PM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Tomorrow, 8:00 AM")}>
              Tomorrow, 8:00 AM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Next week, Mon, 8:00 AM")}>
              Next week, Mon, 8:00 AM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick date & time")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="calendar">⭕</span> Pick date & time
              </span>
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick place")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="location">📍</span> Pick place
              </span>
            </MenuItem>
          </Menu>
        </>
      )}
      {container === "trash" && (
        <>
          <IconButton size="small" onClick={handleReminderMenuOpen}> {/* **Updated bell icon for trash** */}
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleActionClick("restore")}>
            <RestoreFromTrashIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleActionClick("permanentDelete")}>
            <DeleteForeverIcon />
          </IconButton>
          <Menu
            anchorEl={reminderAnchorEl}
            open={reminderOpen}
            onClose={handleReminderMenuClose}
            PaperProps={{
              style: {
                width: "250px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "16px",
                position:"absolute",
                top: "80px",
              },
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
              Remind me later
            </div>
            <div style={{ color: "#757575", fontSize: "12px", marginBottom: "16px" }}>
              Saved in Google Reminders
            </div>
            <MenuItem onClick={() => handleReminderSelect("Later today, 8:00 PM")}>
              Later today, 8:00 PM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Tomorrow, 8:00 AM")}>
              Tomorrow, 8:00 AM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Next week, Mon, 8:00 AM")}>
              Next week, Mon, 8:00 AM
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick date & time")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="calendar">⭕</span> Pick date & time
              </span>
            </MenuItem>
            <MenuItem onClick={() => handleReminderSelect("Pick place")}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span role="img" aria-label="location">📍</span> Pick place
              </span>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

export default NoteActions;