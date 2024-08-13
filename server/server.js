require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const db = require('./config/connection');
const api_routes = require('./routes/api_routes');
const auth_routes = require('./routes/auth_routes')

const app = express();
const PORT = 3001;

// create a get route for every file inside client
app.use(express.static('../client'));

// attach all client side cookies on the req.cookies property
app.use(cookieParser())

//add the JSON Middleware / allow json to be attached to the req.body
app.use(express.json());

//load in our routes
app.use('/api', api_routes);
app.use('/api/auth', auth_routes);

//send back the index.html file for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})

//once the connection is established ...
db.once('open', () => {
    console.log('db connection est.')
    // ...start express server
    app.listen(PORT, () => {
        console.log('server started on', PORT)
    });
})


