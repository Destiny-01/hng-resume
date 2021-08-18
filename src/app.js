const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "../src"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { req });
});

app.post("/contact", async (req, res) => {
  const nodemailerObject = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS,
    },
  };
  const transporter = nodemailer.createTransport(nodemailerObject);
  let mailList = `${process.env.NODE_MAILER_FROM}, ${req.body.email}`;
  const text = `Hello, I have recieved your mail and will be in touch shortly. But here is what you sent
    Name: ${req.body.name} 
    Email: ${req.body.email}
    Message: ${req.body.message}.

    Thank you and expect a response soon`;

  const html = `<p>Hello, <br /><br /> I have recieved your mail and will be in touch shortly. But here is what you sent <br /><br />
    Name: ${req.body.name} <br />
    Email: ${req.body.email} <br />
    Message: ${req.body.message}. <br /><br />

    Thank you and expect a response soon</p>`;
  await transporter.sendMail(
    {
      from: process.env.NODE_MAILER_FROM,
      to: mailList,
      subject: "Your contact form",
      text: text,
      html: html,
    },
    (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Email sent: " + info.response);
      }
      req.status = "success";
      req.message =
        "Thank you. I have recieved your mail and also sent you a copy of your response";
      res.render("index", { req });
    }
  );
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
