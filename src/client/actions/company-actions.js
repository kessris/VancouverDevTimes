import { createActions } from 'redux-actions';

export const {
    getAllCompanies,
    getAllCompaniesResults,
    deleteCompany,
    deleteCompanyResults,
    addCompany,
    addCompanyResults
} = createActions(
    'GET_ALL_COMPANIES',
    'GET_ALL_COMPANIES_RESULTS',
    'DELETE_COMPANY',
    'DELETE_COMPANY_RESULTS',
    'ADD_COMPANY',
    'ADD_COMPANY_RESULTS'
);
