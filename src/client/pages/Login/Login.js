import React, {useState, Component } from 'react';
import BackgroundImage from '../../assets/login2.jpg';
import Logo from '../../assets/logo.png';
import styles from './Login.css';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import {Redirect, withRouter} from 'react-router-dom';
import config from '../../config.json';
import {connect} from "react-redux";
import {logIn } from "../../actions";
import { getAllPendingCount } from "../../actions";
import ErrorMessageModal from "../../components/ErrorMessageModal/ErrorMessageModal";

const Login = (props) => {

    const [errorMessageOpen, setErrorMessageOpen] = useState(false);

    function facebookResponse(response) {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('/api/v1/auth/facebook', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    props.logInAction(user);
                    props.getAllPendingCountAction(user.EMAIL);
                    localStorage.setItem("token", token);
                }
            }).catch(err => console.log(err));
        })
    }

    function googleResponse(response) {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('/api/v1/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    props.logInAction(user);
                    props.getAllPendingCountAction(user.EMAIL);
                    //TODO: remove; this is just for debugging purpose that we can
                    //grab the jwt token for testing
                    console.log(token);
                    localStorage.setItem("token", token);
                }
            }).catch(err => console.log(err));
        })
    }

    function onFailure() {
        setErrorMessageOpen(true);
    }

    return (
        <div className={styles.overlap}>
            <div className={styles.whiteBox}>
                {errorMessageOpen? <ErrorMessageModal errMessage={"Log-in failed. Please try again."} setErrorMessageOpen={setErrorMessageOpen}/>:''}
                <img src={Logo} className={styles.logo}/>
                <div className={styles.oauths}>
                    {
                        // FIXME: For Facebook OAuth to work on production, it requires https. On local dev environment (with domain localhost), it still works even with http.
                        // FIXME: Uncomment the lines below to see the Facebook OAuth working on development.
                    }
                    {/*<FacebookLogin*/}
                        {/*appId={config.FACEBOOK_APP_ID}*/}
                        {/*autoLoad={false}*/}
                        {/*fields="name,email,picture"*/}
                        {/*callback={facebookResponse}*/}
                        {/*onFailure={onFailure}*/}
                        {/*className={styles.test}*/}
                    {/*/>*/}
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="LOGIN WITH GOOGLE"
                        onSuccess={googleResponse}
                        onFailure={onFailure}
                        className={styles.buttons}
                    />
                    <br/><br/>
                    <p className={styles.text}>
                        Do you want to read the latest news and updates from your favorite Vancouver tech companies all at one place?
                        Vancouver DEV Times is a blog aggregator website that shows you the latest content from your favourite blogs on one single page.
                    </p>
                </div>
            </div>
            <img src={BackgroundImage} className={styles.bkgimg}/>
        </div>
    );

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    logInAction: (action) => dispatch(logIn(action)),
    getAllPendingCountAction: (action) => dispatch(getAllPendingCount(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
