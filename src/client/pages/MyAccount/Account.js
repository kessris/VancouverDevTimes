import React, { useEffect, useState } from 'react';
import styles from './Account.css';
import { getUser, updateUserSubscription } from '../../actions/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useRowSelect } from 'react-table';

const Account = ({ user, subscribed, updateUserSubscriptionAction, users }) => {
    const [checked, setChecked] = useState(subscribed);
    const currentUser = users.filter(curr => curr.EMAIL === user.EMAIL)[0];
    return (
        <div className={styles.container}>
            <div className={styles.header}>MY ACCOUNT</div>
            <div className={styles.body}>
                <div className={styles.blockContainer}>
                    <div className={styles.block}>
                        <h3 className={styles.title}>Email</h3>
                        <p className={styles.item}>{ currentUser.EMAIL }</p>
                        <br/>

                        <h3 className={styles.title}>Username</h3>
                        <p className={styles.item}>{ currentUser.USER_NAME }</p>
                        <br/>

                        <h3 className={styles.title}>User type</h3>
                        <p className={styles.item}>{ currentUser.TYPE }</p>
                        <br/>

                        <h3 className={styles.title}>Company Name</h3>
                        <p className={styles.item}>{ currentUser.companyName }</p>
                        <br/><br/><br/>

                        <label htmlFor="subscription">Subscribe for a weekly update of new posts.</label>
                        <input
                            type="checkbox"
                            id="subscription"
                            name="isSubscribed"
                            checked={ checked }
                            onChange={ () => {} }
                            onClick={ () => {
                                updateUserSubscriptionAction({ email: currentUser.EMAIL, isSubscribed: !checked });
                                setChecked(!checked);
                            } }
                        />
                        <br/><br/>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    subscribed: state.authReducer.subscription,
    users: state.authReducer.users.users
})

const mapDispatchToProps = (dispatch) => ({
    updateUserSubscriptionAction: (action) => dispatch(updateUserSubscription(action)),
    getUserAction: (action) => dispatch(getUser(action))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));
