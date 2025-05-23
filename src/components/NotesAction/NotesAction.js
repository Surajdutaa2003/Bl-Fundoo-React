import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaletteIcon from "@mui/icons-material/Palette";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { isValid, isAfter } from 'date-fns';
import { 
  archiveNote, 
  deleteForeverNote, 
  restoreNote, 
  deletePermanently, 
  changeNoteColor,
  addUpdateReminderNotes,
  removeReminderNotes
} from "../../services/api";
import "../NotesAction/NotesAction.scss";
import Tooltip from "@mui/material/Tooltip";

const NoteActions = ({ handleNoteList, note, container, onColorChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [reminderAnchorEl, setReminderAnchorEl] = useState(null);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [dateError, setDateError] = useState("");
  const open = Boolean(anchorEl);
  const colorOpen = Boolean(colorAnchorEl);
  const reminderOpen = Boolean(reminderAnchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleColorMenuOpen = (event) => setColorAnchorEl(event.currentTarget);
  const handleColorMenuClose = () => setColorAnchorEl(null);
  const handleReminderMenuOpen = (event) => setReminderAnchorEl(event.currentTarget);
  const handleReminderMenuClose = () => setReminderAnchorEl(null);

  const handleActionClick = async (action) => {
    try {
      if (action === "archive") {
        await archiveNote(note?.id, true);
        handleNoteList(note, "archive");
      } else if (action === "unarchive") {
        await archiveNote(note?.id, false);
        handleNoteList(note, "unarchive");
      } else if (action === "delete") {
        await deleteForeverNote(note?.id); // Move to trash
        handleNoteList(note, "trash");
      } else if (action === "restore") {
        await restoreNote(note?.id); // Move back to notes
        handleNoteList(note, "restore");
      } else if (action === "permanentDelete") {
        await deletePermanently(note?.id); // Permanent deletion
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
        await changeNoteColor(note.id, color);
        onColorChange(note.id, color);
      }
    } catch (err) {
      console.error("Error changing note color:", err);
    }
    handleColorMenuClose();
  };

  const handleReminderSelect = (reminder) => {
    if (reminder === "Pick date & time") {
      setOpenDateTimePicker(true);
      setDateError("");
    } else {
      console.log(`Selected reminder: ${reminder}`);
    }
    handleReminderMenuClose();
  };

  const handleDateTimeSelect = async (newDateTime) => {
    console.log("Selected DateTime:", newDateTime);

    if (!newDateTime || !isValid(newDateTime)) {
      setDateError("Invalid date selected.");
      return;
    }

    const now = new Date();
    if (!isAfter(newDateTime, now)) {
      setDateError("Please select a future date and time.");
      return;
    }

    setSelectedDateTime(newDateTime);
    if (note?.id) {
      try {
        await addUpdateReminderNotes(note.id, newDateTime);
        console.log(`Reminder set for note ${note.id} at ${newDateTime}`);
        if (handleNoteList) {
          handleNoteList({ ...note, reminder: newDateTime.toISOString() }, "update");
        }
        setOpenDateTimePicker(false);
        setDateError("");
      } catch (error) {
        console.error('Failed to update reminder:', error);
        setDateError("Failed to save reminder. Please try again.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Backspace") {
      event.stopPropagation();
    }
  };

  const handleCancel = () => {
    setOpenDateTimePicker(false);
    setSelectedDateTime(new Date());
    setDateError("");
  };

  const colors = [
    "#FFFFFF", "#FAAFA8", "#F39F76", "#FFF8B8", "#E2F6D3",
    "#B4DDD3", "#D4E4ED", "#AECCDC", "#D3BFDB", "#F6E2DD",
    "#E9E3D4", "#EFEFF1",
  ];

  return (
    <div className="note-actions">
      {(container === "notes" || container === "reminders") && (
        <>
          <Tooltip title="Set Reminder" arrow>
            <IconButton size="small" onClick={handleReminderMenuOpen}>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collaborate" arrow>
            <IconButton size="small">
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Color" arrow>
            <IconButton size="small" onClick={handleColorMenuOpen}>
              <PaletteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Image" arrow>
            <IconButton size="small">
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archive" arrow>
            <IconButton size="small" onClick={() => handleActionClick("archive")}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options" arrow>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
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

      {container === "archive" && (
        <>
          <Tooltip title="Set Reminder" arrow>
            <IconButton size="small" onClick={handleReminderMenuOpen}>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collaborate" arrow>
            <IconButton size="small">
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Color" arrow>
            <IconButton size="small" onClick={handleColorMenuOpen}>
              <PaletteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Image" arrow>
            <IconButton size="small">
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Unarchive" arrow>
            <IconButton size="small" onClick={() => handleActionClick("unarchive")}>
              <UnarchiveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options" arrow>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="Set Reminder" arrow>
            <IconButton size="small" onClick={handleReminderMenuOpen}>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Restore" arrow>
            <IconButton size="small" onClick={() => handleActionClick("restore")}>
              <RestoreFromTrashIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Forever" arrow>
            <IconButton size="small" onClick={() => handleActionClick("permanentDelete")}>
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
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

      <Dialog 
        open={openDateTimePicker} 
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenDateTimePicker(false);
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <DialogTitle>Pick Date & Time</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
              value={selectedDateTime}
              onChange={(newValue) => {
                setSelectedDateTime(newValue);
                setDateError("");
                console.log("onChange DateTime:", newValue);
              }}
              onAccept={handleDateTimeSelect}
              format="MM/dd/yyyy hh:mm a"
              minDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Date & Time"
                  onKeyDown={handleKeyDown}
                  fullWidth
                  error={!!dateError}
                  helperText={dateError}
                />
              )}
            />
          </LocalizationProvider>
          {dateError && (
            <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "8px" }}>
              {dateError}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleDateTimeSelect(selectedDateTime)} 
            color="primary"
            disabled={!selectedDateTime || !!dateError}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NoteActions;