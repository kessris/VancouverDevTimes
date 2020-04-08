import React from 'react';
import styles from './Contact.css';
import IconButton from '@material-ui/core/IconButton';
import RssFeedIcon from '@material-ui/icons/RssFeed';

function Contact() {
    return (
        <div className={styles.background}>
            <p style={{ color: 'white', fontSize: '14px' }}>
                To report any bugs or issues, please send an email to the following email address with a screenshot of the issue.
                <br/><br/>
                CONTACT:<br/>
                vantimes.info@gmail.com
                <br/><br/>
                Vancouver DEV Times
                <br /><br />
                <IconButton style={{ color: 'white', marginTop: '-10px'}}  onClick={() => window.open("/api/feed")}>
                    <RssFeedIcon></RssFeedIcon>
                </IconButton>
                <br/>
            </p>
        </div>
    );
}

export default Contact;