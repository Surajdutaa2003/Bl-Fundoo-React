import React, { useState } from "react";

const EditNoteModal = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, title, description }); // Ensure the updated note has all properties
    onClose(); // Close modal after updating
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default EditNoteModal;
