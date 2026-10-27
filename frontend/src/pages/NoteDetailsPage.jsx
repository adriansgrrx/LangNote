import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import { ArrowLeftIcon, Trash2Icon, SaveIcon } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, formatRelative, formatToUppercase } from '../lib/utils';

const NoteDetailsPage = () => {
  const [note, setNote] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setOriginal(res.data);
      } catch {
        toast.error("Failed to fetch the note.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const isDirty =
    !!note && !!original &&
    (note.title !== original.title || note.content !== original.content);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    if (!note || saving) return;
    if(!note.title.trim() || !note.content.trim()){
      toast.error("Please add a title or content")
      return;
    }

    setSaving(true)

    try {
      const res = await api.put(`/notes/${id}`, { title: note.title, content: note.content });
      const saved = res.data && res.data._id ? res.data : { ...note, updatedAt: new Date().toISOString() };
      setNote(saved);
      setOriginal(saved);
      toast.success("Note updated successfully");
    } catch {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  }, [id, note, saving]);

  // Ctrl/Cmd + S to save
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (isDirty) handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave, isDirty]);

  const handleBack = (e) => {
    if (isDirty) {
      e.preventDefault();
      setLeaveOpen(true);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      setOriginal(note); // clear dirty state so navigation isn't blocked
      navigate('/');
    } catch {
      toast.error("Failed to delete note");
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <main className='min-h-screen bg-base-200' aria-busy='true'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-2xl mx-auto animate-pulse space-y-6'>
            <div className='h-10 w-40 rounded-btn bg-base-300' />
            <div className='card bg-base-100 p-6 space-y-4 border border-base-content/10'>
              <div className='h-4 w-16 rounded bg-base-300' />
              <div className='h-12 w-full rounded-btn bg-base-300' />
              <div className='h-4 w-20 rounded bg-base-300' />
              <div className='h-64 w-full rounded-btn bg-base-300' />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
      <main className='min-h-screen bg-base-200 flex items-center justify-center font-mono px-4'>
        <div className='card bg-base-100 p-8 shadow-md text-center max-w-md mx-auto border border-base-content/10 animate-fade-up'>
          <h1 className='text-xl font-bold mb-2'>Note not found</h1>
          <p className='text-base-content/70 mb-6'>The note you are looking for does not exist or you do not have permission to view it.</p>
          <Link to='/' className='btn btn-primary text-primary-content gap-2'>
            <ArrowLeftIcon className='size-4' /> Back to notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-base-200'>
      <title>{note?.title ? `${note.title} — LangNote` : "Note Details — LangNote"}</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto font-mono animate-fade-up'>
          <div className='flex items-center justify-between gap-3 mb-6'>
            <Link to={'/'} id='details-back' onClick={handleBack} className='btn btn-ghost font-mono gap-2'>
              <ArrowLeftIcon className='size-4'/>
              Back to notes
            </Link>
            <button
              id='details-delete'
              className='btn btn-ghost text-error gap-2 hover:bg-error/10'
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2Icon className='size-4' />
              <span className='hidden sm:inline'>Delete</span>
            </button>
          </div>

          <div className='card bg-base-100 shadow-sm border border-base-content/10'>
            <div className='card-body'>
                <div className='flex flex-wrap items-baseline justify-between gap-2 mb-2'>
                  <h1 className='text-2xl font-extrabold tracking-tight'>Edit note</h1>
                  <span className='text-xs text-base-content/60'>
                    Created {formatDate(new Date(note.createdAt))}
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <> · Edited {formatRelative(new Date(note.updatedAt))}</>
                    )}
                  </span>
                </div>

                <div className='form-control mb-4'>
                  <label htmlFor='edit-title' className='label'>
                    <span className='label-text font-bold'>Title</span>
                  </label>
                  <input
                    id='edit-title'
                    type="text"
                    maxLength={200}
                    placeholder='Note Title'
                    className='input input-bordered focus:input-primary'
                    value={note.title || ''}
                    onChange={(e) => setNote({...note, title: e.target.value})}
                  />
                </div>
                <div className='form-control mb-4'>
                  <label htmlFor='edit-content' className='label'>
                    <span className='label-text font-bold'>Content</span>
                    <span className='label-text-alt text-base-content/60'>{note.content?.length || 0} chars</span>
                  </label>
                  <textarea
                    id='edit-content'
                    placeholder='Write your note here...'
                    className='textarea textarea-bordered min-h-[240px] md:min-h-[300px] leading-relaxed text-sm focus:textarea-primary'
                    value={note.content || ''}
                    onChange={(e) => setNote({...note, content: e.target.value})}
                  />
                </div>

                <div className='card-actions items-center justify-between mt-4'>
                  <span className='text-xs flex items-center gap-2' aria-live='polite'>
                    {isDirty ? (
                      <>
                        <span className='size-2 rounded-full bg-warning' aria-hidden='true' />
                        <span className='text-base-content/70'>Unsaved changes</span>
                        <span className='hidden sm:inline text-base-content/50'>
                          · <kbd className='kbd kbd-xs'>Ctrl</kbd> + <kbd className='kbd kbd-xs'>S</kbd>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='size-2 rounded-full bg-success' aria-hidden='true' />
                        <span className='text-base-content/60'>All changes saved</span>
                      </>
                    )}
                  </span>
                  <button
                    id='details-save'
                    className='btn btn-primary text-primary-content min-w-36 gap-2'
                    disabled={saving || !isDirty}
                    onClick={handleSave}
                  >
                    {saving ? <span className='loading loading-spinner loading-sm' /> : <SaveIcon className='size-4' />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this note?"
        message={`"${formatToUppercase(original?.title || '')}" will be permanently deleted. This can't be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <ConfirmDialog
        open={leaveOpen}
        title="Discard unsaved changes?"
        message="You have edits that haven't been saved. If you leave now, they'll be lost."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={() => {
          setLeaveOpen(false);
          setOriginal(note);
          navigate('/');
        }}
        onCancel={() => setLeaveOpen(false)}
      />
    </main>
  )
}

export default NoteDetailsPage