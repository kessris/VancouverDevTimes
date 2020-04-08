import { put, call, takeEvery } from 'redux-saga/effects';
import {
    getUser,
    getUserResult,
    getUsers,
    getUsersResult,
    updateUserSubscription,
    updateUserSubscriptionResult,
    updateUserCompany,
    updateUserCompanyResult,
    updateUserRole,
    updateUserRoleResult
} from '../actions';
import {
    getUserService,
    getUsersService,
    updateUserSubscriptionService,
    updateUserCompanyService,
    updateUserRoleService
} from '../services';

export function* getUserSaga(actions) {
    try {
        const response = yield call(getUserService, actions.payload);
        yield put(getUserResult(response.data));
    } catch (error) {
        yield put(getUserResult(error));
    }
}

export function* getUserWatcher() {
    yield takeEvery(getUser, getUserSaga);
}

export function* getUsersSaga(actions) {
    try {
        const response = yield call(getUsersService, actions.payload);
        yield put(getUsersResult(response.data));
    } catch (error) {
        yield put(getUsersResult(error));
    }
}

export function* getUsersWatcher() {
    yield takeEvery(getUsers, getUsersSaga);
}

export function* updateUserSubscriptionSaga(actions) {
    try {
        const response = yield call(updateUserSubscriptionService, actions.payload);
        yield put(updateUserSubscriptionResult(response.data));
    } catch (error) {
        yield put(updateUserSubscriptionResult(error));
    }
}

export function* updateUserSubscriptionWatcher() {
    yield takeEvery(updateUserSubscription, updateUserSubscriptionSaga);
}

export function* updateUserCompanySaga(actions) {
    try {
        const response = yield call(updateUserCompanyService, actions.payload);
        yield put(updateUserCompanyResult(response.data));
    } catch (error) {
        yield put(updateUserCompanyResult(error));
    }
}

export function* updateUserCompanyWatcher() {
    yield takeEvery(updateUserCompany, updateUserCompanySaga);
}

export function* updateUserRoleSaga(actions) {
    try {
        const response = yield call(updateUserRoleService, actions.payload);
        yield put(updateUserRoleResult(response.data));
    } catch (error) {
        yield put(updateUserRoleResult(error));
    }
}

export function* updateUserRoleWatcher() {
    yield takeEvery(updateUserRole, updateUserRoleSaga);
}
