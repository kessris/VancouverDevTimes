const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

// routes
const contentResourceRoutes = require('./src/server/routes/contentResource');
const categoryRoutes = require('./src/server/routes/category');
const userRoutes = require('./src/server/routes/user');
const settingsRoutes = require('./src/server/routes/settings');
const oauth = require('./src/server/routes/oauth');

const cors = require('cors');
const scheduleRoutes = require('./src/server/routes/schedule');
const scheduledJobs = require('./src/server/routes/scheduledJobs');

const app = express();

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(contentResourceRoutes);
app.use(categoryRoutes);
app.use(userRoutes);
app.use(settingsRoutes);
app.use(scheduleRoutes);
app.set('views', './views');
app.set('view engine', 'pug');

app.use('/api/v1/', oauth);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${process.env.PORT || 4000}!`);
  scheduledJobs.start();
});

module.exports = app;
