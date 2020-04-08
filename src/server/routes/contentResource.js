/* eslint-disable import/newline-after-import */

const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const validUrl = require('valid-url');
const db = require('../db/database');
const utils = require('../utils/resources.utils');
const { verifyToken } = require('../middleware/index');


/** Get all resources */

router.get('/api/resources', (req, res) => {
    db.query('SELECT * from ContentResource', (error, rows) => {
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({ allLinks: rows });
        }
    });
});
/** End of Get all */

/** Filtering */
//  All pending articles left joined with approvers
router.get('/api/resources/pending', (req, res) => {
    // need to count number of entries

    const query = `SELECT c.resourceType, c.categoryName, c.url, c.title, c.approvalCount, c.approvalThreshold,                
                GROUP_CONCAT(a.EMAIL) as approvers FROM ContentResource c
                 LEFT JOIN USER_APPROVALS a on c.url = a.url
                 WHERE c.approvalCount < c.approvalThreshold
                 GROUP BY c.url
                 ORDER by c.submissionTime ASC`;
    db.query(query, (error, rows) => {
        console.log(query);
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            // each article: { "link": XXX, "title": XXX }
            res.status(200).send({ allLinks: rows });
        }
    });
});

// Get all content approved by users\
router.get('/api/resources/approved/user', (req, res) => {
    const query = `SELECT c.resourceType, c.categoryName, c.url, c.title, c.approvalCount, c.approvalThreshold,
                 c.approvedTime, GROUP_CONCAT(a.EMAIL) as approvers FROM ContentResource c
                 JOIN USER_APPROVALS a on c.url = a.url
                 GROUP BY c.url
                 ORDER BY c.approvedTime DESC`;
    db.query(query, (error, rows) => {
        console.log(query);
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({ allLinks: rows });
        }
    });
});

// Count number of resources pending approval for user
router.get('/api/resources/count', (req, res) => {
    const query = `SELECT COUNT(*) as count FROM ContentResource c
                WHERE c.approvalCount < c.approvalThreshold
                AND NOT EXISTS (SELECT * from USER_APPROVALS a
                WHERE a.url=c.url AND a.EMAIL=?)`;
    db.query(query, [req.query.user], (error, rows) => {
        console.log(query);
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({ count: rows[0].count });
        }
    });
});

// return all approved content resources, in descending submissionTime order
router.get('/api/resources/approved', (req, res) => {
    const query = `SELECT * from ContentResource
                   WHERE ContentResource.approvalCount >= ContentResource.approvalThreshold
                   ORDER by ContentResource.submissionTime DESC`;
    db.query(query, (error, rows) => {
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            // each row has all columns in ContentResource
            res.status(200).send({ allApproved: rows });
        }
    });
});

// return maxNum of approved content resources from each category,
// in descending submissionTime order, which are to be rendered on main page
router.get('/api/resources/approvedByCategory/:maxNum', (req, res) => {
    const query = `SELECT url, title, categoryName AS category FROM ContentResource
                   WHERE ContentResource.approvalCount >= ContentResource.approvalThreshold
                   AND ContentResource.resourceType = 'Blog Post'
                   ORDER by ContentResource.submissionTime DESC`;

    db.query(query, (error, rows) => {
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            const approvedResourcesByCategory = [];
            // unique category array
            const categories = Array.from(new Set(rows.map(item => item.category)));
            categories.forEach((cat) => {
                const sameCatRows = rows.filter(item => item.category === cat);
                const resultsRowsObj = {
                    category: cat,
                    articles: sameCatRows.map(
                        // shorthand for getting subset of object properties
                        item => (({ url, title, category }) => ({
                            url,
                            title,
                            category
                        }))(item)
                    )
                        .slice(0, req.params.maxNum)
                };
                approvedResourcesByCategory.push(resultsRowsObj);
            });
            res.status(200).send({ allApprovedByCategory: approvedResourcesByCategory });
        }
    });
});

// get all approved resources with target category
router.get('/api/resource/approved/:category', (req, res) => {
    const query = `SELECT * FROM ContentResource
                   WHERE ContentResource.approvalCount >= ContentResource.approvalThreshold
                   AND ContentResource.resourceType = 'Blog Post'
                   AND ContentResource.categoryName = ?
                   ORDER by ContentResource.submissionTime DESC`;
    db.query(query, [req.params.category], (error, rows) => {
        if (error) {
            console.log('error in query');
        } else {
            console.log('Success!');
        }
        res.send({
            data: rows
        });
    });
});

// get all resources with target category
router.get('/api/resource/:category', (req, res) => {
    db.query('SELECT * from ContentResource where categoryName=?', [req.params.category], (error, rows) => {
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({
                data: rows.map(item => ({
                    url: item.url,
                    title: item.title,
                    categoryName: item.categoryName
                }))
            });
        }
    });
});

