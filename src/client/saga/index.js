import { all, fork } from 'redux-saga/effects';
import {
    submitArticleLinkWatcher,
    getAllResourcesWatcher,
    getAllPendingContentWatcher,
    getAllApprovedContentWatcher,
    getAllPendingCountWatcher,
    approveBlogSubmissionWatcher,
    approveRssSubmissionWatcher,
    deleteSubmissionWatcher,
    setResourceCategoryWatcher,
    submitRssFeedWatcher,
    getApprovedResourcesByCategoriesWatcher,
    deleteArticleWatcher,
    editArticleWatcher,
    searchContentWatcher,
    getAllApprovedResourcesByCategoryWatcher
} from './content-saga';
import {
    getAllCompaniesWatcher,
    addCompanyWatcher,
    deleteCompanyWatcher
} from './company-saga';
import {
    addCategoryWatcher,
    getAllCategoriesWatcher,
    deleteCategoryWatcher
} from './category-saga';
import {
    getUserWatcher,
    getUsersWatcher,
    updateUserSubscriptionWatcher,
    updateUserCompanyWatcher,
    updateUserRoleWatcher
} from './user-saga';
import { getSchedulerSettingsWatcher,getPermissionSettingsWatcher,updateSettingsWatcher } from './system-saga';

export default function* root() {
    yield all([
        fork(submitArticleLinkWatcher),
        fork(submitRssFeedWatcher),
        fork(getAllResourcesWatcher),
        fork(addCategoryWatcher),
        fork(getAllCategoriesWatcher),
        fork(getAllCompaniesWatcher),
        fork(deleteCategoryWatcher),
        fork(getAllPendingContentWatcher),
        fork(getAllApprovedContentWatcher),
        fork(getAllPendingCountWatcher),
        fork(approveBlogSubmissionWatcher),
        fork(approveRssSubmissionWatcher),
        fork(deleteSubmissionWatcher),
        fork(setResourceCategoryWatcher),
        fork(addCompanyWatcher),
        fork(deleteCompanyWatcher),
        fork(getUserWatcher),
        fork(getApprovedResourcesByCategoriesWatcher),
        fork(getSchedulerSettingsWatcher),
        fork(getPermissionSettingsWatcher),
        fork(updateSettingsWatcher),
        fork(deleteArticleWatcher),
        fork(editArticleWatcher),
        fork(getUsersWatcher),
        fork(updateUserSubscriptionWatcher),
        fork(updateUserCompanyWatcher),
        fork(updateUserRoleWatcher),
        fork(searchContentWatcher),
        fork(getAllApprovedResourcesByCategoryWatcher)
    ]);
}