import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import './story.css'
import Logo from '../../MyComponents/Logo'
// import StoryTab from '../../MyComponents/StoryTab'
// import MembersTab from '../../MyComponents/MembersTab'
import UserProfilePanel from '../../MyComponents/UserProfilePanel'
import AddStory from '../../MyComponents/AddStory'
import SearchBar from '../../MyComponents/SearchBar'
import StoryTable from '../../MyComponents/StoryTable'
import Pagination from '../../MyComponents/Pagination'
import StoryBoard from '../storyboard/storyBoard'
import utils from '../../utils'
import api from '../../api/apiCalls'
import Spinner from '../../MyComponents/Spinner'

// Main Story component
const Story = () => {
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false)
  let [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [searchText, setSearchText] = useState('')
  const [selectedStory, setSelectedStory] = useState(null)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  let firstLetter = user.name.charAt(0).toUpperCase()

  const navigate = useNavigate()

  useEffect(() => {
    handleResize()

    const fetchStories = async () => {
      setLoading(true)

      try {
        const response = await api.getStory(token)
        const sortedStories = response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
        setStories(sortedStories)
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      }

      setLoading(false)
    }

    fetchStories()
  }, [token])

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setItemsPerPage(4)
    } else {
      setItemsPerPage(6)
    }
  }

  window.addEventListener('resize', handleResize)

  const filteredStories = stories.filter(story => {
    const storyId = String(story.storyID)
    const storyTitle = story.title.toLowerCase()
    let storyAuthor
    if (story.author && story.author.name) {
      storyAuthor = story.author.name.toLowerCase()
    }
    const searchLower = searchText.toLowerCase()
    return (
      storyId.includes(searchText) ||
      storyTitle.includes(searchLower) ||
      (storyAuthor && storyAuthor.includes(searchLower))
    )
  })

  const handleRowClick = story => {
    setSelectedStory(story)
    navigate(`/story-board/${story.storyID}`, {
      state: { selectedStory: story }
    })
  }

  // Pagination calculations
  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentStories = filteredStories.slice(firstItemIndex, lastItemIndex)
  const totalPages = Math.ceil(stories.length / itemsPerPage)

  // Page change handler
  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className='home-container'>
      <header className='home-header'>
        <Logo />
        <div className='tabs'>
          {/* <StoryTab
            isSelected={selectedTab === 'story'}
            onClick={() => setSelectedTab('story')}
          />
          <MembersTab
            isSelected={selectedTab === 'members'}
            onClick={() => setSelectedTab('members')}
          /> */}
        </div>
        <div className='header-right'>
          <div
            className='user-profile-icon'
            onClick={() => setIsUserProfileVisible(!isUserProfileVisible)}
          >
            <div className='avatar-circle'>{firstLetter}</div>
          </div>
          {isUserProfileVisible && (
            <UserProfilePanel onClose={() => setIsUserProfileVisible(false)} />
          )}
        </div>
      </header>
      <div className='home-body'>
        <div className='story-search'>
          <AddStory />
          <SearchBar
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        {/* {selectedTab === 'story' ? ( */}
        <div className='story-table'>
          {loading ? (
            <div className='spinner-container'>
              <Spinner />
            </div>
          ) : (
            // Show spinner when loading
            <StoryTable stories={currentStories} onRowClick={handleRowClick} />
          )}
          {selectedStory && <StoryBoard selectedStory={selectedStory} />}
        </div>
        {/* ) : (
          <div className='members-table'>{}</div>
        )} */}
        <div className='home-footer'>
          <Pagination
            pages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Story
