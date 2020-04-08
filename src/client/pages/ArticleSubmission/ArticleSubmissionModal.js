import React, { useEffect, useState } from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import styles from './ArticleSubmissionModal.css';
import { Button } from '@material-ui/core';
import { submitArticleLink, submitRssFeed, getAllResources } from '../../actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles/index";

const useStyles = makeStyles(theme => ({
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 40,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '15%'
    }
}));

const ArticleSubmissionModal = ({
    submitArticleLinkAction,
    submitRssFeedAction,
    getAllResourcesAction,
    categories,
    permissionType,
    newRSS,
    newPost
}) => {
        const [articleSubmitted, setArticleSubmitted] = useState(false);
        const [rssSubmitted, setRssSubmitted] = useState(false);
        const [showArticleForm, setShowArticleForm] = useState(false);
        const [showRSSForm, setShowRSSForm] = useState(false);

        const classes = useStyles();

        const articleSubmissionForm = () => {
            return (
                <Formik
                    initialValues={{ url: '', category: 'Uncategorized', title: '', permissionType: permissionType }}
                    validationSchema={Yup.object().shape({
                        url: Yup.string()
                          .required('Required'),
                        title: Yup.string()
                          .required('Required')
                    })}
                    onSubmit={(values) => {
                        submitArticleLinkAction(values);
                        getAllResourcesAction();
                        setArticleSubmitted(true);
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                        <div>
                            <span className={styles.formLabel}>Article Title *</span>
                            <input
                                className={styles.input}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.title}
                                name="title"
                            />
                            {props.errors.title && <div className={styles.formError} id="feedback">{props.errors.title}</div>}
                        </div>
                        <div>
                            <span className={styles.formLabel}>Category  </span>
                            <select
                                className={styles.select}
                                style={{backgroundColor: 'none'}}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.category}
                                name="category"
                                placeholder='Select Category'
                            >
                                <option hidden disabled selected value=''> -- Select a Category -- </option>
                                { categories.map(category => {
                                    return (
                                        <option
                                            value={ category }
                                        >
                                            { category }
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div>
                            <span className={styles.formLabel}>Article Link *</span>
                            <input
                                className={styles.input}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.url}
                                name="url"
                            />
                            {props.errors.url && <div className={styles.formError} id="feedback">{props.errors.url}</div>}
                        </div>
                        <br />
                        <Button className={classes.button} variant="contained" type="submit" style={ {margin:'20px'} }>Submit</Button>
                        { newPost && newPost.error && <span style={{color: 'red'}}>{newPost.message}</span>}
                        </form>
                    )}
                </Formik>
            )
        }

        const rssSubmissionForm = () => {
            return (
                <Formik
                    initialValues={{ url: '', permissionType: permissionType }}
                    validationSchema={Yup.object().shape({
                        url: Yup.string()
                          .required('Required')
                    })}
                    onSubmit={(values) => {
                        submitRssFeedAction(values);
                        getAllResourcesAction();
                        setRssSubmitted(true);
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                        <div>
                            <span className={styles.formLabel}>RSS Link *</span>
                            <input
                                className={styles.input}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.url}
                                name="url"
                            />
                            {props.errors.url && <div className={styles.formError} id="feedback">{props.errors.url}</div>}
                        </div>
                        <br />
                        <Button className={classes.button} variant="contained" type="submit" style={ {margin:'20px'} }>Submit</Button>
                        { newRSS && newRSS.error && <span style={{color: 'red'}}>{newRSS.message}</span>}
                        </form>
                    )}
                </Formik>
            )
        }
        return (
            <div className={styles.container}>
                <div className={styles.header}>SUBMISSION FORM</div>
                <div className={styles.body}>
                    <span className={styles.subHeader}>Choose a submission type: </span>
                    <Button onClick={ () => { setShowArticleForm(true); setShowRSSForm(false); setArticleSubmitted(false); setRssSubmitted(false);} }>Article</Button>
                    <Button onClick={ () => { setShowArticleForm(false); setShowRSSForm(true); setArticleSubmitted(false); setRssSubmitted(false)} }>RSS</Button>
                    <div className={styles.innerBody}>
                        { (articleSubmitted || rssSubmitted) ?
                            (newRSS.loading || newPost.loading) ?
                                (
                                    <React.Fragment>
                                        { showArticleForm && <div className={ styles.formTitle }>Article Submission Request</div> }
                                        { showRSSForm && <div className={ styles.formTitle }>RSS Submission Request</div> }
                                        <div className={styles.forms}>
                                            { showArticleForm && articleSubmissionForm() }
                                            { showRSSForm && rssSubmissionForm() }
                                        </div>
                                    </React.Fragment>
                                ):
                                (newRSS.errorCode || newPost.errorCode || newPost.code === 'ER_DUP_ENTRY' || newRSS.code === 'ER_DUP_ENTRY') ?
                                (<div className={styles.confirmationMsg}>Submission failed - {showArticleForm && newPost.message}{showArticleForm && newPost.sqlMessage}{showRSSForm && newRSS.message}{showRSSForm && newRSS.sqlMessage}. Choose a submission type to try again.</div>) :
                                    (<div className={styles.confirmationMsg}>Thank you for your submission! Please wait for approval. Choose a submission type to make a new submission.</div>)
                            :
                            (
                                <React.Fragment>
                                    { showArticleForm && <div className={ styles.formTitle }>Article Submission Request</div> }
                                    { showRSSForm && <div className={ styles.formTitle }>RSS Submission Request</div> }
                                    <div className={styles.forms}>
                                        { showArticleForm && articleSubmissionForm() }
                                        { showRSSForm && rssSubmissionForm() }
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }

const mapStateToProps = (state) => ({
    categories: state.categoryReducer.categories,
    permissionType: state.authReducer.user.permissionType,
    newRSS: state.contentReducer.newRSS,
    newPost: state.contentReducer.newPost
})

const mapDispatchToProps = (dispatch) => ({
    submitArticleLinkAction: (action) => dispatch(submitArticleLink(action)),
    submitRssFeedAction: (action) => dispatch(submitRssFeed(action)),
    getAllResourcesAction: (action) => dispatch(getAllResources(action))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleSubmissionModal));
