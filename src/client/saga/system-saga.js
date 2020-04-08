import { put, call, takeEvery } from 'redux-saga/effects';
import {
    getSchedulerSettings,
    getSchedulerSettingsResults,
    getPermissionSettings,
    getPermissionSettingsResults,
    updateSystemSettingsResults,
    updateSystemSettings
} from '../actions';
import {
    getSchedulerSettingsService,
    getPermissionSettingsService,
    updateSchedulerSettingsService
} from '../services';

export function* getSchedulerSettingsSaga(actions) {
    try {
        const response = yield call(getSchedulerSettingsService, actions.payload);
        yield put(getSchedulerSettingsResults(response.data));
    } catch (error) {
        yield put(getSchedulerSettingsResults(error));
    }
}

export function* getSchedulerSettingsWatcher() {
    yield takeEvery(getSchedulerSettings, getSchedulerSettingsSaga);
}


export function* getPermissionSettingsSaga(actions) {
    try {
        const response = yield call(getPermissionSettingsService, actions.payload);
        yield put(getPermissionSettingsResults(response.data));
    } catch (error) {
        yield put(getPermissionSettingsResults(error));
    }
}

export function* getPermissionSettingsWatcher() {
    yield takeEvery(getPermissionSettings, getPermissionSettingsSaga);
}


export function* updateSettingsSaga(actions) {
    try {
        const response = yield call(updateSchedulerSettingsService, actions.payload);
        yield put(updateSystemSettingsResults(response.data));
    } catch (error) {
        yield put(updateSystemSettingsResults(error));
    }
}

export function* updateSettingsWatcher() {
    yield takeEvery(updateSystemSettings, updateSettingsSaga);
}
