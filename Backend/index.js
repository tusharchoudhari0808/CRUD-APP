const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const userDB = require('./DB/db.js');
const userRoute = require('./Route/user.js');
const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
userDB.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
  }
})

app.use('/user', userRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


