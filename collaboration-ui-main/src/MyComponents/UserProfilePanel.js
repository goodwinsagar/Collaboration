import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import utils from '../utils'
import AppModal from './appModal/appModal'

import {
  faTimes,
  faSignOutAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import '../pages/story/story.css'

const UserProfilePanel = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false)

  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null
  let firstLetter = user ? user.name.charAt(0).toUpperCase() : ''

  return (
    <div className='user-profile-panel'>
      <div className='icon-container'>
        <FontAwesomeIcon
          icon={faTimes}
          className='icon close-icon'
          onClick={onClose}
        />

        <FontAwesomeIcon
          icon={faSignOutAlt}
          className='icon logout-icon'
          onClick={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <div className='modal-overlay'>
          <AppModal
            redBtn={true}
            heading={'Logout Confirmation'}
            bodyText={`Are you sure you want to logout?`}
            onYesClick={() => {
              setShowModal(false)
              localStorage.clear()
              window.open(utils.constants.path.login, '_self')
            }}
            onNoClick={() => setShowModal(false)}
          />
        </div>
      )}

      {user && (
        <div className='user-details'>
          <span className='user-name'> {user.name} </span>
          <span className='user-email'>{user.email}</span>
        </div>
      )}
      <div className='avatar-circle'> {firstLetter} </div>
    </div>
  )
}

export default UserProfilePanel
