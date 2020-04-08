import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuBar from '../MenuBar';
import HeaderImage from '../../assets/vancouver-8.png';
import Logo from '../../assets/logo.png';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllPendingCount } from "../../actions";


const Header = ({
    user,
    getPendingCountAction,
    pendingCount,
    pendingData,
    approvedData,
    children
}) => {
    useEffect(() => {
        getPendingCountAction(user.EMAIL);
    }, [getPendingCountAction, pendingData, approvedData]);

    return (
        <div>
            <div style={{float: 'left', position: 'absolute', zIndex: '10'}}>
                <Link to='/home'>
                    <img src={Logo} alt='header' />
                </Link>
            </div>
            <div>
                <img style={{maxWidth: '100%', display: 'table-cell'}} src={HeaderImage} alt='header' />
            </div>
            <MenuBar pendingCount={pendingCount}/>
            {children}
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    pendingData: state.contentReducer.pendingData,
    approvedData: state.contentReducer.approvedData,
    pendingCount: state.contentReducer.pendingCount
});

const mapDispatchToProps = (dispatch) => ({
    getPendingCountAction: (action) => dispatch(getAllPendingCount(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));