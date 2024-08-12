const express = require('express');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
//create a cient connection to the database
const client = new MongoClient(url);

const app = express();
const PORT = 3001;

const dbName = 'transformers_db';

//add the JSON Middleware / allow json to be attached to the req.body
app.use(express.json());

async function start() {
    //connect to mongo db server
    await client.connect();
    console.log('connected to mongo db');

    //db connection
    const db = client.db(dbName);
    //collection variable
    const autobotsCollection = db.collection('autobots');

    //GET route to retrieve all autobots
    app.get('/api/autobots', async (req, res) => {
        const autobots = await autobotsCollection.find({}).toArray();

        res.json(autobots);
    });

    //POST route to add an autobot
    app.post('/api/autobots', async (req, res) => {
        //create the autobot
        const info = await autobotsCollection.insertOne({
            name: req.body.name,
            color: req.body.color
        });

        console.log(info);

        res.json({
            message: 'success!'
        });
    })

    // start epress server
    app.listen(PORT, () => {
        console.log('server started on', PORT)
    })
}

start();