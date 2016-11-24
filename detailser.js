var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//app.use(bodyParser());
var MongoClient = require('mongodb').MongoClient;
app.use(express.static('public'));
var url = require('url') ;
var PORT = 8989;
var DB_PORT = 27017;
var DB_NAME = 'crudeoperations';
var URL = 'mongodb://localhost:'+DB_PORT+'/'+ DB_NAME;
var dbObj;
var collection;

app.use(bodyParser.json());   // support json encoded bodies
app.use(bodyParser.urlencoded({'extended':'true'}));

MongoClient.connect(URL, function(err, db) {
	if(err) {
		         console.log('[ ERROR ] - MongoDB Connection Failed...!', err);
	         }
	      console.log("Connected correctly to server");
	      dbObj = db;
	      collection = dbObj.collection('detail');
	      app.listen(PORT, function () {  		
		   console.log("[ INFO ] - Server started and listening at: http://localhost:%s",PORT);
	});
});
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/public/" + "detail.html" );
});

	
app.post('/insert', function (req, res) {	  
     collection.insert([{Name:req.body.name1,
	                  Age :req.body.age1,
                      Email:req.body.email1}], 
					  function(err, docs) {
		if(err) {
			console.log("error for insertion");
			return;
		}
            console.log(" data has been entered"); 
            console.log(" data is", docs);	
          //console.log(" data:", a);		
	
          //res.send(docs);  
		   res.redirect('/detail.html');
    });	
	
});

app.post('/update', function (req, res) {
       collection.update({Name:req.body.name1},{$set:{Age:req.body.age1.value,Email:req.body.email1.value}}, function(err, docs) {
		   if(err){
			           console.log("Not found person with the name");
			           return;
		   }
			console.log("data has been updated");
            res.redirect('/detail.html');
	   });
});

app.post('/find', function (req, res) {
	 collection.find({}).toArray(function(err, docs){
	  if(err) {
		         console.log('Error fetching data from the collection: ', err);
		          return;
	          } 
	  console.log("these are the data");
	  console.log(docs);	  
	  res.redirect('/detail.html');
	 });
});

app.post('/delete', function (req, res) {
	
collection.findOneAndDelete({Name:req.body.name1},function(err, doc) {
    if (err) {
       console.log("not found");
	}
	
         console.log("deleted");
	
         res.redirect('/detail.html');

});


	});


