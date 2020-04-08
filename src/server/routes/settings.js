/* eslint-disable import/newline-after-import */

const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { verifyToken } = require('../middleware/index');
const scheduledJobs = require('./scheduledJobs');

const rootdir = `${__dirname.split('server')[0]}client/assets/`;
/*
 *  taskId: approval-reminder/subscription-email/RSS-retrieval
 */

/*
 * sys man: get scheduler settings
 */
router.get('/api/scheduler', (req, res) => {
    const query = 'SELECT * FROM SCHEDULER';
    db.query(query, (error, rows) => {
        if (error) {
            console.log(`db error is ${error}`);
            res.status(500).send(error);
        } else {
            console.log('Successfully retrieved scheduler settings!');
            res.status(200).send({ scheduler: rows });
        }
    });
});

/*
 * sys man: get permissions
 */
router.get('/api/permission', (req, res) => {
    const query = 'SELECT * FROM PERMISSION';
    db.query(query, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully retrieved permission settings!');
            res.status(200).send({ permission: rows });
        }
    });
});

/*
 * sys man: configure frequency for subscribed email, approval reminder, and RSS feed retrieval
 * sys man: configure max number of retrieved articles from a RSS feed
 * sys man: configure approval threshold for regular user or admin user
 */
router.put('/api/updateSettings', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const {
                permission, scheduler
            } = req.body;
            let query = '';
            const data = [];
            db.query('SELECT * FROM SCHEDULER', (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    if (permission) {
                        permission.forEach((p) => {
                            query += 'UPDATE PERMISSION SET THRESHOLD = ? WHERE TYPE = ?;';
                            data.push(p.newThreshold);
                            data.push(p.permissionType);
                        });
                    }
                    const oldScheduler = {};
                    const newScheduler = [];
                    rows.forEach((r) => {
                        oldScheduler[r.ID] = r.FREQUENCY;
                    });
                    if (scheduler) {
                        scheduler.forEach((s) => {
                            if (s.newFreq !== oldScheduler[s.taskId]) {
                                query += 'UPDATE SCHEDULER SET FREQUENCY = ?, MAX_NUM = ? WHERE ID = ?;';
                                data.push(s.newFreq);
                                data.push(s.maxNum);
                                data.push(s.taskId);
                                newScheduler.push(s);
                            }
                        });
                    }
                    db.query(query, data, (error) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send(error);
                        } else {
                            if (Object.keys(newScheduler).length) {
                                console.log(newScheduler);
                                scheduledJobs.changeScheduledJob(newScheduler);
                                console.log('Successfully updated target task!');
                            }
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});

/*
 * host logo image for email use
 */
router.get('/api/logoImg', (req, res) => {
    res.sendFile(`${rootdir}logo.png`);
});

/*
 * host login image for email use
 */
router.get('/api/backImg', (req, res) => {
    res.sendFile(`${rootdir}login.jpg`);
});

module.exports = router;
