

const express = require('express');
const db = require('../db/database');

const router = express.Router({ mergeParams: true });
const scheduledJobs = require('./scheduledJobs');
const email = require('../email/email');
const rsspoller = require('../utils/resources.utils');

const rootdir = `${__dirname.split('server')[0]}client/assets/`;

// for testing Email.js
router.post('/api/EmailTest', (req, res) => {
  // const { emailaddr } = req.body;
  email.dynamicemail();
  res.sendStatus(200);
  // email.sendWeeklyUpdatesTest(emailaddr).then(() => {
  //   res.send();
  // }).catch((err) => {
  //   console.log(err);
  //   res.send(err);
  // });
});

router.get('/api/ScheduleTest', (req, res) => {
  // const { emailaddr, sec} = req.body;
  // console.log(emailaddr);
  rsspoller.pollAllRSS();
  // scheduledJobs.changeScheduledJobsTest();
  res.send();
});


module.exports = router;
