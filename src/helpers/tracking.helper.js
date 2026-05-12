exports.generateTrackingCode = () => {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `SRV-${Date.now()}-${random}`
}