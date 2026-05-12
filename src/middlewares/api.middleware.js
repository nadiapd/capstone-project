const Response = require('../helpers/response.helper')
// const Key = process.env.API_KEY

module.exports = async (req, res, next) => {
  try {
    next()
    // const authorization =
    //   req.headers['authorization']

    // if (
    //   authorization &&
    //   authorization === Key
    // ) {

    //   return next()
    // }

    // return Response.error(
    //   res,
    //   403,
    //   'access denied.'
    // )

  } catch (err) {
    return Response.error(
      res,
      500,
      err.message
    )
  }
}