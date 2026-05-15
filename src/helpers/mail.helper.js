const transporter = require('../config/mail')

exports.sendReadyNotification = async (customerEmail, serviceData) => {
  try {
    const mailOptions = {
      // from: `"TechService" <${process.env.EMAIL_USER}>`,
      from: 'TechService <techservice@nadiapd.com>',
      to: customerEmail,
      subject: `[SIAP AMBIL] Unit #${serviceData.tracking_code} Selesai Diperbaiki`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 25px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Unit Siap Diambil!</h1>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p>Halo <b>${serviceData.customer_name}</b>,</p>
            <p>Unit perangkat Anda telah selesai kami tangani dengan detail sebagai berikut:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #64748b; padding-bottom: 5px;">Perangkat</td>
                  <td style="text-align: right; font-weight: bold;">${serviceData.device_name}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Total Biaya</td>
                  <td style="text-align: right; font-weight: bold; color: #2563eb;">Rp${new Intl.NumberFormat('id-ID').format(serviceData.total_cost)}</td>
                </tr>
              </table>
            </div>

            <p style="text-align: center; margin-bottom: 5px; font-size: 12px; color: #64748b;">KODE TRACKING</p>
            <div style="text-align: center; background: #eff6ff; padding: 10px; border: 2px dashed #2563eb; border-radius: 10px; font-size: 18px; font-weight: bold; color: #1e293b;">
              ${serviceData.tracking_code}
            </div>
            
            <p style="margin-top: 25px; font-size: 13px; line-height: 1.5;">Silakan kunjungi toko kami dengan membawa kode tracking di atas untuk pengambilan unit.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            &copy; 2026 TechService.
          </div>
        </div>
      `
    }

    // use nodemailer smtp
    // return await transporter.sendMail(mailOptions)
    
    // use resend
    return await transporter.emails.send(mailOptions)
  } catch (error) {
    throw new Error('Gagal mengirim email: ' + error.message)
  }
}

exports.sendNewServiceNotification = async (customerEmail, serviceData) => {
  try {
    const mailOptions = {
      // from: `"TechService" <${process.env.EMAIL_USER}>`,
      from: 'TechService <techservice@nadiapd.com>',
      to: customerEmail,
      subject: `[TANDA TERIMA] Registrasi Servis #${serviceData.tracking_code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; padding: 25px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px; letter-spacing: 1px;">Tanda Terima Servis</h1>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p>Halo <b>${serviceData.customer_name}</b>,</p>
            <p>Unit perangkat Anda telah kami terima dan akan segera masuk ke tahap antrean pengecekan. Berikut adalah detail registrasi Anda:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0; border: 1px solid #f1f5f9;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="color: #64748b; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Perangkat</td>
                  <td style="text-align: right; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${serviceData.device_name}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Estimasi Biaya</td>
                  <td style="text-align: right; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">Rp${new Intl.NumberFormat('id-ID').format(serviceData.estimated_price)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 8px 0;">Deskripsi</td>
                  <td style="text-align: right; color: #475569; padding: 8px 0;">${serviceData.note}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 25px;">
              <p style="text-align: center; margin-bottom: 5px; font-size: 12px; color: #64748b;">KODE TRACKING ANDA</p>
              <div style="text-align: center; background: #eff6ff; padding: 10px; border: 2px dashed #2563eb; border-radius: 10px; font-size: 18px; font-weight: bold; color: #1e293b;">
                ${serviceData.tracking_code}
              </div>
            </div>
            <div style="margin-top: 30px; text-align: center;">
               <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">Pantau progres perbaikan unit Anda secara real-time melalui website kami:</p>
               <a href="${process.env.APP_URL}/track" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: bold;">LACAK UNIT SEKARANG</a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">Harap simpan email ini sebagai bukti tanda terima unit.</p>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 5px;">&copy; 2026 TechService.</p>
          </div>
        </div>
      `
    }

    // use nodemailer smtp
    // return await transporter.sendMail(mailOptions)
    
    // use resend
    return await transporter.emails.send(mailOptions)
  } catch (error) {
    throw new Error('Gagal mengirim email tanda terima: ' + error.message)
  }
}

exports.sendAdminWelcomeEmail = async (targetEmail, data) => {
  try {
    const mailOptions = {
      // from: `"TechService Admin" <${process.env.EMAIL_USER}>`,
      from: 'TechService Admin <techservice@nadiapd.com>',
      to: targetEmail,
      subject: '[AKSES ADMIN] Akun Baru TechService',
      html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 25px; text-align: center; color: white;">
          <h2 style="margin: 0;">Selamat Datang!</h2>
        </div>
        <div style="padding: 30px; color: #1e293b;">
          <p>Halo <b>${data.name}</b>,</p>
          <p>Akun administrator Anda telah berhasil dibuat. Gunakan kredensial di bawah ini untuk masuk ke dashboard:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><b>Email:</b> ${data.email}</p>
            <p style="margin: 0; font-size: 14px;"><b>Password:</b> <code style="background: #eee; padding: 2px 6px; border-radius: 4px;">${data.password}</code></p>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
            Demi keamanan, segera ganti password Anda setelah berhasil masuk melalui menu <b>Ganti Password</b>.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.login_url}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">MASUK KE DASHBOARD</a>
          </div>
        </div>
      </div>
    `
    }
  
    // use nodemailer smtp
    // return await transporter.sendMail(mailOptions)
    
    // use resend
    return await transporter.emails.send(mailOptions)
  } catch (error) {
    throw new Error('Gagal mengirim email tanda terima: ' + error.message)
  }
}