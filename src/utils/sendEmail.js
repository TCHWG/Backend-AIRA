const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
        family:4,
    });

    const mailOptions = {
        from: "AIRA APPLICATION",
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
