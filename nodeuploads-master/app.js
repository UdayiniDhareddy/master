const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser')
const mysql      = require('mysql');
const app = express();
const upload =multer({dest:'uploads/'})
var generator = require('generate-password');
var nodemailer = require('nodemailer');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'users'
});
 
connection.connect(function(err){
	console.log('connected')
	if(err) throw err;
});

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "*");
  return next();
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




var password = generator.generate({
  length: 10,
  numbers: true
});
// Public Folder
app.use(express.static('./public'));

// app.get('/', (req, res) => res.render('index'));
app.post('/upload', upload.single('image'), (req, res) => {
   let filepath= `uploads/${req.file.filename}`
   console.log(req.file.filename)
   let name = req.body.name
   let email = req.body.email
   let address = req.body.address

var sql = `INSERT INTO user (name, email, image, address ) VALUES ('${name}', '${email}', '${filepath}', '${address}' )`;
console.log(sql)
 connection.query(sql,
   function(err,result){  
     console.log(result.insertId)
     let userId= `${name}${result.insertId}`
     console.log(userId)
     res.status(201).send({userID :userId, password : password})
     
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
   //port: 465,
   secure: false, 
  // service: 'gmail',
  auth: {
    user: 't73958048@gmail.com',
    pass: 'test@12345'
  }
});
var mailOptions = {
  from: 't73958048@gmail.com',
  to: 'udayinireddy53@gmail.com',
  subject: 'Posted data',
  text: `userId is ${userId}, password is ${password}`
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
   })    
   

});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
