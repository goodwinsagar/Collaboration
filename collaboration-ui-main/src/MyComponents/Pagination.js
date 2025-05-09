import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../pages/story/story.css'

const Pagination = ({ pages, currentPage, onPageChange }) => {
  let items = []
  for (let number = 1; number <= pages; number++) {
    items.push(
      <span
        key={number}
        className={`pagination-item ${number === currentPage ? 'active' : ''}`}
        onClick={() => onPageChange(number)}
      >
        {number}
      </span>
    )
  }

  return (
    <div className='pagination-container'>
      <span
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        {'<'}
      </span>
      {items}
      <span
        className={`pagination-arrow ${
          currentPage === pages ? 'disabled' : ''
        }`}
        onClick={() => currentPage < pages && onPageChange(currentPage + 1)}
      >
        {'>'}
      </span>
    </div>
  )
}

export default Pagination
