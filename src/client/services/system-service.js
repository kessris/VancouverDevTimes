import axios from 'axios';
import { generateToken } from './index';

export function getSchedulerSettingsService() {
    return axios
        .get('/api/scheduler')
}

export function getPermissionSettingsService() {
    return axios
        .get('/api/permission')
}

export function updateSchedulerSettingsService(payload) {
    return axios.put('/api/updateSettings', {
        permission: payload.permission,
        scheduler: payload.scheduler
    }, generateToken());
}
