const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.vsrgles.mongodb.net/?retryWrites=true&w=majority`;

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

    const musicsCollections = client.db("pod-music-collections").collection("musics");
    const savedCollections = client.db("pod-music-collections").collection("saved");

    app.get('/', (req, res) => {
        res.send('Hello World!')
      })

    app.get('/musics',async(req,res)=>{
        const result = await musicsCollections.find().toArray()
        res.send(result)
    })

    app.get('/saved',async(req,res)=>{
        const email = req.query.email;

        if(!email){
            res.send({message:'error'})
        }

        const query = {email:email}
        const result = await savedCollections.find().toArray()
        res.send(result)
    })

    app.post('/saved',async(req,res)=>{
        const item = req.body; 
        const result = await savedCollections.insertOne(item)
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




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})