const nodeschedule = require('node-schedule');
const db = require('../db/database');
const email = require('../email/email');
const utils = require('../utils/resources.utils');

const jobs = {};
nodeschedule.Job.prototype.nextDates = function (count = 1) {
    const dates = [];

    if (!this.pendingInvocations().length) {
        return dates;
    }

    const rule = this.pendingInvocations()[0].recurrenceRule;

    if (rule.nextInvocationDate) {
        // Rule is a RecurrenceRule
        let date = new Date();
        for (let i = 0; i < count; i++) {
            date = rule.nextInvocationDate(date);
            dates.push(date.toString());
        }
    } else {
        // Rule is a CronExpression
        for (let i = 0; i < count; i++) {
            dates.push(rule.next().toString());
        }
    }

    return dates;
};

/*
 * after app start listening
 * start all scheduled jobs
 * respect to parameters in the database
 */
module.exports.start = function () {
    db.query('SELECT * FROM SCHEDULER', (error, rows) => {
        if (error) {
            console.log(`error in starting Scheduler: ${error}`);
            return error;
        }
        rows.forEach((row) => {
            console.log(row);
            jobs[row.ID] = nodeschedule.scheduleJob(`0 0 1-31/${row.FREQUENCY} * *`, () => {
                console.log(`scheduled job is: ${row.ID} with frequency ${row.FREQUENCY}`);
                if (row.ID === 'approval-reminder') {
                    email.ApprovalReminderEmail();
                } else if (row.ID === 'subscription-email') {
                    email.WeeklyUpdatesEmail();
                } else if (row.ID === 'RSS-retrieval') {
                    utils.pollAllRSS();
                } else if (row.ID === 'URL-verification') {
                    utils.verifyUrls();
                }
            });
        });
        // jobs['approval-reminder']
        //     .nextDates(5)
        //     .forEach(x => console.log("approval-reminder:  "+ x));
        // jobs['subscription-email']
        //     .nextDates(5)
        //     .forEach(x => console.log("subscription-email:  "+x));
        // jobs['RSS-retrieval']
        //     .nextDates(5)
        //     .forEach(x => console.log("RSS-retrieval:  "+x));
        console.log("upcoming approval-reminder:  "+ jobs['approval-reminder'].nextInvocation());
        console.log("upcoming subscription-email:  "+ jobs['subscription-email'].nextInvocation());
        console.log("upcoming RSS-retrieval:  "+ jobs['RSS-retrieval'].nextInvocation());
        console.log('Success Start Scheduler!');
        return 1;
    });
};

/*
 * change the frequencies of scheduled jobs
 * tasks: [{taskId, newFreq, maxNum}]
 */
module.exports.changeScheduledJob = (tasks) => {
    console.log(tasks);
    tasks.forEach((task) => {
        const job = jobs[task.taskId];
        job.cancel();
        jobs[task.taskId] = nodeschedule.scheduleJob(`0 0 1-31/${task.newFreq} * *`, () => {
            console.log(`scheduled jobs: ${task.taskId} every ${task.newFreq} days`);
            if (task.taskId === 'approval-reminder') {
                email.ApprovalReminderEmail();
            } else if (task.taskId === 'subscription-email') {
                email.WeeklyUpdatesEmail();
            } else if (task.taskId === 'RSS-retrieval') {
                utils.pollAllRSS();
            } else if (task.taskId === 'URL-verification') {
                utils.verifyUrls();
            }
        });
    });
    console.log("upcoming new approval-reminder:  "+ jobs['approval-reminder'].nextInvocation());
    console.log("upcoming new subscription-email:  "+ jobs['subscription-email'].nextInvocation());
    console.log("upcoming new RSS-retrieval:  "+ jobs['RSS-retrieval'].nextInvocation());
};


module.exports.changeScheduledJobsTest = () => {
    const rule = new nodeschedule.RecurrenceRule();
    rule.second = 5;
    const j = nodeschedule.scheduleJob(rule, () => {
        email.dynamicemail();
        console.log('running a task every minute');
        j.cancel();
    });
};
