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
    console.log(title);
    console.log(content);

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
      await api.post("/notes",
        {
          title,
          content
      })
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if(error.response?.status === 429){
        console.log("Failed to create note.", error);
        toast.error("Slow down! You're creating notes too fast.",
          {
            duration: 4000,
            icon: "🚦"
        });
      } else {
        console.log("Failed to create note.", error);
        toast.error("Failed to create note.");
      };
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
                  <label className='label'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input type="text" 
                  placeholder='Note Title'
                  className='input input-bordered'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea 
                  placeholder='Write your note here...'
                  className='textarea textarea-bordered h-32'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className='card-actions justify-end'>
                  <button className='btn btn-primary text-amber-100' disabled={loading}>
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