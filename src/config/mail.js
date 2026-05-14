const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  // Outlook
  // host: 'smtp-mail.outlook.com',
  // port: 587,
  // secure: false,
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS
  // },
  // tls: {
  //   ciphers: 'SSLv3',
  //   rejectUnauthorized: false
  // }

  // Gmail
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log('Koneksi Email Gagal: ', error)
  } else {
    console.log('Server Email Siap Mengirim Notifikasi')
  }
})

module.exports = transporter