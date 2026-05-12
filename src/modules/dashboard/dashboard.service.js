const ServiceModel = require('../service/service.model')

exports.analytics = async () => {
  const totalService = await ServiceModel.count()

  const completedService = await ServiceModel.count({
    where: {
      status: 'completed'
    }
  })

  const pendingService = await ServiceModel.count({
    where: {
      status: 'pending'
    }
  })

  const checkingService = await ServiceModel.count({
    where: {
      status: 'checking'
    }
  })

  const repairingService = await ServiceModel.count({
    where: {
      status: 'repairing'
    }
  })

  return {
    totalService,
    completedService,
    pendingService,
    checkingService,
    repairingService
  }
}