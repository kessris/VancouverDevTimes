import React, { useEffect, useState } from 'react';
import {Formik} from 'formik';
import {Link, withRouter} from 'react-router-dom';
import SearchResults from '../SearchResults';
import { fade, makeStyles } from '@material-ui/core/styles';
import styles from './MenuBar.css';
import { AppBar, Badge, Menu, Button, MenuItem, Modal, Backdrop, Fade, InputBase, Toolbar, Select,Paper, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {logOut, setSearchValue, setSearchCategory, searchContent} from "../../actions";
import {connect} from "react-redux";

function MenuBar(props) {
    const [state, setState] = useState({
        category: 'Select Category'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalOpen, setSubmitModal] = useState(false);
    const [thankDialogOpen, setDialogOpen] = useState(false);
    const [reviewSubmissionOpen, setReviewSubmissionOpen] = useState(false);
    const [ searchValueState, setSearchValueState] = useState('');
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [searchCategory, setSearchCategory] = useState('All')
    const categories = props.categories;
    const handleSelectChange = name => event => {
        setState({
          ...state,
          [name]: event.target.value,
        });
    };

    const open = Boolean(anchorEl);

    const handleMenu = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleOpenSubmissionModal = () => {
        setSubmitModal(true);
    };

    const handleCloseSubmissionModal = () => {
        setSubmitModal(false);
    }

    const handleOpenThankYouDialog = () => {
        setDialogOpen(true);
    }

    const handleCloseThankYouDialog = () => {
        setDialogOpen(false);
    }

    const handleReviewSubmissionOpen = () => {
        setReviewSubmissionOpen(true);
    }

    const handleReviewSubmissionClose = () => {
        setReviewSubmissionOpen(false);
    }


    const useStyles = makeStyles(theme => ({
        bar: {
            background: '#000',
            height: '3.5rem'
        },
        root: {
          padding: '2px 4px',
          margin: '2rem',
          display: 'flex',
          alignItems: 'center',
          width: 200,
          height: '1.5rem',
        },
        input: {
          marginLeft: theme.spacing(1),
          flex: 1,
        },
        iconButton: {
          padding: 10,
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        divGrow: {
          flexGrow: 1,
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            padding: theme.spacing(2, 4, 3),
            height: 'auto',
            maxWidth: '80%'
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }));

    const classes = useStyles();

    const renderOptionsBasedOnUserType = () => {
        let userType = props.user.permissionType;
        if (userType === "sysManager") {
            return (
                <div>
                    <Button variant="outlined" className={classes.button}><Link to='/manage-users' className={styles.button}>Manage Users</Link></Button>
                    <Button variant="outlined" className={classes.button}><Link to='/manage-categories' className={styles.button}>Manage Categories</Link></Button>
                    <Button variant="outlined" className={classes.button}><Link to='/manage-companies' className={styles.button}>Manage Companies</Link></Button>
                    <Button variant="outlined" className={classes.button}><Link to='/system-settings' className={styles.button}>System Settings</Link></Button>
                </div>
            )
        }
    };

    const renderBell = () => {
        let userType = props.user.permissionType;
        let pendingCount = props.pendingCount;
        if (userType === "sysManager" || userType === "admin") {
            return (
                <Link to="/review-submissions">
                    <IconButton aria-label={`show ${pendingCount} new notifications`} style={{color: "white"}} >
                        <Badge badgeContent={pendingCount} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Link>
            )
        }
    };

    const renderCategoryMenu = () => {
        return (
            <div>
                {props.categories.map(category => {
                    <Button><Link to={`/content/${category}`}>{category}</Link></Button>
                })}
                <Button><Link to='/content'>All content</Link></Button>
            </div>
        )
    }

    return (
        <AppBar className={classes.bar} position="static">
            <Toolbar>
                <Select
                    native
                    value={searchCategory}
                    onChange= {(e) => setSearchCategory(e.currentTarget.value)}
                    labelWidth={260}
                    inputProps={{
                        category: 'category'
                    }}
                    style={{ background: '#FFF', minWidth: '40px', fontSize: '13px'}}
                >
                    <option key='All' value='All'>All Categories</option>
                    { props.categories.map(category => {
                        return (
                            <option key={category} value={category}>{category}</option>
                        )
                    })}
                </Select>
                
                <Paper className={classes.root} component="form">
                
                    <InputBase
                        placeholder="Search by title..."
                        inputProps={{ 'aria-label': 'Search' }}
                        value={searchValueState}
                        onChange={(e) => setSearchValueState(e.currentTarget.value)}
                        onKeyPress={ (event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                props.searchContentAction({
                                    titleString: searchValueState === '' ? ' ' : searchValueState,
                                    category: searchCategory });
                                props.setSearchValueAction(searchValueState);
                                props.setSearchCategoryAction(searchCategory);
                                setSearchCategory('All');
                                setSearchValueState('');
                                props.history.push('/search-results');
                            }
                        }}
                    />
                    <Link to="/search-results">
                        <IconButton
                            style={{padding: 10}}
                            aria-label="search"
                            onClick={ () => {
                                props.searchContentAction({
                                    titleString: searchValueState === '' ? ' ' : searchValueState,
                                    category: searchCategory });
                                props.setSearchValueAction(searchValueState);
                                props.setSearchCategoryAction(searchCategory);
                                setSearchCategory('All');
                                setSearchValueState('');
                            }}
                            onKeyPress={ (event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    props.searchContentAction({
                                        titleString: searchValueState === '' ? ' ' : searchValueState,
                                        category: searchCategory });
                                    props.setSearchValueAction(searchValueState);
                                    props.setSearchCategoryAction(searchCategory);
                                    setSearchCategory('All');
                                    setSearchValueState('');
                                }
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                        </Link>
                </Paper>
                <div className={classes.divGrow}></div>

                <Button variant="outlined" className={classes.button}><Link to='/home' className={styles.button}>Home</Link></Button>
                
                {renderOptionsBasedOnUserType()}

                <Button variant="outlined" className={classes.button}><Link to='/submit-article' className={styles.button}>Submit An Article</Link></Button>

                {renderBell()}


                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                        disableScrollLock={ true }
                    >
                        <Link to="./account-profile">
                            <MenuItem onClick={handleClose} style={{color: 'black'}}>My Account</MenuItem>
                        </Link>
                        <MenuItem onClick={() => props.logOutAction()}>Log Out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    pendingCount: state.contentReducer.pendingCount,
    categories: state.categoryReducer.categories
});

const mapDispatchToProps = (dispatch) => ({
    logOutAction: (action) => {
        localStorage.removeItem('token');
        dispatch(logOut(action));
    },
    setSearchValueAction: (action) => dispatch(setSearchValue(action)),
    setSearchCategoryAction: (action) => dispatch(setSearchCategory(action)),
    searchContentAction: (action) => dispatch(searchContent(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuBar));