// get post with target title
router.get('/api/post/:title', (req, res) => {
    db.query('SELECT * from ContentResource where title=?', [req.params.title], (error, rows) => {
        if (error) {
            console.log('error in query');
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({ data: rows.map(item => item.url) });
        }
    });
});

// get resources matching target title and target category
router.get('/api/resources/search', (req, res) => {
    const { titleString, category } = req.query;
    let query;

    if (category === 'All') {
        query = 'SELECT * FROM ContentResource WHERE title REGEXP (?)';
    } else {
        query = 'SELECT * FROM ContentResource WHERE title REGEXP (?) AND categoryName = ?';
    }
    db.query(query, [titleString, category], (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Success!');
            res.status(200).send({ allMatchedResources: rows });
        }
    });
});
/** End of Filtering */


/** Submission */
// submit new post with given URL, current time, given title, and categoryName
router.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401).send('unauthorized operation');
        } else {
            const { title, category, permissionType } = req.body;

            // url httpsify and validation
            const url = utils.httpsify(req.body.url);
            let errorMsg;
            console.log(url);
            if (!validUrl.isHttpsUri(url)) {
                errorMsg = 'URL entered is invalid.';
                console.log(errorMsg);
                res.status(400).send({
                    errorCode: 400,
                    message: errorMsg
                });
            } else {
                utils.isLive(url, () => {
                    const resourceType = 'Blog Post';
                    const thresholdQuery = 'SELECT THRESHOLD FROM PERMISSION WHERE PERMISSION.TYPE = ?';
                    const postQuery = 'INSERT INTO ContentResource (`resourceType`, `approvalThreshold`, `url`, `submissionTime`, '
                        + '`approvedTime`, `approvalCount`, `title`,`categoryName`) VALUES (?, ?, ?, ?, NULL, 0, ?, ?)';

                    db.query(thresholdQuery, [permissionType], (error, thresholdRow) => {
                        if (error) {
                            console.log(`err is${error}`);
                            res.status(500).send(error.message);
                        } else {
                            const submissionTime = new Date();
                            const approvalThreshold = thresholdRow[0].THRESHOLD;
                            const postData = [resourceType, approvalThreshold, url, submissionTime, title, category];
                            db.query(postQuery, postData, (err2) => {
                                if (err2) {
                                    console.log(err2);
                                    res.status(500).send(err2);
                                } else {
                                    console.log('Successfully inserted!');
                                    res.status(200).send({
                                        resourceType,
                                        approvalThreshold,
                                        url,
                                        submissionTime,
                                        approvedTime: null,
                                        approvalCount: 0,
                                        title,
                                        categoryName: category
                                    });
                                }
                            });
                        }
                    });
                }, () => {
                    errorMsg = 'URL entered is not live.';
                    console.log(errorMsg);
                    res.status(400).send({
                        errorCode: 400,
                        message: errorMsg
                    });
                });
            }
        }
    });
});

// submit an RSS feed url for review
router.post('/api/rss', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401)
                .send('unauthorized operation');
        } else {
            const {permissionType} = req.body;
            const resourceType = 'RSS Feed';
            const thresholdQuery = 'SELECT THRESHOLD FROM PERMISSION WHERE PERMISSION.TYPE = ?';
            const postQuery = 'INSERT INTO ContentResource (`resourceType`, `approvalThreshold`, `url`, `submissionTime`, '
                + '`approvedTime`, `approvalCount`, `title`,`categoryName`) VALUES (?, ?, ?, ?, NULL, 0, NULL, NULL)';

            // url httpsify and validation
            const url = utils.httpsify(req.body.url);
            utils.isLive(url, () => {
                // validate rss url, submit if valid
                utils.fetchFeed(url, (error) => {
                    if (error) {
                        res.status(500)
                            .send(error);
                    } else {
                        db.query(thresholdQuery, [permissionType], (error1, thresholdRow) => {
                            if (error1) {
                                console.log(error1);
                                res.status(500)
                                    .send(error1);
                            } else {
                                const submissionTime = new Date();
                                const approvalThreshold = thresholdRow[0].THRESHOLD;
                                const postData = [resourceType, approvalThreshold, url, submissionTime];
                                db.query(postQuery, postData, (error2) => {
                                    if (error2) {
                                        console.log(error2);
                                        res.status(500)
                                            .send(error2);
                                    } else {
                                        console.log('Successfully inserted RSS Feed!');
                                        res.status(200)
                                            .send({
                                                resourceType,
                                                approvalThreshold,
                                                url,
                                                submissionTime,
                                                approvedTime: null,
                                                approvalCount: 0,
                                                title: null,
                                                categoryName: null
                                            });
                                    }
                                });
                            }
                        });
                    }
                });
            }, () => {
                const errorMsg = 'URL entered is not live.';
                console.log(errorMsg);
                res.status(400)
                    .send({
                        errorCode: 400,
                        message: errorMsg
                    });
            });
        }
    });
});
/** End of Submission */


