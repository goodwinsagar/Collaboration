import axios from "axios";
import utils from "../utils";

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json', // Example headers
        'Authorization': `Bearer ${localStorage.getItem(utils.constants.localStorageItem.TOKEN)}`,
    },
});

async function registerUser(body) {
    try {
        return await instance.post("auth/signup", body);
    } catch (e) {
        throw e;
    }
}

async function loginUser(body) {
    try {
        const response = await instance.post("auth/signin", body);
        return response;
    } catch (e) {
        throw e;
    }
}

async function createStory(body) {
    try {
        return await instance.post("database/create/story", body)
    } catch (e) {}
}

async function updateStory(body) {
    try {
        return await instance.put("database/update/story", body)
            // get active story
            // database/update/story/:id
    } catch (e) {}
}

async function getStory(token) {
    try {
        const response = await instance.get(
            "database/load/story", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        return response;
    } catch (e) {
    }
}

async function getStoryDetails(id) {
    try {
        return await instance.get(`database/load/story/${id}`)
    } catch (e) {}
}

async function getStoryHistory(storyId) {
    try {
        return await instance.get(`database/load/logs/${storyId}`)
    } catch (e) {}
}

async function blockStoryEdit(body) {
    try {
        return await instance.put("database/update/story-edit", body)
    } catch (e) {
    }
}

async function deleteStory(body) {
    try {
        return await instance.put("database/delete/story", body)
    } catch (e) {}
}

const api = {
    registerUser,
    loginUser,
    createStory,
    updateStory,
    getStory,
    getStoryDetails,
    getStoryHistory,
    blockStoryEdit,
    deleteStory
}

export default api;