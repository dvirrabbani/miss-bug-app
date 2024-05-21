import { userService } from "./user.service.js"
import { loggerService } from "../../services/logger.service.js"

export async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.send(users)
  } catch (err) {
    loggerService.error("Failed to get users", err)
    res.status(400).send({ err: "Failed to get users" })
  }
}

export async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.userId)
    delete user.password
    res.send(user)
  } catch (err) {
    loggerService.error("Failed to get user", err)
    res.status(400).send({ err: "Failed to get user" })
  }
}

export async function removeUser(req, res) {
  try {
    await userService.remove(req.params.userId)
    res.send({ msg: "Deleted successfully" })
  } catch (err) {
    loggerService.error("Failed to delete user", err)
    res.status(400).send({ err: "Failed to delete user" })
  }
}

export async function updateUser(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.update(user)
    res.send(savedUser)
  } catch (err) {
    loggerService.error("Failed to update user", err)
    res.status(400).send({ err: "Failed to update user" })
  }
}

export async function addUser(req, res) {
  const { fullname, username, password, score } = req.body
  const userToAdd = { fullname, username, password, score: +score }
  try {
    const savedUser = await userService.add(userToAdd)
    res.send(savedUser)
  } catch (err) {
    loggerService.error("Failed to add user", err)
    res.status(400).send({ err: "Failed to add user" })
  }
}
