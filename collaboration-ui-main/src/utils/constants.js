const path = {
    login:"/",
    register:"/register",
    story:"/story",
    storyBoard:"/story-board",
    storyBoardId:"/story-board/:id"
}

const history={
    currentStory:"CURRENT",
    update:"UPDATE",
    delete:"DELETE",
    create:"CREATE",
}

const localStorageItem={
    TOKEN:"token",
    USER:"user",
}

const constants = {
    path,
    history,
    localStorageItem
}

export default constants