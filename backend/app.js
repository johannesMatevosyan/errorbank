const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Post = require('./models/post');
const app = express();
const MONGODB_URI = 'mongodb://localhost:27017/error-bank';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});


// Routing files
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

app.use("/posts", postRoutes);
app.use("/user", authRoutes);


mongoose.connect(
  MONGODB_URI
)
  .then(result => {
    console.log("Connected to DB");
  })
  .catch(err => {
    console.log('Connection failed! ', err);
  });

module.exports = app;

