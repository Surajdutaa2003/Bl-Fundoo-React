import React, { useState, useEffect } from "react";
import NoteCard from "../NotesContainer/NoteCard";
import { getReminderNotes } from "../../services/api";
import "../NotesContainer/NotesContainer.scss";

const ReminderSection = ({ handleNoteList }) => {
  const [reminderNotes, setReminderNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminderNotes = async () => {
      try {
        const response = await getReminderNotes();
        setReminderNotes(response.data || []);
      } catch (err) {
        setError("Failed to fetch reminder notes. Please try again later.");
        console.error("Error fetching reminder notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminderNotes();
  }, []);

  if (loading) return <div>Loading reminder notes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="reminder-section">
      <h2>Reminder Notes</h2>
      <div className="notes-grid">
        {reminderNotes.length > 0 ? (
          reminderNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              handleNoteList={handleNoteList}
              container="reminders"
              onEdit={(note) => console.log("Edit note:", note)}
            />
          ))
        ) : (
          <div>No reminder notes available.</div>
        )}
      </div>
    </div>
  );
};

export default ReminderSection;