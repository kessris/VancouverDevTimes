import { handleActions } from 'redux-actions';
import {
    submitArticleLink,
    submitArticleLinkResults,
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
    submitRssFeed,
    submitRssFeedResults,
    getApprovedResourcesByCategories,
    getApprovedResourcesByCategoriesResults,
    deleteArticle,
    deleteArticleResults,
    editArticle,
    editArticleResults,
    setSearchValue,
    setSearchCategory,
    searchContent,
    searchContentResults,
    getAllApprovedResourcesByCategory,
    getAllApprovedResourcesByCategoryResults
} from '../actions';

const initialState = {
    newPost: {},
    newRSS: {},
    posts: {},
    postsByCategories: [],
    rssFeeds: {},
    pendingData: [],
    approvedData: [],
    pendingCount: 0,
    currUser: '',
    searchResults: { loading: true},
    currentCategoryContent: {}
};

const contentReducer = handleActions(
    {
        [submitArticleLink]: (state) => {
            return {...state, newPost: {loading: true, error: null}}
        },
        [submitArticleLinkResults]: (state, action) => {
            if (action.payload.error)
                return {...state, newPost: {error: action.payload.error, loading: false}};
            else
                return {...state, newPost: {...action.payload, loading: false}}
        },
        [submitRssFeed]: (state) => {
            return {...state, newRSS: {loading: true, error: null}}
        },
        [submitRssFeedResults]: (state, action) => {
            if (action.payload.error)
                return {...state, newRSS: {error: action.payload.error, loading: false}};
            else
                return {...state, newRSS: {...action.payload, loading: false}}
        },
        [getAllResources]: (state) => {
            return {...state, posts: {loading: true, error: {}}}
        },
        [getAllResourcesResults]: (state, action) => {
            return {...state, posts: action.payload}
        },
        [getAllPendingContent]: (state, action) => {
            return {...state, currUser: action.payload}
        },
        [getAllPendingContentResults]: (state, action) => {
            const pending = [];
            action.payload.allLinks && action.payload.allLinks.forEach(item => {
                let approvers = [];
                if(item.approvers) { approvers = item.approvers.split(','); }
                if(!approvers.includes(state.currUser)){
                    let itemToAdd = (({url, resourceType, categoryName, title, approvalCount, approvalThreshold})=>({
                        url, resourceType, categoryName, title, approvalCount, approvalThreshold, approvers: approvers
                    }))(item);
                    pending.push(itemToAdd);
                }
            });
            return {...state, pendingData: pending}
        },
        [getAllApprovedContent]: (state, action) => {
            return {...state, currUser: action.payload}
        },
        [getAllApprovedContentResults]: (state, action) => {
            const approved = [];
            action.payload.allLinks && action.payload.allLinks.forEach(item => {
                let approvers = [];
                if(item.approvers) { approvers = item.approvers.split(','); }
                if(approvers.includes(state.currUser)){
                    let itemToAdd = (({url, resourceType, categoryName, title, approvalCount, approvalThreshold})=>({
                        url, resourceType, categoryName, title, approvalCount, approvalThreshold, approvers: approvers
                    }))(item);
                    approved.push(itemToAdd);
                }
            });
            return {...state, approvedData: approved}
        },
        [getAllPendingCount]: (state, action) => {
            return {...state}
        },
        [getAllPendingCountResults]: (state, action) => {
            return {...state, pendingCount: action.payload}
        },
        [approveBlogSubmission]: (state, action) => {
            return {...state, currUser: action.payload.user}
        },
        [approveBlogSubmissionResults]: (state, action) => {
            const pendingUrls = state.pendingData.map(item => item.url);
            const index = pendingUrls.indexOf(action.payload.url);
            let newPending = state.pendingData;
            if (index > -1) newPending.splice(index , 1);
            return {...state, pendingData: newPending};
        },
        [approveRssSubmission]: (state, action) => {
            return {...state, currUser: action.payload.user}
        },
        [approveRssSubmissionResults]: (state, action) => {
            const pendingUrls = state.pendingData.map(item => item.url);
            const index = pendingUrls.indexOf(action.payload.url);
            let newPending = state.pendingData;
            if (index > -1) newPending.splice(index , 1);
            return {...state, pendingData: newPending};
        },
        [deleteSubmission]: (state, action) => {
            return {...state}
        },
        [deleteSubmissionResults]: (state, action) => {
            const pendingUrls = state.pendingData.map(item => item.url);
            const index = pendingUrls.indexOf(action.payload.url);
            let newPending = state.pendingData;
            if (index > -1) newPending.splice(index , 1);
            return {...state, pendingData: newPending};
        },
        [setResourceCategory]: (state, action) => {
            return {...state}
        },
        [setResourceCategoryResults]: (state, action) => {
            const pendingUrls = state.pendingData.map(item => item.url);
            const index = pendingUrls.indexOf(action.payload.url);
            const newPending = state.pendingData;
            newPending[index].categoryName = action.payload.categoryName;
            return {...state, pendingData: newPending};
        },
        [getApprovedResourcesByCategories]: (state) => {
            return {...state}
        },
        [getApprovedResourcesByCategoriesResults]: (state, action) => {
            return {...state, postsByCategories: action.payload.allApprovedByCategory}
        },
        [deleteArticle]: (state) => {
            return {...state}
        },
        [deleteArticleResults]: (state) => {
            return {...state}
        },
        [editArticle]: (state) => {
            return {...state}
        },
        [editArticleResults]: (state) => {
            return {...state}
        },
        [setSearchValue]: (state, action) => {
            return {...state, searchValue: action.payload}
        },
        [setSearchCategory]: (state, action) => {
            return {...state, searchCategory: action.payload}
        },
        [searchContent]: (state) => {
            return {...state, searchResults: {loading: true}}
        },
        [searchContentResults]: (state, action) => {
            return {...state, searchResults: {...action.payload, loading: false}}
        },
        [getAllApprovedResourcesByCategory]: (state) => {
            return {...state}
        },
        [getAllApprovedResourcesByCategoryResults]: (state, action) => {
            return {...state, currentCategoryContent: action.payload.data}
        }
    },
    initialState
);

export default contentReducer;
