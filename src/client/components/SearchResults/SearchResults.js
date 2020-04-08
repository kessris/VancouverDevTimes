import React, {useEffect, useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getApprovedResourcesByCategories, deleteArticle, editArticle, searchContent } from '../../actions';
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import EditCategoryModal from "../../components/EditCategoryModal/EditCategoryModal";
import styles from './SearchResults.css';

const SearchResults = ({
    searchValue,
    searchCategory,
    searchResults,
    searchResultsLoading,
    permissionType,
    editArticleAction,
    deleteArticleAction,
    searchContentAction,
    getApprovedResourcesByCategoriesAction,
    categories
}) => {
    const [deleteMessageOpen, setDeleteMessageOpen] = useState(false);
    const [articleToChange, setArticleToChange] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('');
    useEffect(() => {
        searchContent
    }, [searchContent]);
    
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
                    <a style={{color: "#007bff", width: "85%", textAlign: "left"}} target="_blank" href={item.url}>{item.title} </a>
                    <span><Link to={`./content/${item.categoryName}`} style={{color: 'black'}}> [ {item.categoryName} ]</Link></span>
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
                    <span><Link to={`./content/${item.categoryName}`} style={{color: 'black'}}> [ {item.categoryName} ]</Link></span>
                    <br/><br/>
                </div>
            )
        }
    };
    const searchValueLabel = searchValue && searchValue !== '' ? <>{` for '${searchValue}'`}</> : null;
    const searchCategoryLabel = searchCategory && searchCategory !== 'All' ? <>{` in category ${searchCategory}`}</> : <>{` in all categories`}</>;
    return (
        <div className={styles.container}>
            <div className={styles.header}>SEARCH RESULTS{searchValueLabel}{searchCategoryLabel}</div>
            <div className={styles.body}>
                { searchResultsLoading ? <span>Searching for results...</span> : (
                    <>
                        { (searchResults === undefined || (searchResults && searchResults.length === 0)) ? <span>No results found</span> : (
                            <>
                                <div className={styles.body}>
                                    { searchResults.map(item => renderBasedOnUserType(item))}
                                </div>
                                {deleteMessageOpen?
                                    <ConfirmationModal
                                        type={"delete"}
                                        deleteArticleAction={deleteArticleAction}
                                        getAllResourcesAction={() => searchContentAction({
                                            titleString: searchValue === '' ? ' ' : searchValue,
                                            category: searchCategory })}
                                        url={articleToChange}
                                        setDeleteMessageOpen={setDeleteMessageOpen}
                                    />:''}
                                {editModalOpen?
                                    <EditCategoryModal
                                        editArticleAction={editArticleAction}
                                        getAllResourcesAction={() => searchContentAction({
                                            titleString: searchValue === '' ? ' ' : searchValue,
                                            category: searchCategory })}
                                        categories={categories}
                                        url={articleToChange}
                                        setEditModalOpen={setEditModalOpen}
                                        currentCategory={currentCategory}
                                    />:''}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    searchValue: state.contentReducer.searchValue,
    searchCategory: state.contentReducer.searchCategory,
    searchResults: state.contentReducer.searchResults.allMatchedResources,
    searchResultsLoading: state.contentReducer.searchResults.loading,
    categories: state.categoryReducer.categories,
    permissionType: state.authReducer.user.permissionType
});

const mapDispatchToProps = (dispatch) => ({
    getApprovedResourcesByCategoriesAction: (action) => dispatch(getApprovedResourcesByCategories(action)),
    deleteArticleAction: (action) => dispatch(deleteArticle(action)),
    editArticleAction: (action) => dispatch(editArticle(action)),
    searchContentAction: (action) => dispatch(searchContent(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults));