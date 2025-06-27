const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function emailHelper(receiverEmail, creds, templateName, subject = "BookMyShow Email") {
  const templatePath = path.join(__dirname, "email_template", templateName);
  const source = fs.readFileSync(templatePath, "utf8");

  const template = handlebars.compile(source);
  const htmlBody = template(creds); // creds has all values

  const emailDetails = {
    from: '"BookMyShow" <bookmyshow@gmail.com>',
    to: receiverEmail,
    subject,
    html: htmlBody,
  };

  await transporter.sendMail(emailDetails);
}

module.exports = emailHelper;
