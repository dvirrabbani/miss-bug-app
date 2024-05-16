import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"

export function requireAuth(req, res, next) {
  const { loginToken } = req.cookies
  const loggedinUser = authService.validateToken(loginToken)
  if (!loggedinUser) {
    res.status(401).send({ error: "Not logged in" })
    return
  }
  req.loggedinUser = loggedinUser

  next()
}

export function requireAdmin(req, res, next) {
  const { loggedinUser } = req
  if (!loggedinUser?.isAdmin) {
    loggerService.warn(
      `user _id "${loggedinUser?._id}" attempted to perform admin action`
    )
    res.status(403).send("Not Authorized")
    return
  }

  next()
}
