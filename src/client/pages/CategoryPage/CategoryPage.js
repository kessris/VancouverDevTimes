import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteArticle, editArticle, getAllApprovedResourcesByCategory } from '../../actions';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import EditCategoryModal from "../../components/EditCategoryModal/EditCategoryModal";
import styles from './CategoryPage.css';

const CategoryPage = ({
                          match,
                          permissionType,
                          deleteArticleAction,
                          editArticleAction,
                          currentCategoryContent,
                          categories,
                          getAllApprovedResourcesByCategoryAction
                      }) => {
    const { params } = match;
    const [deleteMessageOpen, setDeleteMessageOpen] = useState(false);
    const [articleToChange, setArticleToChange] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('');

    useEffect(() => {
        getAllApprovedResourcesByCategoryAction(params.category)
    }, []);

    const deleteArticle = (url) => {
        setArticleToChange(url);
        setDeleteMessageOpen(true);
    };

    const editArticle = (url, category) => {
        setArticleToChange(url);
        setCurrentCategory(category);
        setEditModalOpen(true);
    };

    const renderBasedOnUserType = (item) => {
        if (permissionType === "admin" || permissionType === "sysManager") {
            return (
                <div className={styles.link}>
                    <a style={{color: "#007bff", width: "85%", textAlign: "left", fontSize: "14px"}} target="_blank" href={item.url}>{item.title}</a>
                    <span className={styles.icons}>
                        <EditIcon onClick={() => editArticle(item.url, item.category)}/>
                        <DeleteIcon onClick={() => deleteArticle(item.url)}/>
                    </span>
                </div>
            )
        } else {
            return (
                <div>
                    <a style={{color: "#007bff", width: "85%", textAlign: "left", fontSize: "14px"}} target="_blank" href={item.url}>{item.title}</a>
                    <br/><br/>
                </div>
            )
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {params.category.toUpperCase()}
            </div>
            <div className={ styles.body }>
                {currentCategoryContent.length>0? currentCategoryContent.map(item => renderBasedOnUserType(item)) : ''}
            </div>
            {deleteMessageOpen?
                <ConfirmationModal
                    type={"delete"}
                    deleteArticleAction={deleteArticleAction}
                    getAllResourcesAction={() => getAllApprovedResourcesByCategoryAction(params.category)}
                    url={articleToChange}
                    setDeleteMessageOpen={setDeleteMessageOpen}
                />:''}
            {editModalOpen?
                <EditCategoryModal
                    editArticleAction={editArticleAction}
                    getAllResourcesAction={() => getAllApprovedResourcesByCategoryAction(params.category)}
                    categories={categories}
                    url={articleToChange}
                    setEditModalOpen={setEditModalOpen}
                    currentCategory={currentCategory}
                />:''}
        </div>

    );
}

const mapStateToProps = (state) => ({
    categories: state.categoryReducer.categories,
    users: state.authReducer.users,
    currentCategoryContent: state.contentReducer.currentCategoryContent,
    permissionType: state.authReducer.user.permissionType
});

const mapDispatchToProps = (dispatch) => ({
    getAllApprovedResourcesByCategoryAction: (action) => dispatch(getAllApprovedResourcesByCategory(action)),
    deleteArticleAction: (action) => dispatch(deleteArticle(action)),
    editArticleAction: (action) => dispatch(editArticle(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryPage));