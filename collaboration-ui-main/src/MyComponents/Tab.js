import React from 'react'
import '../pages/story/story.css'

const Tab = ({ isSelected, children, onClick }) => {
  const tabClass = isSelected ? 'tab selected' : 'tab'
  return (
    <div className={tabClass} onClick={onClick}>
      {' '}
      {children}
    </div>
  )
}

export default Tab
