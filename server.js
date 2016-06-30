// ===============================
// SET UP APP ====================
// ===============================
var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;

// ================================
// VIEW ENGINE ====================
// ================================
var handlebars = require('express-handlebars')
	.create({ defaultLayout:false });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


// ================================
// MIDDLEWARE =====================
// ================================

// log HTTP request status
var logger = require('morgan');
app.use(logger('dev'));

// parse html form
//var busboy = require('connect-busboy'); //for images
//app.use(busboy());

var busboy = require('connect-busboy');
app.use(busboy());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); //get information from html forms 
app.use(bodyParser.json());

// help parse form
var path = require('path');
var fs = require('fs');

// pdf 
var pdfFiller = require('pdffiller');
// source/output for pdfs
var sourcePDF = "final-ACH.pdf";
var destinationPDF =  "output-ACH.pdf";
var sourcePDFTax = "final-TAX.pdf";
var destinationPDFTax =  "output-TAX.pdf";

// email 
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
	service: 'gmail',
	auth: {
		user: 'samanthasiegel96@gmail.com',
		pass: 'August81996!'
	}
}));

//zip 
var EasyZip = require('easy-zip2').EasyZip;
//remove directory
var rmdir = require('rmdir');



// =================================
// GLOBAL VARIABLES ================
// =================================
var name = '';
var sendTo = '';


// =================================
// ROUTES ========================== 
// =================================

//home page
app.get('/', function(req, res){
	res.render('home');
});

//Tax form
app.get('/form-1', function(req, res){

	//TODO: this is a bad way of handling the directories!!

	//creates directory for image uploads
	var mkdirp = require('mkdirp');
	mkdirp('./uploaded-images', function(err){
			if(err) throw err;
			console.log('Created directory.');
	});
	res.render('form-1');
});

//writes to tax pdf
app.post('/form-1', function(req, res){
	var data = {
		"employee_name" 	: req.body.employee_name,
		"monthly_salary" 	: req.body.salary,
		"yes_tax" 		 	: req.body.yes_tax || "Off",
		"no_tax" 			: req.body.no_tax || "Off",
		"single" 			: req.body.single || "Off",
		"filing_jointly" 	: req.body.filing_jointly || "Off",
		"filing_separately" : req.body.filing_separately || "Off",
		"head_household" 	: req.body.head_household || "Off",
		"yourself"			: req.body.yourself || "Off",
		"spouse"			: req.body.spouse || "Off",
		"dep_16_under"	    : req.body.dep_16_under || "Off",
		"dep_17_over"		: req.body.dep_17_over || "Off",
		"total_exemptions"	: req.body.total_exemptions,
		"auth_sig"  		: "xx"

	}
	name = req.body.employee_name; //globally saves name
	pdfFiller.fillForm(sourcePDFTax, destinationPDFTax, data, function(err){
		if(err) throw err;
		console.log("Finished tax form");
	});
	res.redirect('/form-2');
});

//ACH form
app.get('/form-2', function(req, res){
	res.render('form-2');
});

//writes to ACH pdf
app.post('/form-2', function(req, res){
	console.log(req.body);
	console.log(name);
	var data = {
		"banking_institution"	: req.body.bank_name,
		"home_address"			: req.body.home_address,
		"routing_number"		: req.body.routing_number,
		"account_number"		: req.body.account_number,
		"account_type"			: req.body.account_type,
		"name_on_account"		: req.body.name_on_account,
		"name_printed"			: name || "",
		"name_signature"		: "x",
		"date"					: "06/28/2016",
		"phone"					: "123-456-7890",
		"email"					: "x"
	};
	sendTo = req.body.email;
	pdfFiller.fillForm(sourcePDF, destinationPDF, data, function(err){
		if(err) throw err;
		console.log("Finished ACH form");
	});
	res.redirect('/form-3');

});

//receipt upload
app.get('/form-3', function(req, res){
	res.render('form-3');
});


//creates zip file of receipt uploads
//changed --> send emails too
app.post('/form-3', function(req, res){
	//read files
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename){
		console.log("Uploading: " + filename);
		if(filename!==''){
			fstream = fs.createWriteStream(__dirname + '/uploaded-images/' + filename);
			file.pipe(fstream);
		}
	});
	req.busboy.on('finish', function(){
		console.log('Done uploading files.');
	});

	//create zip folder
	var zip = new EasyZip();
	zip.zipFolder('./uploaded-images', function(){
		zip.writeToFile('testing.zip');
	});

	var mailOptions = {
		from: '"Sammi Siegel" <samanthasiegel96@gmail.com>',
		to: "", //sendTo
		subject: 'Intern Reimbursement Form',
		attachments: [{
			filename: 'output-TAX.pdf', 
			path: './output-TAX.pdf', 
			contentType: 'application/pdf'
		}, {
			filename: 'output-ACH.pdf',
			path: "./output-ACH.pdf",
			contentType: 'application/pdf' 
		}, {
			filename: 'receipts.zip',
			path: "./testing.zip"
		}], function(err, info){
			if(err){
				console.log(err);
			} else{
				console.log(info);
			}
		},
		text: 'Here are your forms!'
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err) return console.log(err);
		console.log("Message sent: " + info.response);
	});
	res.redirect('submit');
});

app.get('/form-4', function(req, res){
	res.render('form-4');
});


//after submitting form
app.get('/submit', function(req, res, next){
	res.render('submit');
})


// ===============================
// OLD ROUTES ====================
// ===============================

//form page
app.get('/form', function(req, res){
	res.render('form');
});

//upload receipt photo
app.post('/upload', function(req, res){
	var zip = new EasyZip();
	var fstream;
	req.pipe(req.busboy);
	var arr = [];
	req.busboy.on('field', function(fieldname, val) {
		arr.push(val);
    });
	req.busboy.on('file', function(fieldname, file, filename){
		console.log("Uploading: " + filename);
		fstream = fs.createWriteStream(__dirname + '/uploaded-images/' + filename);

		zip.file('uploaded-images/' + filename, filename);
		zip.writeToFile('text.zip');
		files.push(filename);
		file.pipe(fstream);
	});
	console.log(files);
	res.render('submit');

});

//email / submit
app.get('/test-mail', function(req, res){
	res.render('test-mail');
});

//sends email with attachments
app.post('/test-mail', function(req, res){
	var mailOptions = {
		from: '"Sammi Siegel" <samanthasiegel96@gmail.com>',
		to: "sps27@duke.edu",//"santosjavier22@gmail.com", //sendTo
		subject: 'Intern Reimbursement Form',
		attachments: [{
			filename: 'output-TAX.pdf', 
			path: './output-TAX.pdf', 
			contentType: 'application/pdf'
		}, {
			filename: 'output-ACH.pdf',
			path: "./output-ACH.pdf",
			contentType: 'application/pdf' 
		}, {
			filename: 'receipts.zip',
			path: "./testing.zip"
		}], function(err, info){
			if(err){
				console.log(err);
			} else{
				console.log(info);
			}
		},
		text: 'Here are your forms!'
	};
	transporter.sendMail(mailOptions, function(err, info){
		if(err) return console.log(err);
		console.log("Message sent: " + info.response);
	});

	//removes directory --> reset image uploads
	/*rmdir('./uploaded-images', function(err, dirs, files){
		if(err) throw err;
		console.log(dirs);
		console.log(files);
		console.log('all files are removed.');
	});*/
});

//test form UI
app.get('/personal-info', function(req, res){
	res.render('personal-info');
});

// ==================================
// RUN APP ==========================
// ==================================

//run application
app.listen(port);
console.log('Go to port ' + port);