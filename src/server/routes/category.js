/* eslint-disable import/newline-after-import */

const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { verifyToken } = require('../middleware/index');

router.get('/api/categories', (req, res) => {
  db.query('SELECT * from Category', (error, rows) => {
    if (error) {
      console.log('error in query');
      res.status(500).send(error);
    } else {
      console.log('Success!');
      res.status(200).send({ allCategories: rows.map(item => item.categoryName) });
    }
  });
});

router.post('/api/categories', verifyToken, (req, res) => {
  jwt.verify(req.token, 'my-secret', (err, authData) => {
    if (err) {
      console.log('request is not authenticated with JWT token.');
      console.log(err);
      res.status(401).send(err);
    } else {
  const { categoryName } = req.body;
  db.query('INSERT INTO Category (`categoryName`) VALUES (?)', [categoryName], (error, rows) => {
    if (error) {
      console.log('error in query');
      res.status(500).send(error);
    } else {
      console.log('Successfully added a category!');
      res.status(200).send(req.body);
    }
  });
    }
  });
});

/*
 * Re-categorize all resources with target category to Uncategorized,
 * and delete target category
 */
router.delete('/api/categories', (req, res) => {
  const { categoryName } = req.body;

  const query = 'UPDATE ContentResource SET categoryName = \'Uncategorized\' WHERE categoryName IN (?)';
  const data = [categoryName];

  db.query(query, data, (error) => {
    if (error) {
      console.log('error in re-categorize query');
      console.log(error);
      res.status(500).send(error);
    } else {
      db.query('DELETE FROM Category WHERE categoryName IN (?)', [categoryName], (err) => {
        if (err) {
          console.log('error in delete query');
          res.status(500).send(err);
        } else {
          console.log('Success!');
            res.status(200).send(req.body);
        }
      });
    }
  });
});

module.exports = router;
