import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim() || !content.trim()){
      toast.error("All fields are required.");
      return;
    } 

    if(title.length < 8){
      toast.error("Your note title is too short.");
      return;
    } 

    if(content.length < 10){
      toast.error("Your note content is too short.");
      return;
    } 

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content
      });
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if(error.response?.status === 429){
        toast.error("Slow down! You're creating notes too fast.", {
          duration: 4000,
          icon: "🚦"
        });
      } else {
        toast.error("Failed to create note.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={'/'} className='btn btn-ghost mb-6 font-mono'>
            <ArrowLeftIcon className='size-4'/>
            Back to notes
          </Link>
          <div className='card bg-base-100 font-mono'>
            <div className='card-body'>
              <div className='card-title text-2xl'>Create a New Note</div>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <label className='label-text font-bold'>Title</label>
                    <span className={`text-xs ${title.length >= 8 ? 'text-success' : 'text-base-content/60'}`}>
                      {title.length}/8 min
                    </span>
                  </div>
                  <input type="text" 
                  placeholder='e.g., Weekly Project Summary'
                  className='input input-bordered w-full'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='form-control mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <label className='label-text font-bold'>Content</label>
                    <span className={`text-xs ${content.length >= 10 ? 'text-success' : 'text-base-content/60'}`}>
                      {content.length}/10 min
                    </span>
                  </div>
                  <textarea 
                  placeholder='Write your thoughts, ideas, or reminders here...'
                  className='textarea textarea-bordered min-h-[240px] md:min-h-[300px] leading-relaxed text-sm'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className='card-actions justify-end mt-4'>
                  <button 
                    className='btn btn-primary text-primary-content min-w-32' 
                    disabled={loading || title.trim().length < 8 || content.trim().length < 10}
                  >
                    {loading ? 'Creating...' : 'Create Note'}
                  </button>
                </div>
              </form>
              

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePage