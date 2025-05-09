import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../pages/story/story.css'

const SearchBar = ({ value, onChange }) => (
  <div className='search-container'>
    <input
      type='text'
      placeholder='Search'
      className='search-input'
      value={value}
      onChange={onChange}
    />
    <FontAwesomeIcon icon={faSearch} className='search-icon' />
  </div>
)

export default SearchBar
