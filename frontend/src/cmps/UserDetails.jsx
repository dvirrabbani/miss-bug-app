import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { showErrorMsg } from "../services/event-bus.service"
import userService from "../services/user"

export function UserDetails() {
  const [user, setUser] = useState(null)
  const { userId } = useParams()

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const user = await userService.getById(userId)
      setUser(user)
    } catch (err) {
      showErrorMsg("Cannot load user")
    }
  }

  if (!user) {
    return "loading..."
  }
  return (
    <div className="user-details">
      <h1>User</h1>
      <h2>Username: {user.username}</h2>
      <h3>full name: {user.fullname}</h3>
    </div>
  )
}
