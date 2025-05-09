import React, { useEffect, useState } from 'react'
import '../pages/story/story.css'
import moment from 'moment'

function StoryTable ({ stories, onRowClick }) {
  useEffect(() => {}, [stories])
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th className='id-column'>ID</th>
            <th className='title-column'>Title</th>
            <th className='owner-column'>Owner</th>
            <th className='tags-column'>Story tags</th>
            <th className='edit-time-column'>Edit time</th>
          </tr>
        </thead>
        <tbody>
          {stories.map(story => (
            <tr
              className='table-rows'
              key={story.storyID}
              onClick={() => onRowClick(story)}
            >
              <td className='id-column'>#{story.storyID}</td>
              <td className='title-column'>{story.title}</td>
              <td className='owner-column'>
                {story.author && story.author.name ? story.author.name : '--'}
              </td>
              <td className='tag-row tags-column'>
                {story.tags && story.tags.length > 0 ? (
                  <>
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <button key={index} className='tag-btn'>
                        {tag}
                      </button>
                    ))}

                    {story.tags.length > 3 && <span>...</span>}
                  </>
                ) : (
                  'No tags'
                )}
              </td>
              <td className='edit-time-column'>
                {moment(story.updatedAt).fromNow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StoryTable
