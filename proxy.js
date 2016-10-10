var express = require('express');
var app = express();
var request = require('request');
var dbs = ['http://localhost:8888'];
var bp = require('body-parser');
var axios =require('axios')

app.use(bp.json());


app.use(forward)
//requests arrive in app with the fbid appended
app.get('/',function(req,res){
	var hash = function(fbid){
		return fbid % dbs.length;
	}

	// var db = hash(req.params.fbid);

	// request(db).then(function(response){
	// 	res.end(response);
	// })

	res.end('got it')

})

//temporary hash function
function hash(str){
	var sum = str.split('').reduce(function(previousvalue,currvalue,currindex,array){
		console.log('prev',previousvalue);
		console.log(currvalue);
		return previousvalue + currvalue.charCodeAt(0);
	},0);
	return sum % dbs.length;
}

function forwardrequests(req,res,next){
	//console.log(req.method);
	var url = dbs[0] + req.url;
	console.log('url',url);
	var method = req.method;
	var data = req.data || {};

	switch(method){
		case 'GET':
			axios.get(url).then(function(dbres){
				res.end(dbres.data)
			})
			break;
		case 'POST':
			axios.post(url,data).then(function(dbres){
				res.end(dbres.data);
			})	
			break;
		case 'PUT':
			axios.put(url,data).then(function(dbres){
				res.end(dbres.data)
			})
			break;
		case 'DELETE':
			axios.delete(url).then(function(dbres){
				res.end(dbres.data)
			})
		break;	
		default:
			console.log('Cant find')

	}
}

function rehash(){

}
//based onfbidea we hash into the array of databases
//and send the response onward

app.listen('8080');