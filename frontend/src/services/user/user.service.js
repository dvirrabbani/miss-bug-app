import { httpService } from "../http.service"

const AUTH_BASE_URL = "/auth"
const USER_BASE_URL = "/user"
const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"

export const _userService = {
  login,
  signup,
  logout,
  getLoggedinUser,
  getEmptyCredentials,
  getById,
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function signup({ username, password, fullname }) {
  try {
    const user = await httpService.post(AUTH_BASE_URL + "/signup", {
      username,
      password,
      fullname,
    })
    if (user) {
      return _setLoggedinUser(user)
    }
  } catch (err) {
    console.log(err)
  }
}

async function login({ username, password }) {
  try {
    const user = await httpService.post(AUTH_BASE_URL + "/login", {
      username,
      password,
    })

    if (user) {
      return _setLoggedinUser(user)
    }
  } catch (err) {
    console.log(err)
  }
}

async function logout() {
  try {
    await httpService.post(AUTH_BASE_URL + "/logout")
  } catch (err) {
    console.log(err)
  }
}

async function getById(userId) {
  try {
    return await httpService.get(USER_BASE_URL + "/" + userId)
  } catch (err) {
    console.log(err, "unable to load user")
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
