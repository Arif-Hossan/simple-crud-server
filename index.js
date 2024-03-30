const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());



// Mongo DB Credentials
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const usersCollection = database.collection("users");
    // get the data from database
    app.get('/users',async (req,res)=>{
      const cursor = usersCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // post(create) data from client using post
    app.post('/users', async(req,res)=>{
      const users = req.body;
      console.log('new user', users);
      const result = await usersCollection.insertOne(users);
      res.send(result);
    })

    // delete single data from db
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//Mongo db credentials 


app.get('/',(req,res)=>{
    res.send('Simple CRUD is RUNNING');
})

app.listen(port,()=>{
    console.log( `Simple CRUD is running on port, ${port} `);
})