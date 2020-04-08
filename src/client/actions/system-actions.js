import { createActions } from 'redux-actions';

export const {
    getSchedulerSettings,
    getSchedulerSettingsResults,
    getPermissionSettings,
    getPermissionSettingsResults,
    updateSystemSettings,
    updateSystemSettingsResults,
    setUpdateStatus
} = createActions(
    'GET_SCHEDULER_SETTINGS',
    'GET_SCHEDULER_SETTINGS_RESULTS',
    'GET_PERMISSION_SETTINGS',
    'GET_PERMISSION_SETTINGS_RESULTS',
    'UPDATE_SYSTEM_SETTINGS',
    'UPDATE_SYSTEM_SETTINGS_RESULTS',
  'SET_UPDATE_STATUS'
);
