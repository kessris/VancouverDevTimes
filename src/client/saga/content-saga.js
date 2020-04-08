import { put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import {
    submitArticleLink,
    submitArticleLinkResults,
    submitRssFeed,
    submitRssFeedResults,
    getAllResources,
    getAllResourcesResults,
    getAllPendingContent,
    getAllPendingContentResults,
    getAllApprovedContent,
    getAllApprovedContentResults,
    getAllPendingCount,
    getAllPendingCountResults,
    approveBlogSubmission,
    approveBlogSubmissionResults,
    approveRssSubmission,
    approveRssSubmissionResults,
    deleteSubmission,
    deleteSubmissionResults,
    setResourceCategory,
    setResourceCategoryResults,
    getApprovedResourcesByCategories,
    getApprovedResourcesByCategoriesResults,
    deleteArticle,
    deleteArticleResults,
    editArticle,
    editArticleResults,
    searchContent,
    searchContentResults,
    getAllApprovedResourcesByCategory,
    getAllApprovedResourcesByCategoryResults
} from '../actions';
import {
    submitArticleLinkService,
    submitRssFeedService,
    getAllResourcesService,
    getAllPendingContentService,
    getAllApprovedContentService,
    getAllPendingCountService,
    approveBlogSubmissionService,
    approveRssSubmissionService,
    deleteSubmissionService,
    setResourceCategoryService,
    getApprovedResourcesByCategoriesService,
    deleteArticleService,
    editArticleService,
    searchContentService,
    getAllApprovedResourcesByCategoryService
} from '../services';

export function* deleteArticleSaga(actions){
    try{
        const response = yield call(deleteArticleService, actions.payload);
        yield put(deleteArticleResults(response.data))
    } catch (error) {
        yield put(deleteArticle(error));
    }
}

export function* deleteArticleWatcher() {
    yield takeEvery(deleteArticle, deleteArticleSaga);
}

export function* editArticleSaga(actions){
    try{
        const response = yield call(editArticleService, actions.payload);
        yield put(editArticleResults(response.data))
    } catch (error) {
        yield put(editArticle(error));
    }
}

export function* editArticleWatcher() {
    yield takeLatest(editArticle, editArticleSaga);
}

export function* submitArticleLinkSaga(actions) {
    try {
        const response = yield call(submitArticleLinkService, actions.payload);
        yield put(submitArticleLinkResults(response.data));
    } catch (error) {
        yield put(submitArticleLinkResults(error.response.data));
    }
}

export function* submitArticleLinkWatcher() {
    yield takeEvery(submitArticleLink, submitArticleLinkSaga);
}

export function* submitRssFeedSaga(actions) {
    try {
        const response = yield call(submitRssFeedService, actions.payload);
        yield put(submitRssFeedResults(response.data));
    } catch (error) {
        yield put(submitRssFeedResults(error.response.data));
    }
}

export function* submitRssFeedWatcher() {
    yield takeEvery(submitRssFeed, submitRssFeedSaga);
}

export function* getAllResourcesSaga(actions) {
    try {
        const response = yield call(getAllResourcesService, actions.payload);
        yield put(getAllResourcesResults(response.data));
    } catch (error) {
        yield put(getAllResourcesResults(error));
    }
}

export function* getAllResourcesWatcher() {
    yield takeEvery(getAllResources, getAllResourcesSaga);
}

export function* getAllPendingContentSaga(actions) {
    try {
        const response = yield call(getAllPendingContentService, actions.payload);
        yield put(getAllPendingContentResults(response.data));
    } catch (error) {
        yield put(getAllPendingContentResults(error));
    }
}

export function* getAllPendingContentWatcher() {
    yield takeEvery(getAllPendingContent, getAllPendingContentSaga);
}

export function* getAllApprovedContentSaga(actions) {
    try {
        const response = yield call(getAllApprovedContentService, actions.payload);
        yield put(getAllApprovedContentResults(response.data));
    } catch (error) {
        yield put(getAllApprovedContentResults(error));
    }
}

export function* getAllApprovedContentWatcher() {
    yield takeEvery(getAllApprovedContent, getAllApprovedContentSaga);
}

export function* getAllPendingCountSaga(actions) {
    try {
        const response = yield call(getAllPendingCountService, actions.payload);
        yield put(getAllPendingCountResults(response.data.count));
    } catch (error) {
        yield put(getAllPendingCountResults(error));
    }
}

export function* getAllPendingCountWatcher() {
    yield takeEvery(getAllPendingCount, getAllPendingCountSaga);
}

export function* approveBlogSubmissionSaga(actions){
    try{
        const response = yield call(approveBlogSubmissionService, actions.payload);
        yield put(approveBlogSubmissionResults(response.data));
        yield call(getAllPendingContentSaga, {payload: actions.payload.user});
        yield call(getAllApprovedContentSaga, {payload: actions.payload.user});
    } catch (error) {
        yield put(approveBlogSubmissionResults(error));
    }
}

export function* approveBlogSubmissionWatcher() {
    yield takeEvery(approveBlogSubmission, approveBlogSubmissionSaga);
}

export function* approveRssSubmissionSaga(actions){
    try{
        const response = yield call(approveRssSubmissionService, actions.payload);
        yield put(approveRssSubmissionResults(response.data));
        yield call(getAllPendingContentSaga, {payload: actions.payload.user});
        yield call(getAllApprovedContentSaga, {payload: actions.payload.user});
    } catch (error) {
        yield put(approveRssSubmissionResults(error));
    }
}

export function* approveRssSubmissionWatcher() {
    yield takeEvery(approveRssSubmission, approveRssSubmissionSaga);
}

export function* deleteSubmissionSaga(actions){
    try{
        const response = yield call(deleteSubmissionService, actions.payload);
        yield put(deleteSubmissionResults(response.data));
    } catch (error) {
        yield put(deleteSubmissionResults(error));
    }
}

export function* deleteSubmissionWatcher() {
    yield takeEvery(deleteSubmission, deleteSubmissionSaga);
}

export function* setResourceCategorySaga(actions){
    try{
        const response = yield call(setResourceCategoryService, actions.payload);
        yield put(setResourceCategoryResults(response.data));
    } catch (error) {
        yield put(setResourceCategory(error));
    }
}

export function* setResourceCategoryWatcher() {
    yield takeLatest(setResourceCategory, setResourceCategorySaga);
}

export function* getApprovedResourcesByCategoriesSaga(actions) {
    try {
        const response = yield call(getApprovedResourcesByCategoriesService, actions.payload);
        yield put(getApprovedResourcesByCategoriesResults(response.data));
    } catch (error) {
        yield put(getApprovedResourcesByCategories(error));
    }
}

export function* getApprovedResourcesByCategoriesWatcher() {
    yield takeEvery(getApprovedResourcesByCategories, getApprovedResourcesByCategoriesSaga);
}

export function* searchContentSaga(actions) {
    try {
        const response = yield call(searchContentService, actions.payload);
        yield put(searchContentResults(response.data));
    } catch (error) {
        yield put(searchContentResults(error));
    }
}

export function* searchContentWatcher() {
    yield takeEvery(searchContent, searchContentSaga);
}

export function* getAllApprovedResourcesByCategorySaga(actions) {
    try {
        const response = yield call(getAllApprovedResourcesByCategoryService, actions.payload);
        yield put(getAllApprovedResourcesByCategoryResults(response.data));
    } catch (error) {
        yield put(getAllApprovedResourcesByCategoryResults(error));
    }
}

export function* getAllApprovedResourcesByCategoryWatcher() {
    yield takeEvery(getAllApprovedResourcesByCategory, getAllApprovedResourcesByCategorySaga);
}
