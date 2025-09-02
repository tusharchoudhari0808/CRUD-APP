const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userDB = require('./Config/db.js');
const userRoute = require('./Routes/RouteUsers.js');

const app = express();
const port = process.env.Port;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/api/users', userRoute);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
