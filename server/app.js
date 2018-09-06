require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hacktivgit', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect to mongodb success!')
});

const indexRoute = require('./routes/indexRoute');

app.use('/', indexRoute);

app.listen(3000, () => {
  console.log('listening on port 3000!')
})