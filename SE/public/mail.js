var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iit2021178@iiita.ac.in',
    pass: 'Pranav@c2'
  }
});

var mailOptions = {
  from: 'iit2021178@iiita.ac.in',
  to: 'pranavsurabhi15@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});