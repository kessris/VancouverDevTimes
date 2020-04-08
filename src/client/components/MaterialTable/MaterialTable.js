
import {makeStyles} from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { Button, Link, Select, Input, Typography } from '@material-ui/core';
import { Dialog, DialogContent, DialogActions, DialogContentText, Snackbar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles(theme => ({
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


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditableTable = ({
    pendingData,
    approvedData,
    user,
    approveBlog,
    approveRss,
    deleteSubmission,
    categories,
    setResourceCategory
  }) => {
  const [confirmDialogOpen, setConfirmDialog] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialog] = React.useState(false);
  const [approvedAlertOpen, setApprovedAlert] = React.useState(false);
  const [deletedAlertOpen, setDeletedAlert] = React.useState(false);
  const [useApprovalHistoryView, setApprovalHistoryView] = React.useState(false);
  let keyVal = 0; //ignore
  const [state, setState] = React.useState({
    columns: [],
    pending: {}
  });

  const classes = useStyles();

  useEffect(() => {
      setState({
              columns: [
                  { title: 'Type', field: 'resourceType'},
                  { title: 'Category', field: 'categoryName', render: rowData => 
                          useApprovalHistoryView ?
                          (<div><span>{rowData.categoryName}</span></div>) :
                          (<div>
                            <Select
                                native
                                value={rowData.categoryName}
                                key={keyVal++}
                                id={rowData.url}
                                onChange={(event) => {handleChangeCategory(event);}}
                            >
                                <option value={rowData.categoryName}>{rowData.categoryName}</option>
                                {categories && categories.map(item => item == rowData.categoryName ? '' : <option value={item} key={keyVal++}>{item}</option>) }
                            </Select>
                          </div>)},
                  { title: 'Resource', field: 'resource', render: rowData =>
                          <div>
                              {rowData.title ? (<div><span>{rowData.title}</span><br/></div>) : (<span/>)}
                              <Link href={rowData.url} target="_blank">{rowData.url}</Link>
                          </div>
                  },
                  { title: 'Approvers', field: 'approvers', render: rowData => <div>{rowData.approvers.map(item => <div><span key={keyVal++}>{item}</span><br/></div>)}</div>},
                  { title: 'Approvals', field: 'approvals', render: rowData => <div><span> {rowData.approvalCount} </span><span>/ {rowData.approvalThreshold}</span></div>}
              ],
              pending: {}
          })
  }, [categories, useApprovalHistoryView]);

  const handleCloseApprovedAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setApprovedAlert(false);
  }

  const handleCloseDeletedAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeletedAlert(false);
  }

  const handleChangeCategory = (event) => {
    setResourceCategory({url: event.target.id, categoryName: event.target.value});
  };

  const handleConfirmDialogOpen = (event, rowData) => {
    setConfirmDialog(true);
    setState(prevState => {
      let pending = prevState.pending;
      pending = {user: user, url: rowData.url, resourceType: rowData.resourceType};
      return { ...prevState, pending};
    });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog(false);
  };

  const handlePressApprove = () => {
    setConfirmDialog(false);
    if(state.pending.resourceType == "RSS Feed") {
      let payload = {user: state.pending.user.EMAIL, url: state.pending.url, permissionType: state.pending.user.permissionType};
      approveRss(payload);
    } else {
      let payload = {user: state.pending.user.EMAIL, url: state.pending.url};
      approveBlog(payload);
    }

    // SnackBar shows here after approval
    setApprovedAlert(true);
    setState(prevState => {
      let pending = prevState.pending;
      pending = {};
      return { ...prevState, pending};
    });
  };

  const handleDeleteDialogOpen = (event, rowData) => {
    setDeleteDialog(true);
    setState(prevState => {
      let pending = prevState.pending;
      pending = {url: rowData.url};
      return { ...prevState, pending};
    });
  };

  const handlePressDelete = () => {
    setDeleteDialog(false);
    deleteSubmission(state.pending);
    setDeletedAlert(true);
    setState(prevState => {
      let pending = prevState.pending;
      pending = {};
      return { ...prevState, pending};
    });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleToggleView = (event, newView) => {
    setApprovalHistoryView(newView);
  };

  return (
    <Paper>
      <MaterialTable
        title={
          <div>
            <ToggleButtonGroup value={useApprovalHistoryView} exclusive onChange={handleToggleView} aria-label="device">
              <ToggleButton key={1} value={false} aria-label="laptop">
                <Typography style={{fontSize: '0.8rem'}}>Review Pending Submission</Typography>
              </ToggleButton>
              <ToggleButton key={2} value={true} aria-label="phone">
                <Typography style={{fontSize: '0.8rem'}}>View Approval History</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        }
        columns={state.columns}
        data={useApprovalHistoryView ? approvedData : pendingData}
        actions={useApprovalHistoryView ? [] : 
        [       
          {
            icon: 'check_circle_outline',
            tooltip: 'Approve Submission',
            onClick: (event, rowData) => {handleConfirmDialogOpen(event, rowData);}
          },
          rowData => ({
            icon: 'delete',
            tooltip: 'Delete Submission',
            onClick: (event, rowData) => {handleDeleteDialogOpen(event, rowData);}
          })
        ]}
        options={useApprovalHistoryView ? {} : {
          actionsColumnIndex: -1
        }}
     />
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableScrollLock={ true }
      >
      <DialogContent style={{ margin: 20 }}>
          <DialogContentText id="alert-dialog-description">
              Are you sure you want to approve?
          </DialogContentText>
              <Button variant="contained" className={classes.button} onClick={handlePressApprove} autoFocus>
                  Yes
              </Button>{' '}
              <Button variant="contained" className={classes.button} onClick={handleConfirmDialogClose} autoFocus>
                  No
              </Button>
      </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableScrollLock={ true }
      >
      <DialogContent style={{ margin: 20 }}>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete?
            </DialogContentText>
              <Button variant="contained" className={classes.button} onClick={handlePressDelete} autoFocus>
                  Yes
              </Button>{' '}
              <Button variant="contained" className={classes.button} onClick={handleDeleteDialogClose} autoFocus>
                  No
              </Button>
          <br/>
      </DialogContent>
      </Dialog>
      <Snackbar open={approvedAlertOpen} autoHideDuration={4000} onClose={handleCloseApprovedAlert}>
        <Alert onClose={handleCloseApprovedAlert} severity="success">
          You have successfully approved the content!
        </Alert>
      </Snackbar>

      <Snackbar open={deletedAlertOpen} autoHideDuration={4000} onClose={handleCloseDeletedAlert}>
        <Alert onClose={handleCloseDeletedAlert} severity="success">
          You have successfully deleted the content!
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default EditableTable;
