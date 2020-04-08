import axios from 'axios';
import { generateToken } from './index';

export function addCategoryService(payload) {
    return axios.post('/api/categories', {
        categoryName: payload
    }, generateToken())
}

export function deleteCategoryService(payload) {
    return axios.delete('/api/categories', {
        headers: { Authorization: 'Bearer '+ localStorage.getItem('token') },
        data: {categoryName: payload}
    })
}
