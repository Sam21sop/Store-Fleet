// Import the necessary modules here
import nodemailer from "nodemailer";
import { ErrorHandler } from "../errorHandler.js";
import processEnvVar from "../processDotEnv.js";
import fs from "fs";
import path from 'path';


const welcomeTemplatePath = path.resolve("backend", "public", 'welcomeTemplate.html');
const logoPath = path.resolve("backend", "public", 'logo.png');



export const sendWelcomeEmail = async (user) => {
  // create nodemailer transporter using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:processEnvVar.STORFLEET_SMPT_MAIL,
      pass:processEnvVar.STORFLEET_SMPT_MAIL_PASSWORD
      // user: "dollyaggarwal1712@gmail.com",
      // pass: "irxd zagn dtur lpkh",
    },
  });

  // read the html templates
  const htmlTemplate = fs.readFileSync(welcomeTemplatePath, 'utf-8');
  const personalizedHtml = htmlTemplate.replace('${user.name}', user.name);

  // define mail options
  const mailOptions = {
    // from: "dollyaggarwal1712@gmail.com",
    from:processEnvVar.STORFLEET_SMPT_MAIL,
    to: user.email,
    subject: "Welcome To Storefleet",
    html: personalizedHtml,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo', // Content ID for embedding in the HTML
      },
    ],
  };

  // Send the email
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email send failed with error:" + err);
    new ErrorHandler(501, err);
  }
};
