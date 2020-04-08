import React, { useEffect, useState } from 'react';
import styles from './ReviewSubmissions.css';
import EditableTable from '../../components/MaterialTable/MaterialTable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getAllPendingContent, getAllApprovedContent, getAllCategories,
  approveBlogSubmission, approveRssSubmission, deleteSubmission, setResourceCategory,
} from "../../actions";

const Scheduler = ({
    getAllPendingContentAction,
    getAllApprovedContentAction,
    getAllCategoriesAction,
    pendingData,
    approvedData,
    user,
    approveBlogSubmissionAction,
    approveRssSubmissionAction,
    deleteSubmissionAction,
    categories,
    setResourceCategoryAction
}) => {
    useEffect(() => {
        getAllPendingContentAction(user.EMAIL);
        getAllApprovedContentAction(user.EMAIL);
        if (categories === undefined || categories.length === 0) {
            getAllCategoriesAction();
        }
    }, [getAllPendingContentAction, getAllApprovedContentAction, getAllCategoriesAction]);

    function deleteSubmission(input) {
        deleteSubmissionAction(input);
        getAllPendingContentAction(user.EMAIL);
    }

    function setResourceCategory(input) {
        setResourceCategoryAction(input);
        getAllPendingContentAction(user.EMAIL);
    }

    let pending = [];
    let approved = [];

    if (pendingData) pending = pendingData;
    if (approvedData) approved = approvedData;
    
    return (
        <div className={styles.root}>
            <div className={styles.header}>REVIEW SUBMISSION</div>
            <EditableTable pendingData={pending} approvedData={approved} user={user} approveBlog={approveBlogSubmissionAction} approveRss={approveRssSubmissionAction} deleteSubmission={deleteSubmission} categories={categories} setResourceCategory={setResourceCategory}/>
        </div>
    );
};

const mapStateToProps = (state) => ({
    pendingData: state.contentReducer.pendingData,
    approvedData: state.contentReducer.approvedData,
    user: state.authReducer.user,
    categories: state.categoryReducer.categories
  });
  
const mapDispatchToProps = (dispatch) => ({
    approveBlogSubmissionAction: (action) => dispatch(approveBlogSubmission(action)),
    approveRssSubmissionAction: (action) => dispatch(approveRssSubmission(action)),
    deleteSubmissionAction: (action) => dispatch(deleteSubmission(action)),
    setResourceCategoryAction: (action) => dispatch(setResourceCategory(action)),
    getAllPendingContentAction: (action) => dispatch(getAllPendingContent(action)),
    getAllApprovedContentAction: (action) => dispatch(getAllApprovedContent(action)),
    getAllCategoriesAction: (action) => dispatch(getAllCategories(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Scheduler));