import axios from "axios";

const BASE_URL = "https://fundoonotes.incubation.bridgelabz.com/api/user";
const NOTES_URL = "https://fundoonotes.incubation.bridgelabz.com/api/notes";

// Function to get authentication token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("fundoo-token");
  if (!token) {
    console.error("⚠️ Authentication token is missing!");
    return null;
  }
  return token;
};

// User login
// export const loginUser = async (email, password) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/login`, { email, password });

//     if (response.data) {
//       localStorage.setItem("fundoo-token", response.data.id); // Save token
//       localStorage.setItem("userEmail", email); // Save email in localStorage
//     }

//     return response.data;
//   } catch (error) {
//     console.error("❌ Login failed:", error.response?.data?.message || error.message);
//     throw error.response?.data?.message || "Login failed";
//   }
// };
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password }, {
      headers: { Authorization: getAuthToken() }, // If needed
    });
    if (response.data) {
      localStorage.setItem("fundoo-token", response.data.id); // Assuming this is your token
      localStorage.setItem("userEmail", email); // Store the email
    }
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Login failed";
  }
};

// User registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/userSignUp`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Registration failed";
  }
};

// Fetch user notes
export const getUserNotes = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { data: [] }; // Prevent crash if token is missing

    const response = await axios.get(`${NOTES_URL}/getNotesList`, {
      headers: { Authorization: token },
    });

    return response.data || { data: [] };
  } catch (error) {
    console.error("❌ Error fetching notes:", error.response?.data?.message || error.message);
    return { data: [] }; // Prevents app crash
  }
};

// Add a new note
export const addNote = async (noteData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");

    const response = await axios.post(`${NOTES_URL}/addNotes`, noteData, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to add note:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to add note";
  }
};

// Archive a note
export const archiveNote = async (noteId, archiveOption) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");

    const payload = { noteIdList: [noteId], isArchived: archiveOption };
    
    const response = await axios.post(`${NOTES_URL}/archiveNotes`, payload, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to archive note:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to archive note";
  }
};

// Fetch archived notes
export const getArchivedNotes = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { data: [] };

    const response = await axios.get(`${NOTES_URL}/getArchiveNotesList`, {
      headers: { Authorization: token },
    });

    return response.data || { data: [] };
  } catch (error) {
    console.error("❌ Failed to fetch archived notes:", error.response?.data?.message || error.message);
    return { data: [] }; // Prevents app crash
  }
};

// Delete forever (or move to trash)
export const deleteForeverNote = async (noteId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");
  
    const response = await axios.post(`${NOTES_URL}/trashNotes`, {
      noteIdList: [noteId],
      isDeleted: true
    }, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete note:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Fetch trashed notes
export const getTrashNotes = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { data: [] };

    const response = await axios.get(`${NOTES_URL}/getTrashNotesList`, {
      headers: { Authorization: token },
    });

    return response.data || { data: [] };
  } catch (error) {
    console.error("❌ Failed to fetch trashed notes:", error.response?.data?.message || error.message);
    return { data: [] };
  }
};

// Restore note from trash
export const restoreNote = async (noteId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");
    const response = await axios.post(
      `${NOTES_URL}/trashNotes`,
      { noteIdList: [noteId], isDeleted: false },
      { headers: { Authorization: token } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to restore note:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Permanently delete a note from trash
export const deletePermanently = async (noteId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");
  
    const response = await axios.post(`${NOTES_URL}/deleteForeverNotes`, {
      noteIdList: [noteId]
    }, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to permanently delete note:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Change note color
export const changeNoteColor = async (noteId, color) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");

    const payload = { noteIdList: [noteId], color: color };
    const response = await axios.post(`${NOTES_URL}/changesColorNotes`, payload, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to change note color:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to change note color";
  }
};
// Update a note
export const updateNote = async (noteId, updatedData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");

    const payload = {
      noteId: noteId,
      ...updatedData
    };

    const response = await axios.post(`${NOTES_URL}/updateNotes`, payload, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to update note:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to update note";
  }
};
// Reminder
export const addUpdateReminderNotes = async (noteId, reminder) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Missing authentication token!");

    const response = await axios.post(`${NOTES_URL}/addUpdateReminderNotes`, {
      reminder: reminder.toISOString(), // Convert Date object to ISO 8601 string
      noteIdList: [noteId],
    }, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to update reminder:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "Failed to update reminder";
  }
};
// mm