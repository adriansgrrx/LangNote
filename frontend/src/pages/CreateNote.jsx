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

  const canSubmit = !loading && title.trim().length >= 8 && content.trim().length >= 10;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
      handleSubmit(e);
    }
  };

  return (
    <main className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto animate-fade-up'>
          <Link to={'/'} id='create-back' className='btn btn-ghost mb-6 font-mono gap-2'>
            <ArrowLeftIcon className='size-4'/>
            Back to notes
          </Link>
          <div className='card bg-base-100 font-mono shadow-sm border border-base-content/10'>
            <div className='card-body'>
              <h1 className='card-title text-2xl font-extrabold tracking-tight'>Create a New Note</h1>
              <p className='text-sm text-base-content/60 -mt-1 mb-2'>Capture an idea before it slips away.</p>
              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
                <div className='form-control mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <label htmlFor='note-title' className='label-text font-bold'>Title</label>
                    <span
                      id='note-title-hint'
                      className={`text-xs transition-colors ${title.trim().length >= 8 ? 'text-success' : 'text-base-content/60'}`}
                    >
                      {title.trim().length}/8 min
                    </span>
                  </div>
                  <input
                    id='note-title'
                    type="text"
                    autoFocus
                    maxLength={200}
                    aria-describedby='note-title-hint'
                    placeholder='e.g., Weekly Project Summary'
                    className='input input-bordered w-full focus:input-primary'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='form-control mb-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <label htmlFor='note-content' className='label-text font-bold'>Content</label>
                    <span
                      id='note-content-hint'
                      className={`text-xs transition-colors ${content.trim().length >= 10 ? 'text-success' : 'text-base-content/60'}`}
                    >
                      {content.trim().length}/10 min
                    </span>
                  </div>
                  <textarea
                    id='note-content'
                    aria-describedby='note-content-hint'
                    placeholder='Write your thoughts, ideas, or reminders here...'
                    className='textarea textarea-bordered min-h-[240px] md:min-h-[300px] leading-relaxed text-sm focus:textarea-primary'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className='card-actions items-center justify-between mt-4'>
                  <span className='hidden sm:inline text-xs text-base-content/50'>
                    <kbd className='kbd kbd-xs'>Ctrl</kbd> + <kbd className='kbd kbd-xs'>Enter</kbd> to save
                  </span>
                  <button
                    id='create-submit'
                    type='submit'
                    className='btn btn-primary text-primary-content min-w-32 w-full sm:w-auto'
                    disabled={!canSubmit}
                  >
                    {loading ? <><span className='loading loading-spinner loading-sm' /> Creating...</> : 'Create Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CreatePage