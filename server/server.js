const express = require('express');
const path = require('path');

const db = require('./config/connection');
const api_routes = require('./routes/api_routes');
const exp = require('constants');

const app = express();
const PORT = 3001;

// create a get route for every file inside client
app.use(express.static('../client'));

//add the JSON Middleware / allow json to be attached to the req.body
app.use(express.json());

//load in our routes
app.use('/api', api_routes);

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


