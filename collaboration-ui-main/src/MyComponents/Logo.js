import React from 'react'
import '../pages/story/story.css'
import MyLogo from '../assets/images/logo.png'

const Logo = () => {
  return (
    <div className='logo'>
      {' '}
      <img src={MyLogo} alt='description' />
    </div>
  )
}

export default Logo
