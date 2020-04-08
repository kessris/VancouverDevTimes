
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const db = require('../db/database');

const jsonPath = path.resolve(path.join(__dirname, 'SMTPconfig.json'));
const config = fs.readFileSync(jsonPath);
const jsonContent = JSON.parse(config);


const transporter = nodemailer.createTransport({
  host: jsonContent.host,
  port: jsonContent.port,
  secure: jsonContent.secure,
  auth: {
    user: jsonContent.SmtpUsername,
    pass: jsonContent.SmtpPassword
  }
});

module.exports.WeeklyUpdatesEmail = () => {
  db.query('SELECT EMAIL FROM APP_USER WHERE SUBSCRIBED = TRUE', (error, usrs) => {
    if (error) {
      console.log(error);
      return error;
    }
    const tolist = [];
    usrs.forEach((user) => {
      tolist.push(user.EMAIL);
    });
    db.query('SELECT title, url FROM ContentResource WHERE approvalCount >= approvalThreshold and resourceType <> "RSS Feed" ORDER BY approvedTime DESC LIMIT 5', (err, rows) => {
      ejs.renderFile(path.resolve(path.join(__dirname, 'weeklyEmailTemplate.ejs')), { blogs: rows }, (ejserr, str) => {
        if (ejserr) {
          console.log(ejserr);
          return ejserr;
        }
        tolist.forEach((recipient) => {
          const mailOptions = {
            from: '<vantimes.info@gmail.com>',
            to: recipient,
            subject: 'Newsletter from Vancouver DEV Times',
            html: str,
          };
          transporter.sendMail(mailOptions, (transerror, info) => {
            if (transerror) {
              console.log(transerror);
              return transerror;
            }
            console.log(`weekly email sent: ${recipient}`);
            return 1;
          });
        });
        return 1;
      });
      return 1;
    });
  });
};

module.exports.ApprovalReminderEmail = () => {
  db.query('SELECT EMAIL FROM USER_PERMISSIONS WHERE TYPE <> "regular"', (error, usrs) => {
    if (error) {
      console.log(error);
      return error;
    }
    const tolist = [];
    usrs.forEach((user) => {
      tolist.push(user.EMAIL);
    });
    db.query('SELECT title FROM ContentResource WHERE approvalCount < approvalThreshold and resourceType <> "RSS Feed" ORDER BY submissionTime DESC LIMIT 5', (err, rows) => {
      ejs.renderFile(path.resolve(path.join(__dirname, 'approvalReminderTemplate.ejs')), { blogs: rows }, (ejserr, str) => {
        if (ejserr) {
          console.log(ejserr);
          return ejserr;
        }
        tolist.forEach((recipient) => {
          const mailOptions = {
            from: '<vantimes.info@gmail.com>',
            to: recipient,
            subject: 'Vancouver DEV Times Approval Reminder',
            html: str,
          };
          transporter.sendMail(mailOptions, (transerror, info) => {
            if (transerror) {
              console.log(transerror);
              return transerror;
            }
            console.log(`approval reminder sent: ${recipient}`);
            return 1;
          });
        });
        return 1;
      });
    });
    return 1;
  });
};

module.exports.dynamicemail = () => {
  db.query('SELECT title, url FROM ContentResource WHERE approvalCount >= approvalThreshold  and resourceType <> "RSS Feed" ORDER BY approvedTime DESC LIMIT 5', (err, rows) => {
    if (err) {
      throw err;
    }
    ejs.renderFile(path.resolve(path.join(__dirname, 'weeklyEmailTemplate.ejs')), { blogs: rows }, (ejserr, str) => {
      if (ejserr) {
        console.log(ejserr);
        throw ejserr;
      }
      const mailOptions = {
        from: '<vantimes.info@gmail.com>',
        to: 'txxxy94@gmail.com,testvan2020@outlook.com',
        subject: 'weekly subscribe email 6',
        html: str,
      };
      transporter.sendMail(mailOptions, (transerror, info) => {
        if (transerror) {
          throw transerror;
        } else {
          console.log('Message sent: %s', info.messageId);
        }
      });
    });
  });
};
