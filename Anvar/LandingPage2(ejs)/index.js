//Библиотеки
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var ejs = require('ejs');
var bcrypt = require('bcryptjs');

//Подключение к БД
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'mysql',
  database : 'FirstDb'
});

connection.connect();
////////



app.use(bodyParser.urlencoded({extended:false}));

app.use('/static',express.static(__dirname+'/public'));
app.use('/views',express.static(__dirname+'/views'));

app.set('view engine','ejs');
//////////////Get
app.get('/LandingPage',function(req,res)
{
	res.render("page.ejs", {});
})

app.get('/',function(req,res)
{
	res.render("index.ejs", {});
})

app.get('/person',function(req,res){
	res.render('person', context);
});


function nospace(str) { 
	var VRegExp = new RegExp(/^(\s|\u00A0)+/g); 
	var VResult = str.replace(VRegExp, ''); 
	return VResult; 
}


////////////post
app.post('/', function(req,res){
	
	var name = req.body.name;
	var email = req.body.email;
	var info = req.body.info;

	connection.query('select nm from FirstDb.Persons', function(error, results, fields)
		{
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
			connection.query("insert into FirstDb.Persons(nm,email,info) values('"+name+"','"+email+"','"+info+"')", function (error, results, fields) {
		  	if (error) throw error;
			});
			var context={};
		    context['name']=name;
		    context['email']=email
		    context['info']=info;
		    console.log(context);
			res.render("person", context);
		}
		else if(z<=0) {;
			res.send(("Вы уже записаны!"));
		}
		});
});



app.post('/LandingPage' ,function(req, res){

	var name = req.body.name;
	var email = req.body.email;

	console.log(name + ' ' + email);
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
			connection.query("insert into personInfo(nm,mail) values('"+name+"','"+email+"')", function (error, results, fields) {
		  	if (error) throw error;
			});
			res.send("Аутентификация пройдена!");
		}
		else if(z<=0) {;
			res.send(("Данный пользователь уже существует!"));
		}

	});


});

console.log("Сервер запущен!");
app.listen(3000);
