const express = require('express')
const app = express()
const port = process.env.PORT || 5000
require("dotenv").config();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json())
app.use(cors())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hnesd.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thllb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("Todo-app").collection("todo-list")


        app.post('/todo', async (req, res) => {
            const todo = req.body;
            console.log(todo);
            const result = await todoCollection.insertOne(todo);
            res.send(result)
        })

        app.get('/todos', async (req, res) => {
            const result = await todoCollection.find().toArray()
            res.send(result)
        })

        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const body = req.body;
            console.log(body);
            const options = { upsert: true };
            const updateDoc = {
                $set: body,
            };
            const result = await todoCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await todoCollection.deleteOne(filter)
            res.send(result)

        })
        console.log('Db connected');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!. I am waiting')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})