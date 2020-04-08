import { handleActions } from 'redux-actions';
import {
    getAllCompanies,
    getAllCompaniesResults,
    deleteCompany,
    deleteCompanyResults,
    addCompany,
    addCompanyResults
} from '../actions';

const initialState = {
    companies: []
};

const companyReducer = handleActions(
    {
        [getAllCompanies]: (state, action) => {
            return {...state}
        },
        [getAllCompaniesResults]: (state, action) => {
            return {...state, companies: action.payload.allCompanies}
        },
        [deleteCompany]: (state, action) => {
            return {...state}
        },
        [deleteCompanyResults]: (state, action) => {
            const index = state.companies.indexOf(action.payload.companyName);
            const allCompanies = state.companies;
            if (index > -1) allCompanies.splice(index , 1);
            return {...state, companies: allCompanies}
        },
        [addCompany]: (state, action) => {
            return {...state}
        },
        [addCompanyResults]: (state, action) => {
            let temp = state.companies;
            temp.push(action.payload.companyName);
            return {...state, companies: temp}
        }
    },
    initialState
)

export default companyReducer;
