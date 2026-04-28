import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get("/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => {
        setError(true);
        console.error("Failed to fetch notes:", err);
      });
  }, []);

  function addNote(title, note) {
    const newNote = { title: title, content: note };
    axios.post("/api/notes", newNote).then((res) => {
      setNotes((prevNotes) => [...prevNotes, res.data]);
    });
  }

  function deleteNote(id) {
    axios.delete(`/api/notes/${id}`).then(() => {
      setNotes((prevNotes) => {
        return prevNotes.filter((item) => {
          return item._id !== id;
        });
      });
    });
  }

  function updateNote(id) {
    setEditableId(id);
  }

  function cancelUpdate(id) {
    setEditableId(null);
  }

  function saveUpdate(id, newTitle, newContent) {
    axios
      .patch(`/api/notes/${id}`, {
        title: newTitle,
        content: newContent,
      })
      .then((res) => {
        setNotes((prevNotes) => {
          return prevNotes.map((note) => (note._id === id ? res.data : note));
        });
      })
      .catch((err) => {
        setError(true);
        console.error("Failed to update notes:", err);
      });

    setEditableId(null);
  }

  return (
    <div className="dashboard-container">
      <Header />
      <CreateArea handleClick={addNote} />
      <div className="notes-wrapper">
        {notes.map((item) => (
          <Note
            key={item._id}
            id={item._id}
            title={item.title}
            content={item.content}
            deleteClick={deleteNote}
            updateClick={updateNote}
            isEditable={editableId === item._id}
            cancelUpdate={cancelUpdate}
            saveUpdate={saveUpdate}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
