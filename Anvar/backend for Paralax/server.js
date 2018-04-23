var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var ejs = require('ejs');
var session = require('express-session');

//Подключение к базе данных Paralax
var mysql = require('mysql');

var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'user',
	password: 'mysql',
	database: 'Parallax' 
});

connection.connect();
//

var app = express();


//Парсер
app.use(bodyParser.urlencoded({extended:false}));


app.set('view engine','ejs');
app.use('/static', express.static(__dirname + '/public'));
app.engine('ejs', require('ejs-locals'));



app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret'
}))

/////////////////
app.get('/',function(req,res)
	{

		connection.query('select * from Parallax.Worksheet',function(error,result,fileds){
			res.render('index', {name: req.session.name, info: result});
		});
	});

app.get('/Index',function(req,res)
	{
		connection.query('select * from Parallax.Worksheet',function(error,result,fileds){
			res.render('index', {name: req.session.name, info: result});
		});
	});

app.get('/About_Parallax',function(req,res)
	{
		connection.query('select * from Parallax.Worksheet',function(error,result,fileds){
			res.render('About_Parallax', {name: req.session.name, info: result});
		});
	});

app.get('/Energy',function(req,res)
	{
		connection.query('select * from Parallax.Worksheet',function(error,result,fileds){
			res.render('Energy', {name: req.session.name, info: result});
		});
	});

app.get('/Parallax-way',function(req,res)
	{
		connection.query('select * from Parallax.Worksheet',function(error,result,fileds){
			res.render('Parallax-way', {name: req.session.name, info: result});
		});
	});

app.get('/login', function(req,res)
	{
		res.render('login',{ans: ""});
	});


app.get('/logout',function(req,res)
	{
		req.session.name = undefined;
		res.render('index', {name: undefined, info: null});
	});

app.post('/About_Parallax',function(req,res)
	{
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var chb_d = req.body.chb_d;
		var chb_e = req.body.chb_e;
		var chb_fc = req.body.chb_fc;
		var comments = req.body.comments;
		var fname = req.body.filename;

		connection.query("insert into Parallax.Worksheet(firstname,lastname,chb_d,chb_e,chb_fc,path,comments) values('"+firstname+"','"+lastname+"',"+chb_d+","+chb_e+","+chb_fc+",'"+fname+ "','"+comments+"')", function (error, results, fields) {if (error) throw error;});

		res.send('END');
	    
	});

app.post('/About_file', function(req,res,next)
	{
		var form = new multiparty.Form();
   		var uploadFile = {uploadPath: '', type: '', size: 0};
   		form.on('part', function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        var date = new Date();
        uploadFile.path = './public/Resumes/' + date.getDate()+'.' +date.getMonth()+'.'+ date.getFullYear()+ '-' +part.filename;

        var out = fs.createWriteStream(uploadFile.path);
        part.pipe(out);
	    });
	    // парсим форму
	    form.parse(req);

	    connection.query('select * from Parallax.Worksheet', function (error, results, fields) 
			{
				if (error) throw error;
				res.render('index', {name: req.session.name, info: results});
			});
	});


app.post('/login',function(req,res,next)
	{
		var fl = false;

		var name = req.body.Name;
		var pas = req.body.Password;

		connection.query('select Pname from Parallax.Pers',function(error,result,fileds){
			for (var i = 0; i < result.length; i++) 
			{
				if( result[i].Pname == name) 
				{
					req.session.name = name;
					fl = true;
				}
			}

			if(fl)
			{
				connection.query("select Ppassword from Parallax.Pers where Pname = '"+ name+"'" ,function(error,result,fileds){
					if(result[0].Ppassword == pas)
					{
						connection.query('select * from Parallax.Worksheet', function (error, results, fields) 
							{
								if (error) throw error;
								res.render('index', {name: name, info: results});
							});
						
					}
					else
					{
						res.render('login', {ans: "Неверный пароль"});
					}
				});
			}
			else
			{
				connection.query("insert into Parallax.Pers(Pname, Ppassword) values('"+name+"','"+pas+"')", function(err,res,fields){});
				res.render('login',{ans: "Записано! Выполните вход!"});				
			}
		});
	});


console.log("Сервер запущен 3000!");
app.listen(3000);
