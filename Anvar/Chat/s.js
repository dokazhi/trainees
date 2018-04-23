var localhost = 3000;
var domen = 'http://localhost:3000';

var query_for_bigChat0 = 'select Ash.AUser.login, Ash.AUser.path, Ash.AUser.isOnline, Ash.ABigChat.sms, Ash.ABigChat.dtt from Ash.AUser, Ash.ABigChat where Ash.AUser.user_id = Ash.ABigChat.us_id order by dtt DESC Limit 7';
var query_for_bigChat2 = 'select Ash.AUser.login, Ash.AUser.path, Ash.AUser.isOnline, Ash.ABigChat.sms, Ash.ABigChat.dtt from Ash.AUser, Ash.ABigChat where Ash.AUser.user_id = Ash.ABigChat.us_id order by dtt';
/////////////////////////////////////////
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var mysql = require('mysql');
var express = require('express');
var fs = require("fs");
var multiparty = require('multiparty');
////////////////////////////////////////
var app = require('express')();
var http = require("http").Server(app);
var io = require('socket.io')(http);
/////////////////////////////////////////

/*----------Connecion to DB-------------*/
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'user',
	password: 'mysql',
	database: 'Ash'
});


/*--------------App Config--------------*/
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.urlencoded({extended:false}));
app.use('/static', express.static('./public'));
app.use(session({
	key		: 'session_name',
	secret	: 'session_secret' 
}));

/*------------Registration and Authorithation------------*/
app.get('/', function(req,res)
	{
		if(req.session.name)
			connection.query(query_for_bigChat2, function(err, result, fields)
				{
					res.render('bigChat', {name: req.session.name, chat: result});
				});
		else
			res.render('registration', {msg: ''});
	});
app.get('/Registration', function(req,res)
	{
		req.session.name = undefined;
		res.render('registration', {msg: ''});
	});

app.post('/Registration', (req,res) => 
	{
		var name = noplace(req.body.Name);
		var pas = noplace(req.body.Password);
		
		if(name == '' || pas == '')
		{
			res.render('registration', {msg: 'Заполните все поля!'});
		} 
		else
		{
			if(name.length < 3)
			{
				res.render('registration', {msg: 'Количество символов имени должно быть больше 3-ex.'});
			}
			else
			{
				if(pas.length < 5)
				{
					res.render('registration', {msg: 'Слишком короткий пароль.'});
				}
				else
				{	
					var flag = false;
					var fl = false;
					connection.query('select login, pass from Ash.AUser', function(error, result, fields)
						{
							for(var i = 0; i < result.length; i++ )
							{
								if(noplace(result[i].login.toLowerCase()) == name.toLowerCase() )
								{
									flag = true;

									if(noplace(pas.toLowerCase()) == noplace(result[i].pass.toLowerCase()))
										fl = true;
								}
							}

							if(flag)
							{
								if(fl)
								{
									//Мы вас нашли!
									req.session.name = name;
									connection.query(query_for_bigChat2, function(err, result, fields)
										{
											res.render('bigChat', {name: req.session.name, chat: result});
										});
									
								}
								else
								{
									res.render('registration', {msg: 'Неверный пароль!\nЕсли хотите зарегистрироваться возьмите другой логин: этот занят!'});
								}
									
							}
							else
							{
								connection.query("insert into Ash.AUser(login, pass) values ('"+name+"','"+pas+"')", function(err, result, fields)
								{
									if(!err)
									{
										res.render('registration', {msg: 'Вы записаны! Выполните вход!'});
									}
								});
							}
						});
				}
			}
		}
	});

function noplace(str)
{
	var VRegExp = new RegExp(/^[ ]+/g);
	var VResult = str.replace(VRegExp, '');
	return VResult;
}

/*------------------------------POST INFO-------------------------------------*/
app.post('/BigChat', function(req,res)
{
	connection.query("select path from Ash.AUser where login ='"+req.body.name+"'", function(err, result, fields)
		{
			if(err)
			{
				res.send('Возникли ошибки на сервере!');
			}
			else
			{
				res.send(result[0]);
			}
		});
});

app.post('/getBChat', function(req,res)
	{
		connection.query('select Ash.AUser.login, Ash.AUser.path, Ash.AUser.isOnline, Ash.ABigChat.sms, Ash.ABigChat.dtt from Ash.AUser, Ash.ABigChat where Ash.AUser.user_id = Ash.ABigChat.us_id order by dtt DESC', function(err,result,fields)
			{
				res.send(result);
			});
	});

/*-----------------------BigChat------------------------------*/
app.get('/BigChat', function(req,res)
	{
		if(req.session.name)
			connection.query(query_for_bigChat2, function(err, result, fields)
				{
					res.render('bigChat', {name: req.session.name, chat: result});
				});
		else
			res.render('registration', {msg: ''});
		
	});
/*--------------------------Get My Page----------------------------*/
app.get('/MyPage', function(req,res)
	{
		if(req.session.name)
			connection.query('select * from Ash.AUser where login="'+req.session.name+'"', function(err, result, fields)
				{
					res.render('myPage', {user: result[0]});
				});
		else
			res.render('registration', {msg: ''});
	});

