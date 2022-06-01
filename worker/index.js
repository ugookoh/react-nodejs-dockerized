// The worker is not a nodejs app.
// it wartched redis for insers and then whenever you insert something into redis
// it takes it, and then it calculates the fibonacci value and then it puts it back into
// redis. So now you have an index and a fibonacci pair

const keys = require('./keys');
const redis = require('redis');
const { fib } = require('./functions')
const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000 // every 1 swecond
    }
});


const sub = redisClient.duplicate(); // The duplicate client which listens for events
// You must create a redis duplicate because when a connection is used to publish and subscribe to stuff
// you cannot have the client both listen to stuff and also act as a database. You must create a duplicate
async function init() {
    console.log("WORKER: Connecting to the redis cluster")
    await redisClient.connect();
    await sub.connect();
    await sub.subscribe('insert', (message) => {//message is the index we recieved or the new value added
        console.log("WORKER: GOT THE SUB");
        redisClient.hSet('values', message, fib(parseInt(message)));
        /**
         * This creates a field like
         * 
         * 
         * values:{
         *  0:0
         *  1:1,
         *  2:1,
         *  3:2
         *  }
         * 
         * The values is the id, the property is 3 which is the key of the field and the value is 2
         */

    });//now we have inserted into the redis cache
}
init();

