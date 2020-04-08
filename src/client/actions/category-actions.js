import { createActions } from 'redux-actions';

export const {
    addCategory,
    addCategoryResults,
    getAllCategories,
    getAllCategoriesResults,
    deleteCategory,
    deleteCategoriesResults,
} = createActions(
    'ADD_CATEGORY',
    'ADD_CATEGORY_RESULTS',
    'GET_ALL_CATEGORIES',
    'GET_ALL_CATEGORIES_RESULTS',
    'DELETE_CATEGORY',
    'DELETE_CATEGORIES_RESULTS'
)