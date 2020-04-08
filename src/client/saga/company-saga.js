import { put, call, takeEvery } from 'redux-saga/effects';
import {
    getAllCompanies,
    getAllCompaniesResults,
    addCompany,
    addCompanyResults,
    deleteCompany,
    deleteCompanyResults
} from '../actions';
import {
    getAllCompaniesService,
    addCompanyService,
    deleteCompanyService
} from '../services';

export function* getAllCompaniesSaga(actions) {
    try {
        const response = yield call(getAllCompaniesService, actions.payload);
        yield put(getAllCompaniesResults(response.data));
    } catch (error) {
        yield put(getAllCompaniesResults(error));
    }
}

export function* getAllCompaniesWatcher() {
    yield takeEvery(getAllCompanies, getAllCompaniesSaga);
}

export function* addCompanySaga(actions) {
    try {
        const response = yield call(addCompanyService, actions.payload);
        yield put(addCompanyResults(response.data));
    } catch (error) {
        yield put(addCategoryResults(error));
    }
}

export function* addCompanyWatcher() {
    yield takeEvery(addCompany, addCompanySaga);
}

export function* deleteCompanySaga(actions) {
    try {
        const response = yield call(deleteCompanyService, actions.payload);
        yield put(deleteCompanyResults(response.data));
    } catch (error) {
        yield put(deleteCompanyResults(error));
    }
}

export function* deleteCompanyWatcher() {
    yield takeEvery(deleteCompany, deleteCompanySaga);
}
