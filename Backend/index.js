const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userDB = require('./config/db.js');
const userRoute = require('./Routes/RouteUsers.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Connect to PostgreSQL
userDB.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
});

// Routes
app.use('/api/users', userRoute);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
