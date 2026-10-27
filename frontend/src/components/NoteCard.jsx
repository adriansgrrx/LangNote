import React from 'react'
import { Link, useNavigate } from 'react-router'
import { PenSquareIcon, Trash } from 'lucide-react'
import { formatDate, formatToUppercase } from '../lib/utils'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const NoteCard = ({note, setNotes, onOpen, onDeleted}) => {
    const navigate = useNavigate();
    
    const handleUpdate = async (e) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();
        navigate(`/note/${note._id}`);
    };
    
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();
        
        if(!window.confirm("Are you sure you want to delete this note?")) return;
        
        try {
            await api.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter(note => note._id !== id));
            
            // Call the onDeleted callback to close modal if this note is open
            if (onDeleted) {
                onDeleted(id);
            }
            
            toast.success("Note deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete the note.");
        }
    };
    
    return (
        <div 
            onClick={() => onOpen(note)} 
            className="card bg-base-200 border border-base-content/5 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
            <div className='card-body font-mono text-xs lg:text-sm p-5'>
                <h3 className='card-title text-base text-base-content line-clamp-2 leading-snug'>{formatToUppercase(note.title)}</h3>
                <p className='text-base-content/75 line-clamp-3 leading-relaxed mt-1'>{note.content}</p>
                <div className='card-actions justify-between items-center mt-4 pt-2 border-t border-base-content/10'>
                    <span className='text-xs text-base-content/60'>{formatDate(new Date(note.createdAt))}</span>
                    <div className='flex items-center gap-1'>
                        <button 
                            className='btn btn-ghost btn-sm btn-circle' 
                            onClick={handleUpdate}
                            title="Edit Note"
                            aria-label="Edit Note"
                        >
                            <PenSquareIcon className='size-4 text-base-content/70 hover:text-primary'/>
                        </button>
                        <button 
                            className='btn btn-ghost btn-sm btn-circle text-error' 
                            onClick={(e) => handleDelete(e, note._id)}
                            title="Delete Note"
                            aria-label="Delete Note"
                        >
                            <Trash className='size-4'/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteCard