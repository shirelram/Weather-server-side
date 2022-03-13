const express=require('express')
const app=express()
app.listen(3050)
const jwt = require('jsonwebtoken')
const env=require('dotenv')
const mongoose = require('mongoose')
env.config()
const bodyParser=require('body-parser')
app.use(bodyParser.json())
const router=require('./routs/api')

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

mongoose.connect(process.env.DATABASE, connectionParams)
.then(() => {
    console.log('connected!!!')
}).catch(err => { console.log(err) });

function setupCORS(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
}
app.all('/*', setupCORS);

app.use(router)