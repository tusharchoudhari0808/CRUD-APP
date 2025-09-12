const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./routes/RouteUsers.js');

const app = express();
const port = process.env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoute);

// Server start
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
