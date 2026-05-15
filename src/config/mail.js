const dns = require('dns')
dns.setDefaultResultOrder('ipv4first')
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
  port: 587, //587 //2525 gak bisa dilocal
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  tls: {
    rejectUnauthorized: false,
    family: 4
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