import { handleActions } from 'redux-actions';
import {
  getSchedulerSettings,
  getPermissionSettings,
  updateSystemSettings,
  getSchedulerSettingsResults,
  getPermissionSettingsResults,
  updateSystemSettingsResults,
  setUpdateStatus
} from '../actions';

const initialState = {
  schedulerSettings: [],
  permissionSettings: [],
  updateStatus: 'failed'
};

const systemReducer = handleActions(
  {
    [getSchedulerSettings]: (state, action) => {
      return {...state}
    },
    [getSchedulerSettingsResults]: (state, action) => {
      return {...state, schedulerSettings: action.payload.scheduler}
    },
    [getPermissionSettings]: (state, action) => {
      return {...state}
    },
    [getPermissionSettingsResults]: (state, action) => {
      return {...state, permissionSettings: action.payload.permission}
    },
    [updateSystemSettings]: (state, action) => {
      return {...state}
    },
    [updateSystemSettingsResults]: (state, action) => {
      return {permissionSettings: action.payload.permission, schedulerSettings: action.payload.scheduler, updateStatus: 'success'}
    },
    [setUpdateStatus]: (state, action) => {
      return {...state, updateStatus: 'failed'}
    }
  },
  initialState
);

export default systemReducer;
