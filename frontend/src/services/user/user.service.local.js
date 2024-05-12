import { storageService } from "../async-storage.service"

const STORAGE_KEY_DB = "userDB"
const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"

export const _userService = {
  login,
  signup,
  logout,
  getById,
  getLoggedinUser,
  getEmptyCredentials,
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function signup({ username, password, fullname }) {
  try {
    const userToSignup = { username, password, fullname }
    const user = await storageService.post(STORAGE_KEY_DB, userToSignup)
    if (user) {
      return _setLoggedinUser(user)
    }
  } catch (err) {
    console.log(err)
  }
}

async function login({ username, password }) {
  try {
    const users = await storageService.get(STORAGE_KEY_DB)
    const user = users.find(
      (user) => user.username === username && user.password === password
    )
    if (user) {
      return _setLoggedinUser(user)
    }
  } catch (err) {
    console.log(err)
  }
}

async function getById(userId) {
  try {
    const user = await storageService.get(STORAGE_KEY_DB, userId)
    delete user.password
    return user
  } catch (err) {
    console.log(err)
  }
}

async function logout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  } catch (err) {
    console.log(err)
  }
}

function getEmptyCredentials() {
  return {
    username: "",
    password: "",
    fullname: "",
  }
}

function _setLoggedinUser(user) {
  const userToSave = { _id: user._id, fullname: user.fullname }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
  return userToSave
}
