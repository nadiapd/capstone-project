// exports.generateTrackingCode = () => {
//   const random = Math.floor(1000 + Math.random() * 9000)
//   return `SRV-${Date.now()}-${random}`
// }

exports.generateTrackingCode = (countToday = 0) => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yyyymmdd = `${yyyy}${mm}${dd}`

  const sequence = String(countToday + 1).padStart(4, '0')

  return `SRV-${yyyymmdd}-${sequence}`
}