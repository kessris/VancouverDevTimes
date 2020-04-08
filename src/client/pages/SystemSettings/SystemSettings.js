import React, { useEffect, useState } from 'react';
import styles from './SystemSettings.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import {getSchedulerSettings, getPermissionSettings, updateSystemSettings, setUpdateStatus} from "../../actions";
import {withRouter} from "react-router-dom";
import ErrorMessageModal from "../../components/ErrorMessageModal/ErrorMessageModal";
import {Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 40,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: '10%'
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SystemSettings({ getSchedulerSettingsAction, getPermissionSettingsAction, updateSystemSettingsAction, setUpdateStatusAction, schedulerSettings, permissionSettings, updateStatus}) {
    const [reviewFreq, setReviewFreq] = useState(0);
    const [emailFreq, setEmailFreq] = useState(0);
    const [rssFreq, setRssFreq] = useState(0);
    const [sysMan, setSysMan] = useState(0);
    const [admin, setAdmin] = useState(0);
    const [regUser, setRegUser] = useState(0);
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [approvedAlertOpen, setApprovedAlert] = React.useState(false);

    const classes = useStyles();

    useEffect(() => {
        if (schedulerSettings === undefined || schedulerSettings.length === 0) {
            getSchedulerSettingsAction();
        } else if (permissionSettings === undefined || permissionSettings.length === 0) {
            getPermissionSettingsAction();
        } else {
            setReviewFreq(schedulerSettings[0].FREQUENCY);
            setEmailFreq(schedulerSettings[2].FREQUENCY);
            setRssFreq(schedulerSettings[1].FREQUENCY);
            setSysMan(permissionSettings[2].THRESHOLD);
            setAdmin(permissionSettings[0].THRESHOLD);
            setRegUser(permissionSettings[1].THRESHOLD);
        }
        if (updateStatus === 'success') {
            setApprovedAlert(true);
            setUpdateStatusAction();
        }
    }, [schedulerSettings, permissionSettings]);

    const handleCloseApprovedAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setApprovedAlert(false);
    };

    const handleSave = () => {
        // Checking for valid inputs
        if (reviewFreq > 0 && emailFreq > 0 && rssFreq > 0 && sysMan > 0 && admin > 0 && regUser > 0) {
            let permission = [
                {permissionType: "admin", newThreshold: admin},
                {permissionType: "regular", newThreshold: regUser},
                {permissionType: "sysManager", newThreshold: sysMan}
            ];
            let scheduler = [
                {taskId: "approval-reminder", newFreq: reviewFreq, maxNum: 10},
                {taskId: "subscription-email", newFreq: emailFreq, maxNum: 10},
                {taskId: "RSS-retrieval", newFreq: rssFreq, maxNum: 10}
            ];
            updateSystemSettingsAction({permission: permission, scheduler: scheduler});
            getSchedulerSettingsAction();
            getPermissionSettingsAction();
        } else {
            setErrorMessageOpen(true);
        }
    };

    return (
      <div className={styles.root}>
          <div className={styles.header}>SYSTEM SETTINGS</div>
          <div className={styles.body}>
              {errorMessageOpen? <ErrorMessageModal errMessage={"Please enter valid input(s) for all fields. (input > 0)"} setErrorMessageOpen={setErrorMessageOpen}/>:''}
              <div className={styles.innerBody}>
                  <div className={styles.margins}>
                      <TextField
                          required
                          id="outlined-required"
                          type="number"
                          label="Review Reminder Frequency (days)"
                          value={reviewFreq}
                          variant="outlined"
                          onChange={e => {setReviewFreq(e.target.value)}}
                          style={{background: "white"}}
                      />{'  '}
                      <TextField
                          required
                          id="outlined-disabled"
                          type="number"
                          label="Subscription Email Frequency (days)"
                          value={emailFreq}
                          variant="outlined"
                          onChange={e => {setEmailFreq(e.target.value)}}
                          style={{background: "white"}}
                      />
                  </div>
                  <div className={styles.margins}>
                      <TextField
                          required
                          id="outlined-disabled"
                          type="number"
                          label="RSS Feed Check Frequency (days)"
                          value={rssFreq}
                          variant="outlined"
                          onChange={e => {setRssFreq(e.target.value)}}
                          style={{background: "white"}}
                      />{'  '}
                      <TextField
                          required
                          id="outlined-password-input"
                          label="System Manager Approval Threshold"
                          type="number"
                          value={sysMan}
                          variant="outlined"
                          onChange={e => {setSysMan(e.target.value)}}
                          style={{background: "white"}}
                      />
                  </div>
                  <div className={styles.margins}>
                      <TextField
                          required
                          id="outlined-read-only-input"
                          label="Admin Approval Threshold"
                          type="number"
                          value={admin}
                          variant="outlined"
                          onChange={e => {setAdmin(e.target.value)}}
                          style={{background: "white"}}
                      />{'  '}
                      <TextField
                          required
                          id="outlined-number"
                          label="Regular User Approval Threshold"
                          type="number"
                          value={regUser}
                          variant="outlined"
                          onChange={e => {setRegUser(e.target.value)}}
                          style={{background: "white"}}
                      />
                  </div>

                  <br/><br/>
                  <Button variant="contained" className={classes.button} onClick={() => {
                      handleSave();
                  }}> Save </Button>
                  <br/><br/>
                  <Snackbar open={approvedAlertOpen} autoHideDuration={4000} onClose={handleCloseApprovedAlert}>
                      <Alert onClose={handleCloseApprovedAlert} severity="success">
                          You have successfully updated the changes!
                      </Alert>
                  </Snackbar>
              </div>

          </div>

      </div>
    );
}

const mapStateToProps = (state) => ({
    schedulerSettings: state.systemReducer.schedulerSettings,
    permissionSettings: state.systemReducer.permissionSettings,
    updateStatus: state.systemReducer.updateStatus
});

const mapDispatchToProps = (dispatch) => ({
    getSchedulerSettingsAction: (action) => dispatch(getSchedulerSettings(action)),
    getPermissionSettingsAction: (action) => dispatch(getPermissionSettings(action)),
    updateSystemSettingsAction: (action) => dispatch(updateSystemSettings(action)),
    setUpdateStatusAction: (action) => dispatch(setUpdateStatus(action))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SystemSettings));
