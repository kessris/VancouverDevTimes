import { combineReducers } from 'redux';
import contentReducer from './content-reducer';
import authReducer from './auth-reducer';
import categoryReducer from './category-reducer';
import companyReducer from  './company-reducer';
import systemReducer from './system-reducer';

export default combineReducers({
    contentReducer,
    authReducer,
    categoryReducer,
    companyReducer,
    systemReducer
})
