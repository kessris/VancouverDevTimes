import React, {useEffect} from 'react';
import CTable from '../../components/C-Table/CTable';
import styles from './ManageCompanies.css';
import {addCompany, deleteCompany, getAllCompanies} from "../../actions";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import AddNewModal from "../../components/AddNewModal/AddNewModal";

const ManageCompanies =({ getAllCompaniesAction, addCompanyAction, deleteCompanyAction, companies }) => {

    useEffect(() => {
        if (companies === undefined || companies.length === 0)
            getAllCompaniesAction();
    }, [getAllCompaniesAction]);

    let data = [];

    if (companies) {
        data = companies;
    }

    function addCompany(input) {
        addCompanyAction(input);
        getAllCompaniesAction();
    }

    function deleteCompany(input) {
        deleteCompanyAction(input);
        getAllCompaniesAction();
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>MANAGE COMPANIES</div>
            <div className={styles.body}>
                <CTable data={data} deleteSelected={deleteCompany}/>
                <br/>
                <AddNewModal addNew={addCompany} type={"Company"}/>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    companies: state.companyReducer.companies
});

const mapDispatchToProps = (dispatch) => ({
    getAllCompaniesAction: (action) => dispatch(getAllCompanies(action)),
    addCompanyAction: (action) => dispatch(addCompany(action)),
    deleteCompanyAction: (action) => dispatch(deleteCompany(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageCompanies));
