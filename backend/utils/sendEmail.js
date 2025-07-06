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

export const sendStatusEmail = async (to, status) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use Mailtrap/SendGrid/etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = `Your Application To be a Reporter Was ${status}`;
  const html = `
    <p>Hello,</p>
    <p>Your application to become a reporter has been <strong>${status}</strong>.</p>
    <p>Thank you for your interest.</p>
    <p>Your dashboard will be updated in the next few hours, thank you for your patience.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"VeriFy Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};


export default sendEmail;
