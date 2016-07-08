// =========================================
// SET UP APP ==============================
// =========================================
// Uses express router; sets port

var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

// =========================================
// VIEW ENGINE =============================
// =========================================
// Creates handlebars engine

var handlebars = require('express-handlebars')
	.create({ 
		defaultLayout:'main.handlebars',
		path: 'views',
		partialsPath: 'views/partials' 
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


// =========================================
// MIDDLEWARE ==============================
// =========================================
// Implements necessary npm packages

// logs HTTP requests and responses to console
// used for development/debugging
var logger = require('morgan'); 
app.use(logger('dev'));

// get image uploads from HTML form
var busboy = require('connect-busboy'); 
var fs = require('fs'); 
app.use(busboy());

// get text input from HTML forms
var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var path = require('path'); // TODO: is this necessary?

// fills pdf fields
var pdfFiller = require('pdffiller');

// source/output for pdfs
var sourcePDF = "final-ACH.pdf";
var destinationPDF =  "output-ACH.pdf";
var sourcePDFTax = "final-TAX.pdf";
var destinationPDFTax =  "output-TAX.pdf";

// configures email
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
	service: 'gmail',
	auth: {
		user: 'samanthasiegel96@gmail.com',
		pass: 'August81996!'
	}
}));

// zips folder for receipt upload
var EasyZip = require('easy-zip2').EasyZip;

//remove directory
//TODO: find a better way to do this
var rmdir = require('rmdir');


// =================================
// ROUTES ========================== 
// =================================

//TODO: put all routes into route.js file
//var routes = require('./app/routes.js')(app, router);



//home page
app.get('/', function(req, res){
	res.render('home', {layout:false});
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
	address = req.body.employee_address;
	phone = req.body.employee_phone;
	email = req.body.employee_email;
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
		"home_address"			: address,
		"routing_number"		: req.body.routing_number,
		"account_number"		: req.body.account_number,
		"account_type"			: req.body.account_type,
		"name_on_account"		: req.body.name_on_account,
		"name_printed"			: name || "",
		"name_signature"		: "x",
		"date"					: "06/28/2016",
		"phone"					: phone,
		"email"					: email
	};
	pdfFiller.fillForm(sourcePDF, destinationPDF, data, function(err){
		if(err) throw err;
		console.log("Finished ACH form");
	});
	res.redirect('/form-4');

});

//expense form
app.get('/form-4', function(req, res){
	res.render('form-4');
});

app.post('/form-4', function(req, res){
	console.log(name, phone, address, email);
	res.redirect('form-3');
	var arr = [];
	arr.push(req.body.exp_date || "");
	arr.push(req.body.exp_date_2 || "");
	arr.push(req.body.exp_date_3 || "");
	arr.push(req.body.exp_date_4 || "");

	arr.push(req.body.exp_location || "");
	arr.push(req.body.exp_location_2 || "");
	arr.push(req.body.exp_location_3 || "");
	arr.push(req.body.exp_location_4 || "");

	arr.push(req.body.exp_airfare || "");
	arr.push(req.body.exp_airfare_2 || "");
	arr.push(req.body.exp_airfare_3 || "");
	arr.push(req.body.exp_airfare_4 || "");

	arr.push(req.body.exp_lodging || "");
	arr.push(req.body.exp_lodging_2 || "");
	arr.push(req.body.exp_lodging_3 || "");
	arr.push(req.body.exp_lodging_4 || "");

	arr.push(req.body.exp_meals || "");
	arr.push(req.body.exp_meals_2 || "");
	arr.push(req.body.exp_meals_3 || "");
	arr.push(req.body.exp_meals_4 || "");

	arr.push(req.body.exp_auto_miles || "");
	arr.push(req.body.exp_auto_miles_2 || "");
	arr.push(req.body.exp_auto_miles_3 || "");
	arr.push(req.body.exp_auto_miles_4 || "");
	arr.push(name);
	arr.push(phone);
	arr.push(address);
	arr.push(email);

	console.log("SIZE IS " + arr.length);
	console.log(arr);

	var runner = require("child_process");

    var phpScriptPath = "welcome.php";

    var receipts = arr.join(); 

    runner.exec("php " + phpScriptPath + " " +receipts, function(err, phpResponse, stderr) {
        if(err) console.log(err); /* log error */
    console.log( "In here man" + phpResponse );
    });
})

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
		to: email, //sendTo
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
			filename: 'output-Expense.xlsx',
			path: "./ExpenseCopy1.xlsx",
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

app.get('/home-test', function(req, res){
	res.render('home-test', {layout:false});
});

// ==================================
// RUN APP ==========================
// ==================================

//run application
app.listen(port);
console.log('Go to port ' + port);