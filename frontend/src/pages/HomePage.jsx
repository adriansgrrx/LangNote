import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import GetStarted from "../components/GetStarted.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { Loader, LoaderIcon, X } from "lucide-react";
import { formatDate, formatToUppercase } from "../lib/utils.js";

const HomePage = ({ user, error, setUser }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await api.delete(`/notes/${selectedNote._id}`);
      setNotes((prev) =>
        prev.filter((n) => n._id !== selectedNote._id)
      );

      // Clear selectedNote first
      setSelectedNote(null);

      // Close modal in the next tick so React re-render happens first
      setTimeout(() => {
        const modal = document.getElementById("note_modal");
        if (modal.open) modal.close();
      }, 0);

      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  // Add this function to handle deletion from NoteCard
  const handleNoteDeleted = (deletedNoteId) => {
    // If the deleted note is currently selected in the modal, close the modal
    if (selectedNote && selectedNote._id === deletedNoteId) {
      setSelectedNote(null);
      setTimeout(() => {
        const modal = document.getElementById("note_modal");
        if (modal?.open) modal.close();
      }, 0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {isRateLimited && <RateLimitedUI />}
      {error && <p>{error}</p>}

      {user ? (
        <div className="max-w-6xl mx-auto p-4 mt-6">
          {/* Skeleton Loading — ONLY for logged-in users */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Notes */}
          {!loading && notes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
              {notes.map((note) => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  setNotes={setNotes} 
                  onOpen={(note) => {
                    setSelectedNote(note);
                    document.getElementById("note_modal").showModal();
                  }}
                  onDeleted={handleNoteDeleted}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && notes.length === 0 && !isRateLimited && (
            <NotesNotFound username={user.username} />
          )}

          <dialog id="note_modal" className="modal">
            {selectedNote && (
              <div className="modal-box max-w-xl mx-auto font-mono">
                {/* Close button (top-right) */}
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
                    <X className="size-4"/>
                  </button>
                </form>

                {/* Note content */}
                <span className='text-sm text-base-content text-start'>{formatDate(new Date(selectedNote.createdAt))} </span>
                <h3 className="font-bold text-lg line-clamp-3 mt-2">{formatToUppercase(selectedNote.title)}</h3>
                <p className="py-4 whitespace-pre-wrap line-clamp-3">
                  {selectedNote.content}
                </p>

                {/* Actions (bottom-right) */}
                <div className="modal-action">
                  <button
                    className="btn btn-sm btn-primary btn-outline"
                    onClick={() => {
                      navigate(`/note/${selectedNote._id}`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>

                </div>
              </div>
            )}
          </dialog>

        </div>
      ) : (
        /* NO loading UI here */
        <div className="max-w-6xl mx-auto p-4 mt-6">
          <GetStarted />
        </div>
      )}
    </div>
  );
};

export default HomePage;