import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import { LoaderIcon, ArrowLeftIcon, Trash2Icon } from 'lucide-react';

const NoteDetailsPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  
  const {id} = useParams();
  console.log({id});


  useEffect(() => {
    const fetchNote= async() => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        toast.error("Failed to fetch the note.");
        console.log("Failed to fetch the note", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id])

  console.log( {note} ) 

  // const handleDelete = async () => {
  //   // e.preventDefault();

  //   if(!window.confirm("Are you sure you want to delete this note?")) return;

  //   try {
  //       await api.delete(`/notes/${id}`); 
  //       // setNotes((prev) => prev.filter(note => note._id !== id));
  //       toast.success("Note deleted successfully.");
  //       navigate("/");

  //   } catch (error) {
  //       console.log("Failed to delete note", error);
  //       toast.error("Failed to delete the note.");
  //   }
  // };

  const handleSave = async() => {
    if(!note.title.trim() || !note.content.trim()){
      toast.error("Please add a title or content")
      return;
    }

    setSaving(true)

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error("Failed to update note");
      console.log("Error updating note", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center text-primary'>
        <LoaderIcon className='animate-spin size-6'/>
      </div>
    );
  }

  if (!note) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center font-mono'>
        <div className='card bg-base-100 p-8 shadow-md text-center max-w-md mx-auto'>
          <h2 className='text-xl font-bold mb-2'>Note not found</h2>
          <p className='text-base-content/70 mb-6'>The note you are looking for does not exist or you do not have permission to view it.</p>
          <Link to='/' className='btn btn-primary text-amber-100'>
            <ArrowLeftIcon className='size-4 mr-1' /> Back to notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto font-mono'>
          <div className='flex items-center justify-between mb-6'>
            <Link to={'/'} className='btn btn-ghost mb-6 font-mono'>
              <ArrowLeftIcon className='size-4'/>
              Back to notes
            </Link>
          </div>

          <div className='card bg-base-100'>
            <div className='card-body'>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input type="text" 
                  placeholder='Note Title'
                  className='input input-bordered'
                  value={note.title || ''}
                  onChange={(e) => setNote({...note, title: e.target.value})}
                  />
                </div>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea 
                  placeholder='Write your note here...'
                  className='textarea textarea-bordered h-32'
                  value={note.content || ''}
                  onChange={(e) => setNote({...note, content: e.target.value})}
                  />
                </div>

                <div className='card-actions justify-end'>
                  <button className='btn btn-primary text-amber-100' disabled={saving} onClick={handleSave}>
                    {saving ? 'Save...' : 'Save Changes'}
                  </button>
                </div>             

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailsPage