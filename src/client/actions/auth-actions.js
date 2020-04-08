import { createActions } from 'redux-actions';

export const {
    logIn,
    logOut,
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
} = createActions(
    'LOG_IN',
    'LOG_OUT',
    'GET_USER',
    'GET_USER_RESULT',
    'GET_USERS',
    'GET_USERS_RESULT',
    'UPDATE_USER_SUBSCRIPTION',
    'UPDATE_USER_SUBSCRIPTION_RESULT',
    'UPDATE_USER_COMPANY',
    'UPDATE_USER_COMPANY_RESULT',
    'UPDATE_USER_ROLE',
    'UPDATE_USER_ROLE_RESULT'
)