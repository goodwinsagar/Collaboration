import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import '../pages/story/story.css'

const NotificationIcon = () => {
  return (
    <div className='notification-icon'>
      <FontAwesomeIcon icon={faBell} />
    </div>
  )
}

export default NotificationIcon
