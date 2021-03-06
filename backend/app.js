const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
// const MONGODB_URI = 'mongodb://localhost:27017/error-bank';
const MONGODB_URI = "mongodb+srv://johannes:arsenalMongo@cluster0-lbtls.mongodb.net/test?retryWrites=true&w=majority";


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

// Routing files
const postRoutes = require('./routes/post');
const postInfoRoutes = require('./routes/post-info');
const authRoutes = require('./routes/user');
// const searchRoutes = require('./routes/search');
const tagRoutes = require('./routes/tag');
const commentRoutes = require('./routes/comment');


app.use("/posts", postRoutes);
app.use("/post", postRoutes);
app.use("/post-info", postInfoRoutes);
app.use("/user", authRoutes);
// app.use("/search", searchRoutes);
app.use("/tags", tagRoutes);
app.use("/comment", commentRoutes);


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

