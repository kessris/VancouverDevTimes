/* eslint-disable import/newline-after-import */

const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { verifyToken } = require('../middleware/index');

/*
 * sys man: view all users
 */
router.get('/api/users', (req, res) => {
    const query = `SELECT APP_USER.USER_NAME, APP_USER.EMAIL, USER_PERMISSIONS.TYPE,
                   USER_COMPANY.companyName, APP_USER.SUBSCRIBED
                   FROM APP_USER
                   LEFT JOIN USER_COMPANY ON APP_USER.EMAIL=USER_COMPANY.EMAIL
                   LEFT JOIN USER_PERMISSIONS on APP_USER.EMAIL=USER_PERMISSIONS.EMAIL`;

    db.query(query, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully showed all users!');
            res.status(200).send({ users: rows });
        }
    });
});

/*
 * sys man: update user role
 */
router.put('/api/user/permissions', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const { email, newRole } = req.body;
            const query = 'UPDATE USER_PERMISSIONS SET TYPE = ? WHERE EMAIL = ?';
            const data = [newRole, email];
            db.query(query, data, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log('Successfully updated user role!');
                    res.status(200).send(req.body);
                }
            });
        }
    });
});

/*
 * sys man: show user account info
 */
router.get('/api/user', (req, res) => {
    const { email } = req.body;

    const query = `SELECT APP_USER.USER_NAME, APP_USER.EMAIL, USER_PERMISSIONS.TYPE,
                 USER_COMPANY.companyName, APP_USER.SUBSCRIBED
                 FROM APP_USER
                 LEFT JOIN USER_COMPANY ON APP_USER.EMAIL=USER_COMPANY.EMAIL
                 LEFT JOIN USER_PERMISSIONS on APP_USER.EMAIL=USER_PERMISSIONS.EMAIL
                 WHERE APP_USER.EMAIL = ?`;
    const data = [email];

    db.query(query, data, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully retrieved user info!');
            res.status(200).send(rows[0]);
        }
    });
});

router.put('/api/user/company/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const { email, newComp } = req.body;
            // prepare query
            const sql = 'UPDATE USER_COMPANY SET companyName = ? WHERE EMAIL = ?';
            const data = [newComp, email];
            db.query(sql, data, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log('Successfully updated user company!');
                    res.status(200).send(req.body);
                }
            });
        }
    });
});

/**
 * payload: {email, isSubscribed}
 */
router.put('/api/user/subscription', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const { email, isSubscribed } = req.body;
            // prepare query
            const sql = 'UPDATE APP_USER SET SUBSCRIBED = ? WHERE EMAIL = ?';
            const data = [isSubscribed, email];
            db.query(sql, data, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log('Successfully update subscription status!');
                    res.status(200).send(req.body);
                }
            });
        }
    });
});

/*
 * sys man: show all company
 */
router.get('/api/companies', (req, res) => {
    const query = 'SELECT * from Company';
    db.query(query, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully showed all companies!');
            res.status(200).send({ allCompanies: rows.map(item => item.companyName) });
        }
    });
});

/*
 * sys man: add a company
 */
router.post('/api/company', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const { companyName } = req.body;
            const query = 'INSERT INTO Company (`companyName`) VALUES (?)';
            const data = [companyName];
            db.query(query, data, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log('Successfully add a new company!');
                    res.status(200).send(req.body);
                }
            });
        }
    });
});

/*
 * sys man: delete a company
 */
router.delete('/api/company', (req, res) => {
    const { companyName } = req.body;
    const compQuery = 'DELETE FROM Company WHERE companyName IN (?)';
    const userCompQuery = 'UPDATE USER_COMPANY SET companyName = \'N/A\' WHERE companyName IN (?);';

    db.query(userCompQuery + compQuery, [companyName, companyName], (error) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully delete a company!');
            res.status(200).send(req.body);
        }
    });
});

module.exports = router;
