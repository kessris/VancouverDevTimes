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
        justifyContent: 'center'
    },
    backDrop: {
        background: 'rgba(0,0,0,0.1)',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        display: 'block',
        padding: '20px',
        width: '30%',
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

export default function ConfirmationModal(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.setDeleteMessageOpen(false);
    };

    const handleYes = () => {
        props.setDeleteMessageOpen(false);
        props.deleteArticleAction(props.url);
        props.getAllResourcesAction();
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
                    classes: {
                        root: classes.backDrop
                    }
                }}
                disableScrollLock={ true }
            >
                <Fade in={true}>
                    <div className={classes.paper}>
                        <p style={{padding: '20px'}}>
                            Are you sure you want to {props.type} this article?
                        </p>
                        <br/>
                        <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                            handleYes();
                        }}> Yes </Button>{' '}
                        <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                            handleClose();
                        }}> No </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}