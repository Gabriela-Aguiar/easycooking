const template = require("../templates/welcomeTemplate");
const resetTemplate = require("../templates/resetTemplate");
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, subject, text, html, username, id) {
  if (html === "welcome") {
    html = template(username);
  } else if (html === "reset") {
    html = resetTemplate(username);
  }
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  let info = await transporter.sendMail({
    from: "easycooking.app2020@gmail.com",
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail