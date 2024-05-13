import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"

export function useAuth(options) {
  // Return middleware function
  return function (req, res, next) {
    const { loginToken } = req.cookies

    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) {
      res.status(401).send({ error: "Not logged in" })
      return
    }

    loggerService.info("loggedin user", loggedinUser)
    req.loggedinUser = loggedinUser

    if (options?.isAdmin) {
      validateAdmin(req, res, next)
    } else {
      next()
    }
  }
}

export function validateAdmin(req, res, next) {
  const { loggedinUser } = req
  if (!loggedinUser?.isAdmin) {
    loggerService.warn(
      "user id" + loggedinUser?._id + " attempted to perform admin action"
    )
    res.status(403).send("Not Authorized")
    return
  }

  next()
}
