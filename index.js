const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// mongo


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymctjj.mongodb.net/?retryWrites=true&w=majority`;


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

    const spotsCollection = client.db('TouristSpot').collection('spots')
    

    app.get('/spots',async(req,res)=>{
      const cursor =  spotsCollection.find()
      // const cursor2 = await spotsCollection.find({}).sort({averagecost:1}).toArray();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/mylist/:email',async(req,res)=>{
      console.log(req.params.email);
      const result = await spotsCollection.find({email:req.params.email}).toArray();
      res.send(result)
    
    })



app.post('/spots', async(req,res)=>{
    const newSpots = req.body;
    console.log(newSpots);
    const result = await spotsCollection.insertOne(newSpots )
    res.send(result)
})

app.put('/mylist/:id',async(req,res)=>{
  const id = req.params.id;
  const filter ={_id:new ObjectId(id)}
  const options ={upsert:true};
  const updateSpot = req.body;


  const spot ={
    $set:{
       image:updateSpot.image,
       touristspotname:updateSpot.touristspotname,
       countryname:updateSpot.countryname,
       location:updateSpot.location,
       averagecost:updateSpot.averagecost,
       seosanlity:updateSpot.seosanlity,
       traveltime:updateSpot.traveltime,
       totalvisitor:updateSpot.totalvisitor,
       description:updateSpot.description

    }
  }
  const result = await updateSpot.updateOne(filter,mylist,options);
  res.send(result)
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// 

app.get('/',(req,res)=>{
    res.send('assignment-10-server is running')
})

app.listen(port,()=>{
    console.log(`assignment-10-server is running on port:${port}`);
})