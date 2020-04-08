import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        display: 'block',
        padding: '20px',
        width: '30%',
        height: '30%',
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

export default function TransitionsModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    let input = '';

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        props.addNew(input);
    };

    const modalType = props.type;

    return (
        <div>
            <Button variant="contained" className={classes.button} onClick={() => {
                handleOpen();
            }}> Add New </Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                disableScrollLock={ true }
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Add a New {modalType}</h2>
                        <br/>
                        <TextField
                            required
                            id="outlined-required"
                            label={modalType + " Name"}
                            variant="outlined"
                            onChange={(event) => input = event.target.value}
                        />
                        <br/><br/><br/>
                        <Button className={classes.button} variant="contained" onClick={() => {
                            handleAdd();
                            handleClose();
                        }}> Add </Button> {' '}
                        <Button className={classes.button} variant="contained" onClick={() => {
                            handleClose();
                        }}> Close </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}