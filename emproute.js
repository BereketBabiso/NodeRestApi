var express = require('express');
const {from}=require('rxjs');
var router = express.Router();

function myPromise(data){
    return new Promise((resolve, reject)=>{
        if(data) resolve(data);
        else reject(new Error());
    });
}

router.route('/')
      .get(({col},resp)=>{
          col.then(db=>{
              var dbo = db.db('usa');
              dbo.collection('col').find({}).toArray((err,doc)=>{
                  if(err) throw err;
                  resp.json(doc);
              });
          });
        //   var dbo = req.col.db('db').collection('col');
        //   dbo.find({}).toArray((err,doc)=>{
        //       if(err) throw err;
        //       resp.json(doc);
        //   });
      })
      .post((req,resp)=>{
          var id=req.body._id;
          var name=req.body.name;
          var sal = req.body.salary;
          var address = req.body.address;
          var comp = req.body.company;
        req.col.then(db=>{
            var dbo = db.db('usa');
            dbo.collection('col').insertOne({_id:id,name:name,salary:sal,address:address,company:comp},(err)=>{})
            resp.status(201).json({'Inserted':1});
      
      })
    });

router.delete('/:id',(req,resp)=>{
    from(req.col).subscribe(
        (db)=>{
            var dbo = db.db('usa');
            var idint = parseInt(req.params.id);
            dbo.collection('col').remove({_id:idint},(err,removed)=>{if(!err) resp.json({'message':'delete ok'})});

        }
    )
})

    

router.route('/:company')
      .get((req,resp)=>{
        req.col.then(db=>{
            var dbo = db.db('usa');
            dbo.collection('col').aggregate([
                {$match:{company:req.params.company}},
                {$project:{_id:'$name'.substring(0,2),
                          salary:'$salary'}}
            ]).toArray((err,doc)=>{
                if(err) throw err;
                console.log(doc);
            })
        });
      })








module.exports = router;