'use strict';

const db = require('./db/database');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const config = require('./config');

module.exports = function () {

    passport.use(new FacebookTokenStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            db.query(`SELECT * from APP_USER WHERE EMAIL= '${profile.emails[0].value}'`, (error, rows) => {
                let dataToReturn = {rows: rows, permissionType: 'regular'};

                if (rows.length !== 1) {
                    // New user. Insert new user in the db
                    db.query('INSERT INTO APP_USER (`EMAIL`, `USER_NAME`, `SUBSCRIBED`) VALUES (?, ?, false)', [profile.emails[0].value, profile.displayName], (error) => {
                        if (error) {
                            console.log('Inserting new user into the db failed');
                        } else {
                            console.log('Success!');
                        }
                    });
                    db.query('INSERT INTO USER_PERMISSIONS (`EMAIL`, `TYPE`) VALUES (?, `regular`)', [profile.emails[0].value], (error) => {
                        if (error) {
                            console.log('Inserting USER_PERMISSIONS into the db failed');
                        } else {
                            console.log('Success!');
                        }
                    });
                    return done(error, dataToReturn);
                } else {
                    // Existing User. Return user info
                    db.query('SELECT TYPE from USER_PERMISSIONS where EMAIL=?', [profile.emails[0].value], (error, rows) => {
                        if (error) {
                            console.log('error in query');
                        } else {
                            console.log('Successfully got USER_PERMISSIONS for FB Oauth!');
                            console.log(rows);
                            dataToReturn.permissionType = rows[0].TYPE;
                            return done(error, dataToReturn);
                        }
                    });
                }
            });
        }));

    passport.use(new GoogleTokenStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            db.query(`SELECT * from APP_USER WHERE EMAIL='${profile.emails[0].value}'`, (error, rows) => {
                let dataToReturn = {rows: rows, permissionType: 'regular'};

                if (rows.length !== 1) {
                    // New user. Insert new user in the db
                    db.query('INSERT INTO APP_USER (`EMAIL`, `USER_NAME`, `SUBSCRIBED`) VALUES (?, ?, false)', [profile.emails[0].value, profile.displayName], (error) => {
                        if (error) {
                            console.log('Inserting new user into the db failed');
                        } else {
                            console.log('Successfully inserted new user into the db!');
                        }
                    });
                    db.query(`INSERT INTO USER_PERMISSIONS VALUES ('${profile.emails[0].value}', 'regular')`, (error) => {
                        if (error) {
                            console.log('Inserting USER_PERMISSIONS into the db failed');
                        } else {
                            console.log('Successfully inserted USER_PERMISSIONS!');
                        }
                    });
                    db.query(`INSERT INTO USER_COMPANY VALUES ('${profile.emails[0].value}', 'N/A')`, (error) => {
                        if (error) {
                            console.log('Inserting USER_COMPANY into the db failed');
                        } else {
                            console.log('Successfully inserted USER_COMPANY!');
                        }
                    });
                    return done(error, dataToReturn);
                } else {
                    // Existing User. Return user info
                    db.query('SELECT TYPE from USER_PERMISSIONS where EMAIL=?', [profile.emails[0].value], (error, rows) => {
                        if (error) {
                            console.log('error in query');
                        } else {
                            console.log('Successfully got USER_PERMISSIONS!');
                            dataToReturn.permissionType = rows[0].TYPE;
                            return done(error, dataToReturn);
                        }
                    });
                }
            });
        }));
};
