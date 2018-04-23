var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const assert = require('assert');
var notifier = require('node-notifier');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'mysql',
  database : 'FirstDb'
});

connection.connect();

app.use(bodyParser.urlencoded({extended:false}));

app.use('/static',express.static(__dirname+'/public'));

app.use(require('connect-flash')());

//////////////Get
app.get('/LandingPage',function(req,res)
{
	res.sendFile(__dirname + '/page.html');
})


function nospace(str) { 
	var VRegExp = new RegExp(/^(\s|\u00A0)+/g); 
	var VResult = str.replace(VRegExp, ''); 
	return VResult; 
}

////////////post
app.post('/LandingPage' ,function(req, res){

	var name = req.body.name;
	var email = req.body.email;
	
	connection.query("select nm from FirstDb.personInfo", function(error, results, fields){
		var z = 1;

		for (var i = 0; i < results.length; i++) 
		{
			if( nospace(results[i].nm) == nospace(name)) 
			{
				z = z -1;
				break;
			}
		}

		if(z > 0)
		{
			connection.query("insert into personInfo(nm,mail) values('"+name+"','"+email+"')", function (error, results, fields) {if (error) throw error;});
			res.send("Аутентификация пройдена!");
		}
		else if(z<=0) {;
			res.send(("Данный пользователь уже существует!"));
		}

	});


});


app.listen(3000);
