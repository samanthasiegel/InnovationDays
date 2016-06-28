//set up application
var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;
var handlebars = require('express-handlebars')
	.create({ defaultLayout:false });

//set us view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//log HTTP request status
var logger = require('morgan');
app.use(logger('dev'));

//parse html form
var busboy = require('connect-busboy');
app.use(busboy());

//help parse form
var path = require('path');
var fs = require('fs');


//form page
app.get('/', function(req, res){
	res.render('form');
});

app.get('/home', function(req, res){
	res.render('home');
});


//upload receipt photo
app.post('/upload', function(req, res){
	var fstream;
	req.pipe(req.busboy);
	var arr = [];
	req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
		console.log(fieldname, val)
		arr.push(val);
    });
	req.busboy.on('file', function(fieldname, file, filename){
		console.log("Uploading: " + filename);
		fstream = fs.createWriteStream(__dirname + '/uploaded-images/' + filename);
		file.pipe(fstream);
		fstream.on('close', function(){
			res.render('submit', { info: arr });
		});
	});

});

//after submitting form
app.get('/submit', function(req, res, next){
	res.render('submit');
})

//run application
app.listen(port);
console.log('Go to port ' + port);