import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import GetStarted from "../components/GetStarted.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { LoaderIcon, Search, X } from "lucide-react";
import { formatDate, formatToUppercase } from "../lib/utils.js";

const HomePage = ({ user, error, setUser }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

      setSelectedNote(null);

      setTimeout(() => {
        const modal = document.getElementById("note_modal");
        if (modal?.open) modal.close();
      }, 0);

      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const handleNoteDeleted = (deletedNoteId) => {
    if (selectedNote && selectedNote._id === deletedNoteId) {
      setSelectedNote(null);
      setTimeout(() => {
        const modal = document.getElementById("note_modal");
        if (modal?.open) modal.close();
      }, 0);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {error && <p className="text-center text-error font-mono my-2">{error}</p>}

      {user ? (
        <div className="max-w-6xl mx-auto p-4 mt-6">
          {/* Search bar & Note count */}
          {notes.length > 0 && !isRateLimited && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 font-mono">
              <label className="input input-bordered input-sm sm:input-md flex items-center gap-2.5 w-full sm:w-80">
                <Search className="size-4 text-base-content/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
              <span className="text-xs text-base-content/60 self-end sm:self-center">
                {filteredNotes.length} of {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
            </div>
          )}

          {/* Skeleton Loading */}
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

          {/* Notes Grid */}
          {!loading && filteredNotes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
              {filteredNotes.map((note) => (
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

          {/* Search No Results */}
          {!loading && notes.length > 0 && filteredNotes.length === 0 && !isRateLimited && (
            <div className="text-center py-12 font-mono text-base-content/70">
              <p>No notes matched "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")} 
                className="btn btn-ghost btn-sm mt-2 text-primary"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && notes.length === 0 && !isRateLimited && (
            <NotesNotFound username={user.username} />
          )}

          {/* Full Note Preview Modal */}
          <dialog id="note_modal" className="modal modal-bottom sm:modal-middle">
            {selectedNote && (
              <div className="modal-box max-w-xl mx-auto font-mono">
                {/* Close button (top-right) */}
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
                    <X className="size-4"/>
                  </button>
                </form>

                {/* Note metadata & content (unclamped) */}
                <span className='text-xs text-base-content/60 block'>
                  {formatDate(new Date(selectedNote.createdAt))}
                </span>
                <h3 className="font-bold text-xl mt-2 break-words">
                  {formatToUppercase(selectedNote.title)}
                </h3>
                
                <div className="py-4 max-h-[60vh] overflow-y-auto pr-1">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed break-words text-base-content/90">
                    {selectedNote.content}
                  </p>
                </div>

                {/* Actions */}
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