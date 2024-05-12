import { useState } from "react"
import { useForm } from "../../customHooks/useForm"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { userService } from "../../services/user.service.local"

export function LoginSignup({ onSetUser }) {
  const [isSignup, setIsSignup] = useState(false)

  const [credentials, handleChange] = useForm(userService.getEmptyCredentials())

  async function login(credentials) {
    try {
      const user = await userService.login(credentials)
      if (user) {
        onSetUser(user)
        showSuccessMsg("Logged in successfully")
      } else {
        showErrorMsg("Unable to login")
      }
    } catch (err) {
      showErrorMsg("Unable to login")
    }
  }

  async function signup(credentials) {
    try {
      const user = await userService.signup(credentials)
      onSetUser(user)
      showSuccessMsg("signup successfully")
    } catch (err) {
      showErrorMsg("Unable to signup")
    }
  }

  function toggleIsSignup() {
    setIsSignup((prevIsSignup) => !prevIsSignup)
  }

  function onSubmit(ev) {
    ev.preventDefault()
    isSignup ? signup(credentials) : login(credentials)
  }

  return (
    <div className="login-signup">
      <form onSubmit={onSubmit}>
        {/* User name */}
        <div className="form-group">
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        {/* User password */}
        <div className="form-group">
          <label htmlFor="password">password</label>
          <input
            type="text"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {/*User fullname */}
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullname">fullname</label>
              <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
        <button>{isSignup ? "signup" : "login"}</button>
      </form>
      {isSignup ? (
        <p>
          Already a member? <u onClick={toggleIsSignup}>login</u>
        </p>
      ) : (
        <p>
          New user? <u onClick={toggleIsSignup}>signup</u> here
        </p>
      )}
    </div>
  )
}
