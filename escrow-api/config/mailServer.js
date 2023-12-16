const nodemailer = require("nodemailer");
const config = require("config");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: config.get("user"),
    pass: config.get("pass"),
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log(`Mail Transponder Connected - Server is ready to messages`.yellow.bold);
  }
});

module.exports = transporter;
