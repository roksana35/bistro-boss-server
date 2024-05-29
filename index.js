const express =require('express')
const app =express()
const cors= require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT||5000;

//middlware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const menuCollection = client.db("bistroDB").collection("menu");
const cartCollection = client.db("bistroDB").collection("carts");
;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get('/menu',async(req,res)=>{
        const cursor=await menuCollection.find().toArray()
        res.send(cursor)
    })

      app.get('/carts',async(req,res)=>{
        const email= req.query.email;;
        const quary={email:email}
        const result=await cartCollection.find(quary).toArray()
        res.send(result)
      })


    app.post('/carts',async(req,res)=>{
      const quary=req.body;
      const result=await cartCollection.insertOne(quary)
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
      const id =req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await cartCollection.deleteOne(quary)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//    await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('boss is sitting')
})
app.listen(port,()=>{
    console.log(`Bistro boss is sitting on port:${port}`)
})