import axios from 'axios';
import { generateToken } from './index';

export function submitArticleLinkService(payload) {
    return axios
        .post('/api/post', {
            url: payload.url,
            title: payload.title,
            category: payload.category,
            permissionType: payload.permissionType
        }, generateToken())
}

export function submitRssFeedService(payload) {
    return axios
        .post('/api/rss', {
            url: payload.url,
            permissionType: payload.permissionType
        }, generateToken())
}

export function getAllResourcesService() {
    return axios
        .get('/api/resources')
}

export function getAllPendingContentService(payload) {
    return axios
        .get('/api/resources/pending', {
            params: {
                user: payload
            }
        })
}

export function getAllApprovedContentService(payload) {
    return axios
        .get('/api/resources/approved/user', {
            params: {
                user: payload
            }
        })
}

export function getAllPendingCountService(payload) {
    return axios
        .get('/api/resources/count', {
            params: {
                user: payload
            }
        })
}

export function approveBlogSubmissionService(payload) {
    return axios
        .post('/api/approvals', {
            user: payload.user,
            url: payload.url
        })
}

export function approveRssSubmissionService(payload) {
    return axios
        .post('/api/approvals/rss', {
            user: payload.user,
            url: payload.url,
            permissionType: payload.permissionType
        })
}

export function deleteSubmissionService(payload) {
    return axios
        .delete('/api/resources', {
            headers: { Authorization: localStorage.getItem('token') },
            data: {url: payload.url}
        })
}

export function setResourceCategoryService(payload) {
    return axios
        .put('/api/resource', {
            url: payload.url,
            categoryName: payload.categoryName
        })
}

export function getApprovedResourcesByCategoriesService() {
    return axios.get('./api/resources/approvedByCategory/10');
}

export function getAllApprovedResourcesByCategoryService(payload) {
    return axios.get(`/api/resource/approved/${payload}`);
}

export function deleteArticleService(payload) {
    return axios
        .delete('/api/resources', {
            headers: { Authorization: localStorage.getItem('token') },
            data: {url: payload}
        })
}

export function editArticleService(payload) {
    return axios.put('/api/resource', {
        url: payload.url,
        categoryName: payload.categoryName
    }, generateToken())
}

export function searchContentService(payload) {
    return axios.get('api/resources/search', { 
        params: {
            titleString: payload.titleString,
            category: payload.category
        } 
    })
}
