import fs from "fs"
import { utilService } from "../../services/util.service.js"

const users = utilService.readJsonFile("data/user.json")

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername,
  add,
}

async function query() {
  try {
    return users
  } catch (error) {
    throw error
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId)
    return user
  } catch (error) {
    throw error
  }
}

async function remove(userId) {
  try {
    const userIdx = users.findIndex((user) => user._id === userId)
    users.splice(userIdx, 1)
    _saveUsersToFile()
  } catch (error) {
    throw error
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const idx = users.findIndex((user) => user._id === userToSave._id)
      if (idx < 0) throw `Cant find user with _id ${userToSave._id}`
      users[idx] = userToSave
    } else {
      userToSave._id = utilService.makeId()
      userToSave.createdAt = Date.now()
      users.push(userToSave)
    }
    await _saveUsersToFile()
    return userToSave
  } catch (error) {
    throw error
  }
}

async function getByUsername(username) {
  try {
    const user = users.find((user) => user.username === username)
    return user
  } catch (error) {
    throw error
  }
}

async function add(user) {
  try {
    // Validate that there are no such user:
    const existUser = await getByUsername(user.username)
    if (existUser) throw new Error("Username taken")

    // peek only updatable fields!
    const userToAdd = {
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      score: user.score || 0,
    }
    // const collection = await dbService.getCollection("user")
    // await collection.insertOne(userToAdd)
    save(userToAdd)
    return userToAdd
  } catch (err) {
    loggerService.error("cannot insert user", err)
    throw err
  }
}

function _saveUsersToFile(path = "./data/user.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