/** Approval */
// callback: approve a post or RSS feed submission
const approveCB = (req, res, next) => {
    const { user, url } = req.body;
    const newApprovalQuery = 'INSERT INTO USER_APPROVALS (`EMAIL`, `url`) VALUES (?, ?)';
    const updateQuery = 'UPDATE ContentResource SET approvalCount = approvalCount + 1, approvedTime = ? WHERE url = ?';

    db.query(newApprovalQuery, [user, url], (error) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`User ${user} has already approved ${url}. Stop.`);
            }
            res.status(500).send(error);
        } else {
            // increment approval count + insert into approvals table
            db.query(updateQuery, [new Date(), url], (error) => {
                if (error) {
                    res.status(500)
                        .send(error);
                } else {
                    console.log('Successfully approved submission!');
                    next();
                }
            });
        }
    });
};

// poll rss url for num of articles
function pollCB(req, res) {
    // NOTE: this is the permissionType of original submitter of url
    const { url, permissionType } = req.body;
    utils.isLive(url, () => {
        utils.pollRSS(url, permissionType, (feedItems, num) => {
            const response = {
                resources: feedItems.slice(0, num)
                    .map(item => ({
                        url: item.link,
                        title: item.title,
                        category: 'RSS Blog Post'
                    }))
            };
            // send response
            res.status(200).send(response);
        });
    }, () => {
        const errorMsg = 'Feed to poll is not live anymore.';
        console.log(errorMsg);
        res.status(400)
            .send({
                errorCode: 400,
                message: errorMsg
            });
    });
}

// callback: call pollCB on the RSS url if approval count >= threshold
const checkRSSApprovalCB = (req, res) => {
    const { url } = req.body;
    const query = `SELECT approvalCount, approvalThreshold FROM ContentResource
                   WHERE ContentResource.url = ?`;
    db.query(query, [url], (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else if (rows[0].approvalCount >= rows[0].approvalThreshold) {
            pollCB(req, res);
        } else {
            res.status(200).send(req.body);
        }
    });
};

// approve a post submission
router.post('/api/approvals', approveCB, (req, res) => {
    // router.post('/api/approvals', verifyToken, (req, res) => {
    // jwt.verify(req.headers.authorization, 'my-secret', (err, authData) => {
    //   if (err) {
    //     console.log('request is not authenticated with JWT token.');
    //   } else {

    //   }
    // });
    res.status(200).send(req.body);
});

// approve a RSS feed submission
router.post('/api/approvals/rss', approveCB, checkRSSApprovalCB);

// poll latest articles in a rss feed, and submit them
router.get('/api/rss/', pollCB);
/** End of Approval */


/** Deletion */
// delete a content resource with target url
router.delete('/api/resources', (req, res) => {
    const { url } = req.body;
    console.log(url);
    db.query('DELETE FROM ContentResource WHERE url=?', [url], (error) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully deleted!');
            res.status(200).send(req.body);
        }
    });
});
/** End of Deletion */


/** Re-categorize */
router.put('/api/resource', verifyToken, (req, res) => {
    jwt.verify(req.token, 'my-secret', (err, authData) => {
        if (err) {
            console.log('request is not authenticated with JWT token.');
            res.status(401)
                .send('unauthorized operation');
        } else {
            const {url, categoryName} = req.body;

            const query = 'UPDATE ContentResource SET categoryName = ? WHERE url = ?';
            const data = [categoryName, url];

            db.query(query, data, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    console.log('Successfully re-categorized resource!');
                    res.status(200).send(req.body);
                }
            });
        }
    });
});
/** End of Re-categorize */

/* site rss feed */
router.get('/api/feed', (req, res) => {

    const postNum = 20;
    const query = `SELECT * from ContentResource c
                   WHERE c.approvalCount >= c.approvalThreshold
                   AND c.resourceType = 'Blog Post'
                   ORDER by c.approvedTime DESC`;
    db.query(query, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Successfully retrieved posts for feed!');
            const feeds = rows.slice(0, postNum);
            res.setHeader('content-type', 'text/xml');
            res.render('feed', {
                posts: feeds,
                date: new Date(feeds[0].approvedTime).toUTCString(),
                url: 'http://vandevtimes-dev.us-west-2.elasticbeanstalk.com'
            });
        }
    });
});

module.exports = router;
