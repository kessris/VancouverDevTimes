import React, { useEffect, useState } from 'react';
import { getUsers, getAllCompanies, updateUserCompany, updateUserRole } from '../../actions';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { useTable } from 'react-table';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from '@material-ui/core';
import styles from './ManageUsers.css';
import {makeStyles} from '@material-ui/core/styles';
import Backdrop from "@material-ui/core/Backdrop/index";

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
        height: '45%'
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 35,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '70%',
        fontSize: '13px'
    },
    buttonHidden: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 35,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '70%',
        fontSize: '13px',
        visibility: 'hidden'
    },
    buttonModal: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 45,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '30%'
    }
}));

const ManageUsers = ({
    getUsersAction,
    users,
    companies,
    getAllCompaniesAction,
    updateUserCompanyAction,
    updateUserRoleAction,
    updatedCompany
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [targetEmail, setTargetEmail] = useState('');
    const [targetComp, setTargetComp] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [mouseoveredRow, setMouseoveredRow] = useState(-1);
    const classes = useStyles();
    const columns = React.useMemo(
        () => [
            {
                Header: 'EMAIL',
                accessor: 'EMAIL'
            },
            {
                Header: 'USERNAME',
                accessor: 'USER_NAME'
            },
            {
                Header: 'COMPANY',
                accessor: 'companyName'
            },
            {
                Header: 'ACCOUNT TYPE',
                accessor: 'TYPE'
            }
        ]
    );
    useEffect(() => {
        getUsersAction();
        getAllCompaniesAction();
    }, [updatedCompany]);

    function Table({ columns, data }) {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow
        } = useTable({
            columns,
            data
        });
        return (
            <table {...getTableProps()} onMouseLeave={() => setMouseoveredRow(-1)}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        { headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    const mouseovered = mouseoveredRow === row.id; 
                    const hovered = mouseovered ? { background: '#ebebeb'} : null;
                    return (
                        <tr {...row.getRowProps()} onMouseOver={() => setMouseoveredRow(row.id)}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} style={ hovered }>{cell.render('Cell')}</td>
                            })}
                            { mouseovered ? (
                                <td>
                                    <Button variant="contained" className={classes.button} onClick={() => {
                                        setOpenModal(true);
                                        setTargetEmail(row.original.EMAIL);
                                        setTargetRole(row.original.TYPE);
                                        setTargetComp(row.original.companyName);
                                    }}>Edit</Button>
                                </td>
                            ) : <td><Button variant="contained" className={classes.buttonHidden}>hidden</Button></td> }
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const editUserInfoForm = () => {
        return(
            <Formik
                initialValues={{ newComp: targetComp, newRole: targetRole }}
                onSubmit={(values) => {
                    updateUserCompanyAction({ email: targetEmail, newComp: values.newComp });
                    updateUserRoleAction({ email: targetEmail, newRole: values.newRole });
                    getUsersAction();
                    setOpenModal(false);
                }}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div>
                            <p className={styles.formLabel}>Company</p>
                            <select
                                className={styles.select}
                                style={{backgroundColor: 'none'}}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.newComp || ''}
                                name="newComp"
                                placeholder='Select Category'
                            >
                                { companies.map(company => {
                                    return (
                                        <option
                                            value={ company }
                                        >
                                            { company }
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div>
                            <p className={styles.formLabel}>Role</p>
                            <select
                                className={styles.select}
                                style={{backgroundColor: 'none'}}
                                type="text"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.newRole || ''}
                                name="newRole"
                                placeholder='Select Role'
                            >
                                <option value='regular'>Regular</option>
                                <option value='admin'>System Admin</option>
                                <option value='sysManager'>System Manager</option>
                            </select>
                        </div>
                        <br/><br/>
                        <Button className={classes.buttonModal} variant="contained" type="submit"> Save </Button>
                        {' '}
                        <Button className={classes.buttonModal} variant="contained" onClick={() => {
                            setOpenModal(false);
                        }}> Cancel </Button>
                    </form>
                )}
            </Formik>
        )
    };
    const data = users && React.useMemo(() => [...users.users]);
    return (
        <div className={ styles.container }>
            <div className={styles.header}>MANAGE USERS</div>
            <div className={styles.body}>
                <div className={styles.innerBody}>
                    { <Table columns={columns} data={data} />}
                </div>

            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={() => setOpenModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                disableScrollLock={ true }
            >
                <div className={classes.paper}>
                    <h2>Edit User: '{targetEmail}'</h2>
                    <br/>
                    { editUserInfoForm() }
                </div>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    users: state.authReducer.users,
    companies: state.companyReducer.companies,
    updatedCompany: state.authReducer.updatedCompany
});

const mapDispatchToProps = (dispatch) => ({
    getUsersAction: (action) => dispatch(getUsers(action)),
    getAllCompaniesAction: (action) => dispatch(getAllCompanies(action)),
    updateUserCompanyAction: (action) => dispatch(updateUserCompany(action)),
    updateUserRoleAction: (action) => dispatch(updateUserRole(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageUsers));