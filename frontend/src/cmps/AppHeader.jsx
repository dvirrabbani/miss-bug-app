import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { LoginSignup } from "./bug/LoginSignup"
import { showErrorMsg } from "../services/event-bus.service"
import { userService } from "../services/user.service.local"

export function AppHeader() {
  const navigate = useNavigate()
  const [user, setUser] = useState(userService.getLoggedinUser())

  async function onLogout() {
    try {
      await userService.logout()
      onSetUser(null)
    } catch (err) {
      showErrorMsg("Try again")
    }
  }
  function onSetUser(user) {
    setUser(user)
    navigate("/")
  }

  return (
    <header className="app-header container">
      <div className="header-container">
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/about">About</NavLink>
        </nav>
        <h1>Bugs are Forever</h1>
      </div>
      {/* Login/Signup/Logout */}
      {user ? (
        <section>
          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </section>
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
    </header>
  )
}
