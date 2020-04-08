import { put, call, takeEvery } from 'redux-saga/effects';
import {
    addCategory,
    addCategoryResults,
    getAllCategories,
    getAllCategoriesResults,
    deleteCategory,
    deleteCategoriesResults
} from '../actions';
import {
    addCategoryService,
    getAllCategoriesService,
    deleteCategoryService
} from '../services';

export function* addCategorySaga(actions) {
    try {
        const response = yield call(addCategoryService, actions.payload);
        yield put(addCategoryResults(response.data));
    } catch (error) {
        yield put(addCategoryResults(error));
    }
}

export function* addCategoryWatcher() {
    yield takeEvery(addCategory, addCategorySaga);
}

export function* deleteCategorySaga(actions) {
    try {
        const response = yield call(deleteCategoryService, actions.payload);
        yield put(deleteCategoriesResults(response.data));
    } catch (error) {
        yield put(deleteCategoriesResults(error));
    }
}

export function* deleteCategoryWatcher() {
    yield takeEvery(deleteCategory, deleteCategorySaga);
}

export function* getAllCategoriesSaga(actions) {
    try {
        const response = yield call(getAllCategoriesService, actions.payload);
        yield put(getAllCategoriesResults(response.data));
    } catch (error) {
        yield put(getAllCategoriesResults(error));
    }
}

export function* getAllCategoriesWatcher() {
    yield takeEvery(getAllCategories, getAllCategoriesSaga);
}
