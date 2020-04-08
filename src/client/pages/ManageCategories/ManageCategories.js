import React, { useEffect, useState } from 'react';
import styles from './ManageCategories.css';
import { addCategory, getAllCategories, deleteCategory } from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CTable from "../../components/C-Table/CTable";
import AddNewModal from "../../components/AddNewModal/AddNewModal";

const ManageCategories = ({
    addCategoryAction,
    categories,
    getAllCategoriesAction,
    deleteCategoryAction
}) => {

    useEffect(() => {
        if (categories === undefined || categories.length === 0) {
            getAllCategoriesAction();
        }
    }, [getAllCategoriesAction]);


    let data = [];

    if (categories) {
        data = categories;
    }

    function addCategory(input) {
        addCategoryAction(input);
        getAllCategoriesAction();
    }

    function deleteCategory(input) {
        deleteCategoryAction(input);
        getAllCategoriesAction();
        data = categories;
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>MANAGE CATEGORIES</div>
            <div className={styles.body}>
                <CTable data={data} deleteSelected={deleteCategory}/>
                <br/>
                <AddNewModal addNew={addCategory} type={"Category"}/>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    categories: state.categoryReducer.categories
});

const mapDispatchToProps = (dispatch) => ({
    addCategoryAction: (action) => dispatch(addCategory(action)),
    getAllCategoriesAction: (action) => dispatch(getAllCategories(action)),
    deleteCategoryAction: (action) => dispatch(deleteCategory(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageCategories));
