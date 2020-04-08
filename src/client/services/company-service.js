import axios from 'axios';
import { generateToken } from './index';

export function getAllCategoriesService() {
    return axios
        .get('/api/categories')
}

export function getAllCompaniesService() {
    return axios
        .get('/api/companies')
}

export function addCompanyService(payload) {
    return axios.post('/api/company', {
        companyName: payload
    }, generateToken())
}

export function deleteCompanyService(payload) {
    return axios.delete('/api/company', {
        headers: { Authorization: 'Bearer '+ localStorage.getItem('token') },
        data: {companyName: payload}
    })
}
