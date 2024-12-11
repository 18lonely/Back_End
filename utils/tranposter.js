let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'pham03hoan@gmail.com',
      pass: 'tggkpadzkzmgpyqh'
    }
})

const sendMail = (to, sub, message) => {
    transporter.sendMail({
        to: to,
        subject: sub,
        html: message
    })
}

module.exports = sendMail