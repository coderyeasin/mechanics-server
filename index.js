const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; //for single service
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = 5000;

//middleware
app.use(cors())
app.use(express.json())

// firstuser
// DBl20rNXA74lrQPH

// seconduser
// pgDU45En467IBr5W

// third
// TPabCjEaX6bU4ymw


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tie3l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server() {
    try {
        await client.connect();
        // console.log('connected to database');

        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services')

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific serviec', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service);
            const result = await serviceCollection.insertOne(service)
            console.log(result);
            // res.send('hiteed')
            res.json(result)
        });

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query)
            res.json(result)
        })
        
        
    }
    finally {
        // await client.close()
    }
}
server().catch(console.dir);














app.get('/', (req, res) => {
    res.send('Running Car Server');
})

app.listen(port, () => {
    console.log((`Running Server on ${port}`));
})