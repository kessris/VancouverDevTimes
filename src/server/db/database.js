const mysql = require('mysql');
const os = require('os');
const platform = os.platform();
let db;

// Following only used locally with Docker: Windows
if (platform === 'win32') {
  db = mysql.createConnection({
    host: '192.168.99.100',
    database: 'vanDevTimesDB',
    user: 'root',
    password: 'supersecret',
    connectionLimit: 15,
    multipleStatements: true
  });
} else if (platform === 'darwin') {
  // Following only used locally with Docker: Mac
  db = mysql.createConnection({
    host: 'localhost',
    database: 'vanDevTimesDB',
    user: 'root',
    password: 'supersecret',
    connectionLimit: 15,
    multipleStatements: true
  });
}

// db = mysql.createConnection({
//   host: 'aa1t8lwjs2gks72.c9xdh5kk6anq.us-west-2.rds.amazonaws.com',
//   user: 'admin',
//   database: 'vanDevTimesDB',
//   password: 'admin123',
//   port: 3306,
//   multipleStatements: true
// });

// db = mysql.createConnection({
//   host: process.env.RDS_HOSTNAME,
//   user: process.env.RDS_USERNAME,
//   password: process.env.RDS_PASSWORD,
//   database: 'vanDevTimesDB',
//   port: process.env.RDS_PORT
// });


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});


module.exports = db;
