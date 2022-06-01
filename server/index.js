const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis')
// Express App Setup
const app = express();
app.use(cors());//allowing us to make requests from one domain to a completely different domain
app.use(bodyParser.json());

const { Pool } = require('pg');
const keys = require('./keys');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
})
pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")// create the table values
        .catch((err) => console.error(err));
});

//Redis Client Setup
const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000 // every 1 swecond
    }
});
const redisPublisher = redisClient.duplicate()

async function init() {
    console.log("SERVER: Connecting to the redis cluster")
    await redisClient.connect();
    await redisPublisher.connect();
}
init();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});
app.post('/values/clearAll', async (req, res) => {
    await pgClient.query('DELETE FROM values');
    await redisClient.del('values');
    res.send({ status: "Done" });
});

app.get('/values/current', async (req, res) => {
    const result = await redisClient.hGetAll('values')
    res.send(result)

})

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40)
        return res.status(422).send("Index too high");


    redisClient.hSet('values', `${index}`, 'Nothing yet')// nothing yet would rbe replaced with our worker whoch wopuld put in a fibonacci value
    redisPublisher.publish('insert', `${index}`);// This sends the message back
    pgClient.query(`INSERT INTO values
                     (number) VALUES(${index})`)
    res.status(201).send({ working: true })
})

app.listen(5000, (err) => {
    console.log("SERVER: I am Listening");
});