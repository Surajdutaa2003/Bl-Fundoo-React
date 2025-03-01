import React, { useState, useRef, useEffect } from "react";
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
    <div ref={noteRef} className="note-input" onClick={() => setIsExpanded(true)}>
      {isExpanded && (
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={note.title}
          onChange={handleChange}
        />
      )}
      <input
        type="text"
        name="description"
        placeholder="Take a note..."
        value={note.description}
        onChange={handleChange}
      />
      {isExpanded && (
        <div className="note-actions">
          <button onClick={handleAddNote}>Close</button>
        </div>
      )}
    </div>
  );
}

export default AddNote;


// helooo