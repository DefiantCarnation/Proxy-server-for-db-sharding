var express = require('express');
var app = express();
var request = require('request');
var dbs = ['http://localhost:8888','http://localhost:8889'];
var bp = require('body-parser');
var axios =require('axios')

app.use(bp.json());


app.use(forwardrequests)
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
		return previousvalue + currvalue.charCodeAt(0);
	},0);
	//console.log('HASHED TO DB AT INDEX', sum % dbs.length);
	return sum % dbs.length;
}

function forwardrequests(req,res,next){
	var userid = req.url.split('/')[req.url.split('/').length - 1]
	var loginname = req.body.username || req.body.userId || req.params.userid || userid;
	console.log('LoginNameis',loginname);
	var dbindex = hash(loginname);
	var url = dbs[dbindex] + req.url;
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