import { handleActions } from 'redux-actions';
import { 
    logIn,
    logOut,
    getUser,
    getUserResult,
    getUsers,
    getUsersResult,
    updateUserSubscription,
    updateUserSubscriptionResult,
    updateUserRole,
    updateUserRoleResult,
    updateUserCompany,
    updateUserCompanyResult
} from '../actions';

const initialState = {
    loggedIn: false,
    user: {permissionType: ''},
    users: {users: []},
    subscription: false,
    updatedRole: '',
    updatedCompany: ''
};

const authReducer = handleActions(
    {
        [logIn]: (state, action) => {
            return {...state, loggedIn: true, user: action.payload, subscription: action.payload.SUBSCRIBED === 1}
        },
        [logOut]: (state) => {
            return {...state, loggedIn: false, user: ''}
        },
        [getUser]: (state) => {
            return {...state}
        },
        [getUserResult]: (state, action) => {
            return {...state, userInfo: action.payload}
        },
        [getUsers]: (state) => {
            return {...state}
        },
        [getUsersResult]: (state, action) => {
            return {...state, users: action.payload}
        },
        [updateUserSubscription]: (state, action) => {
            return {...state, subscription: action.payload.isSubscribed}
        },
        [updateUserSubscriptionResult]: (state) => {
            return {...state}
        },
        [updateUserRole]: (state, action) => {
            return {...state, updatedRole: action.payload.newRole}
        },
        [updateUserCompany]: (state, action) => {
            return {...state, updatedCompany: action.payload.newComp}
        }
    },
    initialState
);

export default authReducer;