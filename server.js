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

//email 
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
	service: 'gmail',
	auth: {
		user: 'samanthasiegel96@gmail.com',
		pass: 'August81996!'
	}
}));

var mailOptions = {
	from: '"Sammi Siegel" <samanthasiegel96@gmail.com>',
	to: 'sps27@duke.edu',
	subject: 'Test',
	text: 'Just testing',
	html: '<b> Just testing </b>',
	attachments: [{
		filename: '',//file name here 
		path: '', //path to file --> taken from form
		contentType: 'application/pdf'
	}], function(err, info){
		if(err){
			console.log(err);
		} else{
			console.log(info);
		}
	}
};

//email handler
app.get('/test-mail', function(req, res){
	res.render('test-mail');
});

app.post('/test-mail', function(req, res){
	transporter.sendMail(mailOptions, function(err, info){
		if(err) return console.log(err);
		console.log('Message sent: ' + info.response);
	});
	res.render('submit');
});

// pdf stuff
var pdfFiller = require('pdffiller');

var sourcePDF = "final-ACH.pdf";
var destinationPDF =  "output-ACH.pdf";
var shouldFlatten = true;
var data = {
    "banking_institution" : "Chase",
    "home_address" : "123 Lit Lane",
    "routing_number" : "123456789",
    "account_number" : "123456789",
    "account_type" : "MoneyJ$",
    "name_on_account" : "Sammi Node Siegel",
    "name_printed" : "Sammi",
    "name_signature" : "Sammi Sign Here",
    "date" : "06/28/2016",
    "phone" : "123-456-7890",
    "email" : "sammi@intuit.com"
};
 
pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) {
    if (err) throw err;
    console.log("In callback (we're done).");
});

var sourcePDFTax = "final-TAX.pdf";
var destinationPDFTax =  "output-TAX.pdf";
var dataTax = {
    "employee_name" : "Sammi",
    "monthly_salary" : "$$$",
    "yes_tax" : "1",
    "no_tax" : "1",
    "single" : "1",
    "filing_jointly" : "1",
    "filing_separately" : "1",
    "head_household" : "1",
    "yourself" : "1",
    "spouse" : "1",
    "dep_16_under" : "1",
    "dep_17_over" : "1",
    "total_exemptions" : "1",
    "auth_sig" : "Sign here"
};
 
pdfFiller.fillForm(sourcePDFTax, destinationPDFTax, dataTax, function(err) {
    if (err) throw err;
    console.log("In callback (we're done).");
});

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

//test form UI
app.get('/personal-info', function(req, res){
	res.render('personal-info');
});

//run application
app.listen(port);
console.log('Go to port ' + port);