const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
//   host: 'smtp-mail.outlook.com', // Server SMTP Outlook
//   port: 587,                     // Port sesuai data yang kamu temukan
//   secure: false,                 // false karena menggunakan STARTTLS (Port 587)
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     ciphers: 'SSLv3',            // Kompatibilitas dengan server Microsoft
//     rejectUnauthorized: false
//   }
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Verifikasi koneksi saat server jalan (Opsional)
transporter.verify((error, success) => {
  if (error) {
    console.log('Koneksi Email Gagal: ', error)
  } else {
    console.log('Server Email Siap Mengirim Notifikasi')
  }
})

module.exports = transporter