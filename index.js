const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express()
require('dotenv').config();
const cors = require('cors')
const port = process.env.PORT ||5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pung5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);


async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todoList").collection("todo");

    
   // get api for todo
   app.get('/todos' ,async (req,res)=>{
    const query = req.query;
    console.log(query);
    const cursor = todoCollection.find(query);
    const result = await cursor.toArray(cursor);
    res.send(result)
  })
      
    
//Api end point :localhost:5000/todo

      // create / post  api for todo
      app.post("/todo", async (req, res) => {
        const data = req.body;
        console.log("from post api", data);
        const result = await todoCollection.insertOne(data);
        res.send(result);
      });

  
//Api end point :localhost:5000/todo/626e45432962b1117f6d6526
      // update api for todo 

      app.put("/todo/:id", async(req,res)=>{
        const id = req.params.id;
        const data = req.body
        console.log('this is from put method', data);
        console.log('from put method',id);
        const filter = {_id:ObjectId(id)};
        const options = { upsert: true };

        const updateDoc = {
          $set: {
            todoName:data.todoName,
            description:data.description
          },

        };
        const result = await todoCollection.updateOne(filter, updateDoc, options);

        res.send(result)
      })

      //delete api for todo
      //Api end point :localhost:5000/todo/626e45432962b1117f6d6526
    
    app.delete('/todo/:id', async(req,res)=>{
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await todoCollection.deleteOne(
          filter
        );
        res.send(result)
      })


    console.log('Db connected');

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Yeeee! I start to the Server.I con not know how to work the server. it was working')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})