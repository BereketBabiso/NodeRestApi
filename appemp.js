const express = require('express');
const util = require('util');
const {from}=require('rxjs');
const {map}=require('rxjs/operators');
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var route= require('./emproute');

var collection = util.promisify(MongoClient.connect)('mongodb://localhost:27017/');//.db('usa').collection('col');

var app = express();
var port=8080;

//===========configure=======
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.enable('etag');
//app.use(validator());
//==================================


app.use('*',(req,resp,next)=>{
    req.col=collection;
    return next();
});



app.use('/employees',route);
app.listen(port,()=>console.log('server started on port'+port));
