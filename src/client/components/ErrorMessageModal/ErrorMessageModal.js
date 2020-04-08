import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        display: 'block',
        padding: '20px',
        width: '20%',
        height: '20%',
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 40,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '20%'
    }
}));

export default function ErrorMessageModal(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.setErrorMessageOpen(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={true}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableScrollLock={ true }
            >
                <Fade in={true}>
                    <div className={classes.paper}>
                        <h3>Error</h3>
                        <p>
                            {props.errMessage}
                        </p>
                        <br/>
                        <Button variant="contained" className={classes.button} onClick={() => {
                            handleClose();
                        }}> Close </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}