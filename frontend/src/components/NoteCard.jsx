import React from 'react'
import { useNavigate } from 'react-router'
import { PenSquareIcon, Trash2 } from 'lucide-react'
import { formatDate, formatRelative, formatToUppercase, getAccentIndex } from '../lib/utils'

const NoteCard = ({ note, onOpen, onRequestDelete, index = 0 }) => {
    const navigate = useNavigate();

    const wasEdited =
        note.updatedAt &&
        new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() > 60_000;

    const handleUpdate = (e) => {
        e.stopPropagation(); // Prevent card click
        navigate(`/note/${note._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click
        onRequestDelete?.(note);
    };

    const handleKeyDown = (e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(note);
        }
    };

    return (
        <article
            role="button"
            tabIndex={0}
            id={`note-card-${note._id}`}
            aria-label={`Open note: ${note.title}`}
            onClick={() => onOpen(note)}
            onKeyDown={handleKeyDown}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            className={`note-card note-accent-${getAccentIndex(note._id)} group card bg-base-100 border border-base-content/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer animate-fade-up`}
        >
            <div className='card-body font-mono text-xs lg:text-sm p-5'>
                <h2 className='card-title text-base text-base-content line-clamp-2 leading-snug break-words'>
                    {formatToUppercase(note.title)}
                </h2>
                <p className='text-base-content/75 line-clamp-3 leading-relaxed mt-1 break-words whitespace-pre-line'>
                    {note.content}
                </p>
                <div className='card-actions justify-between items-center mt-auto pt-3 border-t border-base-content/10'>
                    <time
                        dateTime={note.updatedAt || note.createdAt}
                        className='text-xs text-base-content/60'
                        title={`Created ${formatDate(new Date(note.createdAt))}`}
                    >
                        {wasEdited
                            ? `Edited ${formatRelative(new Date(note.updatedAt))}`
                            : formatDate(new Date(note.createdAt))}
                    </time>
                    <div className='flex items-center gap-1 opacity-100 md:opacity-60 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity'>
                        <button
                            className='btn btn-ghost btn-sm btn-circle hover:text-primary'
                            onClick={handleUpdate}
                            title="Edit note"
                            aria-label={`Edit note: ${note.title}`}
                        >
                            <PenSquareIcon className='size-4' />
                        </button>
                        <button
                            className='btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10'
                            onClick={handleDelete}
                            title="Delete note"
                            aria-label={`Delete note: ${note.title}`}
                        >
                            <Trash2 className='size-4' />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default NoteCard