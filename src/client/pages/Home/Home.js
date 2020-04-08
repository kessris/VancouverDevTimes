import React, {useEffect, useState} from 'react';
import styles from './Home.css';
import { getAllCategories, getApprovedResourcesByCategories, deleteArticle, editArticle, getUsers, getAllApprovedResourcesByCategory } from '../../actions';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import EditCategoryModal from "../../components/EditCategoryModal/EditCategoryModal";
import Contact from "../../components/Contact/Contact";

const Home =({
                 getAllCategoriesAction,
                 getApprovedResourcesByCategoriesAction,
                 deleteArticleAction,
                 editArticleAction,
                 getUsersAction,
                 categories,
                 permissionType,
                 postsByCategories,
                 getAllApprovedResourcesByCategoryAction
             }) => {
    const [deleteMessageOpen, setDeleteMessageOpen] = useState(false);
    const [articleToChange, setArticleToChange] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('');

    useEffect(() => {
        getAllCategoriesAction();
        getApprovedResourcesByCategoriesAction();
        getUsersAction();
    }, [getAllCategoriesAction, getApprovedResourcesByCategoriesAction, getUsersAction]);

    const deleteArticle = (url) => {
        setArticleToChange(url);
        setDeleteMessageOpen(true);
    };

    const editArticle = (url, category) => {
        setArticleToChange(url);
        setCurrentCategory(category);
        setEditModalOpen(true);
    };

    const renderBasedOnUserType = (item, i, j) => {
        if (permissionType === "admin" || permissionType === "sysManager") {
            return (
                <div key={`item${i}${j}`} className={styles.link}>
                    <a style={{color: "#007bff", fontSize: "14px", width: "85%"}} target="_blank" href={item.url}>{item.title}</a>
                    <div className={styles.icons}>
                        <EditIcon onClick={() => editArticle(item.url, item.category)}/>
                        <DeleteIcon onClick={() => deleteArticle(item.url)}/>
                    </div>
                </div>
            )
        } else {
            return (
                <a className={styles.regLink} target="_blank" href={item.url}>{item.title}</a>
            )
        }
    };

    return (
        <div className={styles.flexGrid}>
            { postsByCategories.length > 0 && postsByCategories.map( (category, i) => (
                <div key={`item${i}`} className={styles.gridCell}>
                    <div key={`itemheader${i}`}className={styles.gridCellHeader} onClick={() => getAllApprovedResourcesByCategory(category.category)}>
                        <Link to={`./content/${category.category}`} style={{color: 'black'}}>
                                {category.category} (See more...)
                        </Link>
                    </div>
                    <div key={`container${i}`} className={styles.categoryContainer}>
                        <div>
                            {
                                category.articles.map( (item, j) => renderBasedOnUserType(item, i, j))
                            }
                        </div>
                    </div>
                    {deleteMessageOpen?
                        <ConfirmationModal
                            type={"delete"}
                            deleteArticleAction={deleteArticleAction}
                            getAllResourcesAction={getApprovedResourcesByCategoriesAction}
                            url={articleToChange}
                            setDeleteMessageOpen={setDeleteMessageOpen}
                        />:''}
                    {editModalOpen?
                        <EditCategoryModal
                            editArticleAction={editArticleAction}
                            getAllResourcesAction={getApprovedResourcesByCategoriesAction}
                            categories={categories}
                            url={articleToChange}
                            setEditModalOpen={setEditModalOpen}
                            currentCategory={currentCategory}
                        />:''}
                </div>
            ))}
        </div>
    )
};

const mapStateToProps = (state) => ({
    categories: state.categoryReducer.categories,
    permissionType: state.authReducer.user.permissionType,
    postsByCategories: state.contentReducer.postsByCategories
});

const mapDispatchToProps = (dispatch) => ({
    getAllCategoriesAction: (action) => dispatch(getAllCategories(action)),
    getUsersAction: (action) => dispatch(getUsers(action)),
    getApprovedResourcesByCategoriesAction: (action) => dispatch(getApprovedResourcesByCategories(action)),
    deleteArticleAction: (action) => dispatch(deleteArticle(action)),
    editArticleAction: (action) => dispatch(editArticle(action)),
    getAllApprovedResourcesByCategoryAction: (action) => dispatch(getAllApprovedResourcesByCategory(action)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));