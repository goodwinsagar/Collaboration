import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../pages/story/story.css'
import { useNavigate } from 'react-router-dom'

const AddStory = () => {
  const navigate = useNavigate()

  return (
    <div className='home-addStory'>
      <h1 className='home-title'>Story</h1>
      <button
        className='add-story-btn'
        onClick={() => navigate('/story-board')}
      >
        Add <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}

export default AddStory
