const transporter = require('../config/mail')

exports.sendReadyNotification = async (customerEmail, serviceData) => {
  try {
    const mailOptions = {
      from: `"TechService" <${process.env.EMAIL_USER}>`,
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
              #${serviceData.tracking_code}
            </div>
            
            <p style="margin-top: 25px; font-size: 13px; line-height: 1.5;">Silakan kunjungi toko kami dengan membawa kode tracking di atas untuk pengambilan unit.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            &copy; 2026 TechService.
          </div>
        </div>
      `
    }

    return await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error('Gagal mengirim email: ' + error.message)
  }
}