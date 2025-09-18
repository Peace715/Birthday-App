require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/User");
const routes = require("./routes/userRoutes");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

mongoose.connect("mongodb://127.0.0.1:27017/birthdayDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD 
  }
});

cron.schedule("0 7 * * *", async () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  const users = await User.find();
  users.forEach(user => {
    const userDay = user.dob.getDate();
    const userMonth = user.dob.getMonth() + 1;

    if (day === userDay && month === userMonth) {
      const mailOptions = {
  from: process.env.EMAIL,
  to: user.email,
  subject: `🎂 Happy Birthday, ${user.username}! 🎉`,
  html: `
  <div style="font-family: Arial, sans-serif; background-color:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding:20px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:28px;">🎉 Happy Birthday!</h1>
      </div>
      
      <!-- Body -->
      <div style="padding:30px; text-align:center;">
        <h2 style="color:#333;">Dear ${user.username},</h2>
        <p style="font-size:16px; color:#555; line-height:1.6;">
          Wishing you a day filled with love, laughter, and happiness.  
          May this year bring you closer to your dreams. 🌟
        </p>
        <p style="font-size:18px; font-weight:bold; color:#6a11cb;">
          🎂 Cheers to another amazing year ahead!
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background:#f1f3f6; padding:15px; text-align:center; font-size:13px; color:#777;">
        <p>💌 Sent with love from <b>Birthday Reminder App</b></p>
      </div>
      
    </div>
  </div>
  `
};
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return console.log("Error sending email: " + error);
            }
            console.log("Email sent: " + info.response);
        });
    }
  });
});


module.exports = app;