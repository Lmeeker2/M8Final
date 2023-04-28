//create express app line 6
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const express = require('express');
const app = express();
//body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//path module provides utilities for working with file and directory paths
const path = require('path');
//debugging and logging
const morgan = require('morgan-body');
//middleware
//create a write stream
var rfs = require('rotating-file-stream')
//serve static files
//create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {

    interval: '1d', 
    path: path.join(__dirname, 'log'),
}) //logger setup

morgan(app, {
    stream: accessLogStream,
    noColors: true,
    logReqUserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
});

//__dirname is the directory name of the current module
app.use(express.static(path.join(__dirname, 'public')));

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the views directory
app.set('views', 'views');

//routes defined in routes folder
const authenticationRoute = require(`./routes/authenticationRoute`);
app.use('/api', authenticationRoute);

//404 page Error
app.use((err, req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

//connecting to the database
const mongoose = require('mongoose');

//asyncronous connection
//mongoose.connect(`mongodb+srv://user:test@cluster0.t7xrj2b.mongodb.net/test`, {useNewUrlParser: true})
mongoose
.connect(
  'mongodb+srv://tempAcc:R8IsT7R8AVnoFDVD@cluster0.t7xrj2b.mongodb.net/Final',
  {
    useNewUrlParser: true,
  }
)
    .then(() => console.log('MongoDB connection successful'))
    .catch((error) => console.error(error));

    //start the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});