import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import GetStarted from "../components/GetStarted.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { ArrowUpDown, PenSquareIcon, Search, Trash2, X } from "lucide-react";
import { formatDate, formatToUppercase } from "../lib/utils.js";

const SORTERS = {
  newest: { label: "Newest first", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  oldest: { label: "Oldest first", fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  updated: {
    label: "Recently edited",
    fn: (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
  },
  az: { label: "Title A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
  za: { label: "Title Z–A", fn: (a, b) => b.title.localeCompare(a.title) },
};

const getSavedSort = () => {
  const saved = localStorage.getItem("noteSort");
  return SORTERS[saved] ? saved : "newest";
};

const NoteSkeleton = () => (
  <div className="card bg-base-100 border border-base-content/10 p-5 space-y-3 animate-pulse" aria-hidden="true">
    <div className="h-5 w-2/3 rounded bg-base-300" />
    <div className="h-3 w-full rounded bg-base-300" />
    <div className="h-3 w-5/6 rounded bg-base-300" />
    <div className="h-3 w-1/2 rounded bg-base-300" />
    <div className="pt-3 border-t border-base-content/10 flex justify-between">
      <div className="h-3 w-20 rounded bg-base-300" />
      <div className="h-3 w-12 rounded bg-base-300" />
    </div>
  </div>
);

const HomePage = ({ user, error, setUser }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(getSavedSort);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const previewRef = useRef(null);

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
        } else {
          toast.error("Couldn't load your notes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  // Persist sort preference
  useEffect(() => {
    localStorage.setItem("noteSort", sortKey);
  }, [sortKey]);

  // Keyboard shortcut: "/" focuses search (unless typing in a field)
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openPreview = (note) => {
    setSelectedNote(note);
    previewRef.current?.showModal();
  };

  const closePreview = () => {
    if (previewRef.current?.open) previewRef.current.close();
    setSelectedNote(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${pendingDelete._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== pendingDelete._id));
      if (selectedNote?._id === pendingDelete._id) closePreview();
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const visibleNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? notes.filter(
          (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
        )
      : notes;
    return [...filtered].sort(SORTERS[sortKey].fn);
  }, [notes, searchQuery, sortKey]);

  const showToolbar = user && !loading && notes.length > 0 && !isRateLimited;

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />

      {isRateLimited && <RateLimitedUI />}
      {error && <p role="alert" className="text-center text-error font-mono my-2">{error}</p>}

      <main className="max-w-6xl mx-auto px-4 pb-16 pt-6 md:pt-10">
        {user ? (
          <>
            {/* Page header */}
            {(loading || notes.length > 0) && !isRateLimited && (
              <div className="mb-6 font-mono">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Your notes
                </h1>
                <p className="text-sm text-base-content/60 mt-1">
                  Welcome back, {formatToUppercase(user.username)}.
                </p>
              </div>
            )}

            {/* Toolbar: search, sort, count */}
            {showToolbar && (
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6 font-mono">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <label className="input input-bordered input-sm sm:input-md flex items-center gap-2.5 w-full sm:w-80 bg-base-100 focus-within:border-primary">
                    <Search className="size-4 text-base-content/60 shrink-0" aria-hidden="true" />
                    <input
                      ref={searchRef}
                      id="search-notes"
                      type="search"
                      placeholder="Search notes..."
                      aria-label="Search notes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                      className="grow bg-transparent min-w-0"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="btn btn-ghost btn-xs btn-circle"
                        aria-label="Clear search"
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : (
                      <kbd className="kbd kbd-sm hidden sm:inline-flex" aria-hidden="true">/</kbd>
                    )}
                  </label>

                  <label className="flex items-center gap-2">
                    <ArrowUpDown className="size-4 text-base-content/60 shrink-0" aria-hidden="true" />
                    <span className="sr-only">Sort notes</span>
                    <select
                      id="sort-notes"
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value)}
                      className="select select-bordered select-sm sm:select-md bg-base-100 w-full sm:w-auto font-mono"
                    >
                      {Object.entries(SORTERS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <span className="text-xs text-base-content/60 self-end sm:self-center" aria-live="polite">
                  {visibleNotes.length} of {notes.length} {notes.length === 1 ? "note" : "notes"}
                </span>
              </div>
            )}

            {/* Skeleton Loading */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading notes">
                {[...Array(6)].map((_, i) => <NoteSkeleton key={i} />)}
              </div>
            )}

            {/* Notes Grid */}
            {!loading && visibleNotes.length > 0 && !isRateLimited && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleNotes.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    onOpen={openPreview}
                    onRequestDelete={setPendingDelete}
                  />
                ))}
              </div>
            )}

            {/* Search No Results */}
            {!loading && notes.length > 0 && visibleNotes.length === 0 && !isRateLimited && (
              <div className="text-center py-16 font-mono text-base-content/70 animate-fade-up">
                <Search className="size-8 mx-auto mb-3 text-base-content/40" aria-hidden="true" />
                <p>No notes matched &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn btn-ghost btn-sm mt-3 text-primary"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && notes.length === 0 && !isRateLimited && (
              <NotesNotFound username={user.username} />
            )}
          </>
        ) : (
          <GetStarted />
        )}
      </main>

      {/* Full Note Preview Modal */}
      <dialog
        ref={previewRef}
        id="note_modal"
        className="modal modal-bottom sm:modal-middle"
        aria-labelledby="note-modal-title"
        onClose={() => setSelectedNote(null)}
      >
        {selectedNote && (
          <div className="modal-box max-w-xl font-mono">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </form>

            <time className="text-xs text-base-content/60 block" dateTime={selectedNote.createdAt}>
              {formatDate(new Date(selectedNote.createdAt))}
            </time>
            <h3 id="note-modal-title" className="font-bold text-xl mt-2 pr-8 break-words">
              {formatToUppercase(selectedNote.title)}
            </h3>

            <div className="py-4 max-h-[60vh] overflow-y-auto pr-1">
              <p className="whitespace-pre-wrap text-sm leading-relaxed break-words text-base-content/90">
                {selectedNote.content}
              </p>
            </div>

            <div className="modal-action">
              <button
                id="preview-delete"
                className="btn btn-sm btn-ghost text-error gap-1.5"
                onClick={() => setPendingDelete(selectedNote)}
              >
                <Trash2 className="size-4" />
                Delete
              </button>
              <button
                id="preview-edit"
                className="btn btn-sm btn-primary text-primary-content gap-1.5"
                onClick={() => navigate(`/note/${selectedNote._id}`)}
              >
                <PenSquareIcon className="size-4" />
                Edit
              </button>
            </div>
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close preview" tabIndex={-1}>close</button>
        </form>
      </dialog>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this note?"
        message={
          pendingDelete
            ? `"${formatToUppercase(pendingDelete.title)}" will be permanently deleted. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default HomePage;