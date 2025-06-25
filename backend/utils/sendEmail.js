import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"VeriFy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };
 
  await transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error:", error);
  } else {
    console.log("It works yipeeee!");
  }
});

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
