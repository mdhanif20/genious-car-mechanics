const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// name: myMechanics
// pass: yArQ51fLHBIGJaeD 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8f4kw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

async function run(req,res){
    try{
        await client.connect();
        const database = client.db("allServices");
        const servicesCollection = database.collection("Service");
         // load data 
         app.get('/service',async(req,res)=>{
             const cursor = servicesCollection.find({});
             const services = await cursor.toArray();
             res.send(services);
         })
        //  get single data 
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.json(result);
        })
        // DELETE API 
        app.delete('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await servicesCollection.deleteOne(query)
            res.json(result);
        })
        // post api 
        app.post('/services', async (req,res)=>{
            const service = req.body;
            console.log("hit the post api", service);
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })
        app.get('/hello', (req,res)=>{
            res.send("Hello updated here.");
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Allah Rohom karo");
})
app.listen(port,()=>{
    console.log(`example app listener http://localhost:${port}`)
})