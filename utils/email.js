const nodemailer = require('nodemailer');

const sendEmail = async(option) => {
    const transporter = nodemailer.createTransport({
        // host: 'Gmail', 'yahoo', outlook',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // Define email options
    const emailOptions = {
        from: 'kingzaza<egbuogublessed01@gmail.com',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;