import axios from 'axios';
import { generateToken } from './index';

export function getUserService(payload) {
    return axios
        .get('/api/user', {
            params: {
                email: payload
            }
        })
}

export function getUsersService() {
    return axios.get('/api/users')
}

export function updateUserSubscriptionService(payload) {
    return axios.put('/api/user/subscription', {
        email: payload.email,
        isSubscribed: payload.isSubscribed
    }, generateToken())
}

export function updateUserCompanyService(payload) {
    return axios.put('/api/user/company', {
        email: payload.email,
        newComp: payload.newComp
    }, generateToken())
}

export function updateUserRoleService(payload) {
    return axios.put('/api/user/permissions', {
        email: payload.email,
        newRole: payload.newRole
    }, generateToken())
}
