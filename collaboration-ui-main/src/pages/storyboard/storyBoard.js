import {useEffect, useState} from 'react'
import './storyBoard.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import MyComponents from '../../MyComponents'
import utils from '../../utils'
import {useNavigate, useLocation} from 'react-router-dom'
import api from "../../api/apiCalls";
import { toast } from "react-toastify";

const testHistory = [
    {time: '20 Dec 2024, 1:30 pm', action: 'Created', user: 'Senura'},
    {time: '20 Dec 2024, 1:30 pm', action: 'Created', user: 'Senura'},
    {time: '20 Dec 2024, 1:30 pm', action: 'Created', user: 'Senura'}
]

function StoryBoard() {
    const [storyHistory, setStoryHistory] = useState([])
    const navigate = useNavigate()
    const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false)
    const [storyTitle, setStoryTitle] = useState('')
    const [contentValue, setContentValue] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [historyVisible, setHistoryVisible] = useState(false)
    const [tagList, setTagList] = useState([])
    const [showDeleteTagModal, setShowDeleteTagModal] = useState(false)
    const [isCreateStory, setIsCreateStory] = useState(true)
    const [storyId, setStoryId] = useState(null)
    const [storyIdToShow, setStoryIdToShow] = useState(null)
    const [storyData, setStoryData] = useState(null)
    const [tagToDelete, setTagToDelete] = useState(null)
    const [author, setAuthor] = useState(null)
    const [blockEditing, setBlockEditing] = useState(false)
    const [message, setMessage] = useState("")
    const location = useLocation()
    const {selectedStory} = location.state || {}
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        setUpCalls()
        return () => {
            clearTimeout(timer);
        };
    }, [selectedStory])

    async function setUpCalls() {
        if (location.pathname.includes("story-board")) {
            const parts = location.pathname.split('/');
            const id = parts[parts.length - 1];
            if (id.includes("story-board")) {
                setIsCreateStory(true)
            } else {
                setIsCreateStory(id ? false : true)
            }
        }
        const user = JSON.parse(localStorage.getItem(utils.constants.localStorageItem.USER))
        const authorId = user._id
        setAuthor(authorId)
        if (selectedStory) {
            const storyId = selectedStory._id
            setStoryId(storyId)
            await getStoryDetails(storyId, authorId, 1)
        }
    }

    async function closeStory() {
        clearTimeout(timer)
        if (!blockEditing && !isCreateStory) {
            await blockStoryEdit(storyId, author, true)
        }
        navigate(utils.constants.path.story)
    }

    async function blockStoryEdit(storyIdVal, authorId, isActive) {
        try {
            const body = {
                id: storyIdVal ? storyIdVal : storyId,
                author: authorId ? authorId : author,
                isActive: isActive,
            }
            const res = await api.blockStoryEdit(body);
        } catch (e) {
        }
    }

    async function getStoryDetails(storyId, authorIdVal, callNumber) {
        try {
            let newAuthor = authorIdVal ? authorIdVal : author
            let res = await api.getStoryDetails(storyId);
            if (res && res.data) {
                let data = res.data
                if (callNumber == 1) {
                    if (data.isActive) {
                        await blockStoryEdit(storyId, newAuthor, false)
                        setMessage("")
                        setBlockEditing(false)
                        clearTimeout(timer);
                    } else {
                        // const time = 5 * 60 * 1000
                        const time = 10 * 1000
                        setBlockEditing(true)
                        setMessage("Editing disabled. Another user is making changes, try later.")
                        clearTimeout(timer)
                        const newTimer = setTimeout(() => {
                            getStoryDetails(storyId, authorIdVal, 1);
                        }, time);
                        setTimer(newTimer)
                    }
                }

                setStoryData(data)
                setContentValue(data.body)
                setStoryTitle(data.title)
                setTagList(data.tags)
                setStoryIdToShow(data.storyID)

            }
        } catch (e) {
        }
    }

    function getCleanBody(bodyText) {
        if (bodyText !== null) {
            let containsNonTags = /[^<>]+/.test(bodyText);
            let cleanString = containsNonTags ? bodyText : bodyText.replace(/<\/?[^>]+(>|$)/g, "");
            return cleanString;
        } else {
            return ""
        }
    }

    async function createStory(newTagList) {
        try {
            let body = {
                title: storyTitle,
                body: getCleanBody(contentValue),
                author: author,
                tags: newTagList ? newTagList : tagList
            }
            if (body.title == null || body.title == '') {
                alert('Enter story title')
            } else if (body.body == null || body.body == '') {
                alert('Content cannot be empty')
            } else {
                const res = await api.createStory(body);
                if (res && res.data) {
                    setStoryId(res.data._id)
                    getStoryDetails(res.data._id)
                }
                setIsCreateStory(false)
                navigate(`${utils.constants.path.storyBoard}/${res.data.storyID}`)
            }
        } catch (e) {
        }
    }

    async function updateStory(newTagList) {
        try {
            let body = {
                id: storyId, //"660ab7f54e0dd0b019cf2498",
                title: storyTitle,
                body: getCleanBody(contentValue),
                author: author, //'66047d8f29be71cc4c3b4a27',
                tags: newTagList ? newTagList : tagList
            }
            if (body.title == null || body.title == '') {
                alert('Enter story title')
            } else if (body.body == null || body.body == '') {
                alert('Content cannot be empty')
            } else {
                const res = await api.updateStory(body);
                setTagToDelete(null)
                blockStoryEdit(null, null, true)
            }
        } catch (e) {
        }
    }

    function deleteTag() {
        let list = tagList.filter(word => word !== tagToDelete);
        setTagList(list)
        setShowDeleteTagModal(false)
        if (!isCreateStory) {
            updateStory(list)
        }

    }

    async function getStoryHistory() {
        try {
            const res = await api.getStoryHistory(storyId);
            if (res && res.data) {
                const list = res.data
                list.map((item, i) => {
                    let action = item.action
                    switch (item.action) {
                        case utils.constants.history.update:
                            action = "Updated by"
                            break;
                        case utils.constants.history.delete:
                            action = "Deleted by"
                            break;
                        case utils.constants.history.create:
                            action = "Created by"
                            break;
                        default:
                            action = item.action
                    }

                    let obj = {
                        time: item.changedAt,
                        action: action,
                        user: item.changedBy && item.changedBy.name ? item.changedBy.name : "user",
                        fullData: item,
                    }
                    list.push(obj)
                })
                setStoryHistory(list)
            }
        } catch (e) {
        }
    }

    async function deleteStory() {
        try {
            let body = {
                id: storyId,
                author: author,
            }
            const res = await api.deleteStory(body)
            if (res && res.data) {
                toast.success("Story Deleted!");
                setShowDeleteStoryModal(false)
                navigate(utils.constants.path.story)
            }
        } catch (e) {
        }
    }

    return (
        <div className={'story-board-container'}>
            {blockEditing && <MyComponents.IMPMessageModal message={message}/>}
            {showDeleteStoryModal && (
                <MyComponents.AppModal
                    redBtn={true}
                    heading={'Delete Story?'}
                    bodyText={`Are you sure you want to delete this story? \n Clicking on yes will permanently delete the \n story and this action can’t be undone.`}
                    onYesClick={() => {
                        deleteStory()
                    }}
                    onNoClick={() => {
                        setShowDeleteStoryModal(false)
                    }}
                />
            )}

            {showDeleteTagModal && (
                <MyComponents.AppModal
                    heading={'Remove Tag'}
                    bodyText={"Do you want to remove 'History' tag?"}
                    onYesClick={() => {
                        deleteTag();
                    }}
                    onNoClick={() => {
                        setTagToDelete(null)
                        setShowDeleteTagModal(false)
                    }}
                />
            )}
            <div className={'sb-header'}>
                <div className={'sb-header-title-div'}>
                    <button
                        onClick={() => {
                            closeStory()
                        }}
                        className={'back-btn'}
                    >
                        <svg
                            width='35'
                            height='24'
                            viewBox='0 0 35 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g clip-path='url(#clip0_448_350)'>
                                <path
                                    d='M29.1667 12L8.75 12'
                                    stroke='white'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                />
                                <path
                                    d='M16 19L7 12L16 5'
                                    stroke='white'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                />
                            </g>
                            <defs>
                                <clipPath id='clip0_448_350'>
                                    <rect
                                        width='24'
                                        height='35'
                                        fill='white'
                                        transform='matrix(0 -1 1 0 0 24)'
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <div className={'story-title'}>
                        <input
                            disabled={blockEditing}
                            className={'story-title-input'}
                            type='text'
                            placeholder={'Title'}
                            value={storyTitle}
                            onChange={e => {
                                let val = e.target.value
                                setStoryTitle(val)
                            }}
                        />
                        {
                            storyIdToShow &&
                            <div className={'story-id'}>#{storyIdToShow}</div>
                        }

                    </div>
                </div>
                {
                    isCreateStory ? null :
                        <button className={'delete-story-btn'}
                                disabled={blockEditing}
                                onClick={() => {
                                    setShowDeleteStoryModal(true)
                                }}
                        >
                            <div className={'delete-story-btn-div'}>
                                <div>Delete Story</div>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='12'
                                    height='12'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-width='2'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    className='feather feather-trash-2'
                                >
                                    <polyline points='3 6 5 6 21 6'></polyline>
                                    <path
                                        d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                                    <line x1='10' y1='11' x2='10' y2='17'></line>
                                    <line x1='14' y1='11' x2='14' y2='17'></line>
                                </svg>
                            </div>
                        </button>
                }

            </div>
            <div className={'sb-content'}>
                <div className={'sb-content-col sb-content-col-1'}>
                    <div className={'sb-content-col-header'}>
                        <div className={'sb-content-heading'}>Content</div>
                    </div>
                    <div className={'sb-content-col-body'}>
                        <div className={'sb-content-nav'}>
                            <MyComponents.SBContentNavigator
                                htmlString={contentValue}
                                onElementClick={data => {
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={'sb-content-col sb-content-col-2'}>
                    <div className={'sb-content-col-header'}>
                        <div className={'sb-editing-status-container'}>
                            <div className={'sb-editing-status'}>
                                {/*Ajay is editing*/}
                            </div>
                            <div className={'sb-search-container'}>
                                <button
                                    disabled={blockEditing}
                                    onClick={() => {
                                        toast.success("Story Saved!")
                                        if (isCreateStory) {
                                            createStory()

                                        } else {
                                            updateStory()
                                        }
                                    }}
                                    className={'save-btn'}
                                >
                                    Save
                                </button>
                                {/*<input className={"sb-content-search-inp"}*/}
                                {/*       placeholder={"Search in document"}*/}
                                {/*       value={searchValue}*/}
                                {/*       onChange={(e)=>{*/}
                                {/*               setSearchValue(e.target.value)*/}
                                {/*       }}*/}
                                {/*/>*/}
                                {!isCreateStory && !historyVisible && (
                                    <button
                                        className={'sb-history'}
                                        onClick={() => {
                                            setMessage("Editing is disabled in history mode")
                                            setBlockEditing(true)
                                            getStoryHistory()
                                            setHistoryVisible(true)
                                        }}
                                    >
                                        History
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={'sb-content-col-body'}>
                        <ReactQuill
                            readOnly={blockEditing}
                            className={'editor'}
                            theme='snow'
                            value={contentValue}
                            onChange={value => {
                                setContentValue(value)
                            }}
                        />
                        <div className={'sb-content-col-footer'}>
                            <MyComponents.AddTagsTray
                                disable={blockEditing}
                                tagList={tagList}
                                onTagDeleteClick={tag => {
                                    setTagToDelete(tag)
                                    setShowDeleteTagModal(true)
                                }}
                                onTagAdded={list => {
                                    setTagList(list)
                                    if (!isCreateStory) {
                                        updateStory(list)
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {historyVisible && (
                    <div className={'sb-content-col sb-content-col-3'}>
                        <div className={'sb-content-col-header'}>
                            <div className={'sb-content-col-header'}>
                                <div className={'sb-content-heading sb-history-header'}>
                                    <div>Document History</div>
                                    <button
                                        onClick={() => {
                                            setMessage("")
                                            setBlockEditing(false)
                                            getStoryDetails(storyId)
                                            setHistoryVisible(false)
                                        }}
                                        className={'close-sb-history-btn'}
                                    >
                                        <svg
                                            width='20'
                                            height='20'
                                            viewBox='0 0 20 20'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M18.2141 6L6.07129 18'
                                                stroke='#222831'
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                            />
                                            <path
                                                d='M6.07129 6L18.2141 18'
                                                stroke='#222831'
                                                stroke-linecap='round'
                                                stroke-linejoin='round'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={'sb-content-col-body'}>
                            <div className={'sb-history-nav'}>
                                <MyComponents.SBHistory
                                    list={storyHistory}
                                    onItemClick={item => {
                                        if (item.current) {
                                            getStoryDetails(storyId)
                                        } else {
                                            let data = JSON.parse(item.fullData.changes)
                                            data = data.title ? data : data["$set"]
                                            setStoryTitle(data.title)
                                            setContentValue(data.body)
                                            setTagList(data.tags)
                                        }
                                    }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StoryBoard
