import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import styles from './EditCategoryModal.css';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backDrop: {
        background: 'rgba(0,0,0,0.1)',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        display: 'block',
        padding: '20px',
        width: '30%',
        height: '20%'
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

export default function EditCategoryModal(props) {

    const [selectedCategory, setSelectedCategory] = useState(props.currentCategory);

    const classes = useStyles();

    const handleClose = () => {
        props.setEditModalOpen(false);
    };

    const handleSave = () => {
        const payload = {
            url: props.url,
            categoryName: selectedCategory
        };
        props.editArticleAction(payload);
        props.getAllResourcesAction();
        props.setEditModalOpen(false);
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
                        <h2>Change Category</h2>

                        <select
                            className={styles.select}
                            style={{backgroundColor: 'none'}}
                            type="text"
                            onChange={e => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                            name="category"
                            placeholder='Select Category'
                        >
                            <option hidden disabled selected value=''> -- Select a Category -- </option>
                            { props.categories.map(category => {
                                return (
                                    <option
                                        value={ category }
                                    >
                                        { category }
                                    </option>
                                )
                            })}
                        </select>

                        <br/><br/>
                        <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                            handleSave();
                        }}> Save </Button>
                        {' '}<span/><span/>
                        <Button className={classes.button} variant="contained" color="primary" onClick={() => {
                            handleClose();
                        }}> Cancel </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}