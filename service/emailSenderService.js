const nodemailer = require("nodemailer");


const sendMail = async(email, subject,emailMessage)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: process.env.EMAIL_PORT, 
        secure:true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
})

const info = await transporter.sendMail({
    from: "kubi Service <kubi.software@gmail.com>",
    to: email,
    subject:subject,
    html:emailMessage
})

console.log("Message sent " + info.messageId); 
}

module.exports = {
    sendMail
}