/*---------------------Uploading Photo--------------------------------*/
app.post('/MyPage', function(req,res)
	{
		var form = new multiparty.Form();
		var uploadFile = {uploadPath: '', type: '', size: 0};

		form.on('part', function(part) {
			var puu = '';
			//читаем его размер в байтах
			uploadFile.size = part.byteCount;
			//читаем его тип
			uploadFile.type = part.headers['content-type'];
			//путь для сохранения файла
			var date = new Date();
			uploadFile.path = './public/photo/' + req.session.name + '.png';
			// '.' + part.filename.split('.',2)[1];
			puu = '/static/photo/' + req.session.name +'.png';
			var out = fs.createWriteStream(uploadFile.path);
			part.pipe(out);
			connection.query('select user_id from Ash.AUser where login = "'+req.session.name+'"',function(err,result,fields)
			{
				connection.query('update Ash.AUser set path = "'+puu+'" where user_id ='+result[0].user_id, function(err,result,fields)
					{
						if(err) {console.log('Ошибка в записи пути к фото!');}
					});
			});
			res.send(puu);
		});

		form.parse(req);
	});

/*-----------------------------GET Private Chat--------------------------------*/
app.get('/PrivateChat', function(req,res)
	{
		if(req.session.name)
		{
			var name = req.query.name;

			if(req.query.name == undefined)
			{
				connection.query(query_for_bigChat2, function(err, result, fields)
				{
					res.render('bigChat', {name: req.session.name, chat: result});
				});
			}
			else
			{	
				connection.query("select user_id from Ash.AUser where login = '"+req.session.name+"'", function(err, result, fields)
				{
					if(err) console.log(err);
					var Myid = result[0].user_id;
					connection.query("select user_id, Ash.AUser.isOnline from Ash.AUser where login = '"+name+"'", function(err, result,fields)
						{
							if(err) console.log(err);
							var pId = result[0].user_id;
							var stat = result[0].isOnline;

							connection.query("select Ash.AUser.login, Ash.AUser.path, Ash.AChat.sms, Ash.AChat.dtt from Ash.AChat, Ash.AUser where (sender_id = Ash.AUser.user_id) and (( sender_id = "+ Myid +" and adresse_id = "+ pId +")  or  ( sender_id = "+ pId +" and adresse_id = "+ Myid + "))  order by dtt", function(err,result,fields)
								{
									if(err) console.log(err);
									res.render('privateChat', {name: req.session.name,stat: stat , Pname: name, chat: result} );
								});
						});
				});
			}
		}
		else
		{
			res.render('registration', {msg: ''});
		}
	});

/*--------------------------Get List------------------------------*/
app.get('/List', function(req,res)
	{
		if(req.session.name)
		{
			connection.query('select * from Ash.AUser order by login', function(err,result,fields)
			{
				if(err) console.log(err);
				res.render('Mylist', { name: req.session.name , mas: result});
			});
		}
		else
		{
			res.render('registration', {msg: ""});
		}
	});


/*------------------------socket--------------------------*/
io.sockets.on('connection', function(socket) 
{
	socket.on('Connected', function(data)
		{
			connection.query('select user_id from Ash.AUser where login ="'+data+'"',function(err,result,fields)
				{
					connection.query('update Ash.AUser set isOnline = 1 where Ash.AUser.user_id = '+result[0].user_id, (err,res,fields)=> {
						if(err) console.log(err);
						io.emit('anyone connected', data);
					})
				});
		});

	socket.on('disconnected', function(data)
		{
			connection.query('select user_id from Ash.AUser where login ="'+data+'"',function(err,result,fields)
				{
					connection.query('update Ash.AUser set isOnline = 0 where Ash.AUser.user_id = '+result[0].user_id, (err,res,fields)=> {
						if(err) console.log(err);
						io.emit('anyone disconnected', data);
					})
				});
		});

	socket.on('private_message', function(data)
		{
			var mas = data.split('$',3);

			connection.query('select user_id from Ash.AUser where login="'+mas[0]+'"', function(err,result,fields)
				{
					var myId = result[0].user_id;

					connection.query('select user_id from Ash.AUser where login="'+mas[1]+'"', function(err,result,fields)
						{
							var PId = result[0].user_id;

							connection.query('insert into Ash.AChat(sender_id,adresse_id,sms) values ('+myId+','+PId+',"'+ mas[2] +'")', function(err,result,fields)
								{
									if(err){console.log(err);}
									else
									{
										io.emit('new private_message', mas[0]+'$'+mas[1] +'$' + mas[2]);
									}
								});

						});
				});
		});

	socket.on('message', function(data)
		{
			var mas = data.split('$',2);
			
			connection.query("select user_id from Ash.AUser where login = '"+mas[0]+"'", (err,result,fields) => {
				if(err){}
				else
				{
					var id = result[0].user_id;
					connection.query("insert into Ash.ABigChat(us_id, sms) values ("+id+",'"+mas[1]+"')",(err,result,fields)=>{
						if(err) {console.log(err);}
						else
						{
							io.emit('new message', mas[0]+'$'+mas[1]);
						}
					});
				}
			});
		});
	
});

http.listen(localhost,function(){});
console.log('Сервер прослушивает порт: ' + localhost);