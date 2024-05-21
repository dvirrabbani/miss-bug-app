import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { showErrorMsg } from "../../services/event-bus.service"
import userService from "../../services/user"
import { BugList } from "../bug/BugList"

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
      <h2>username : {user.username}</h2>
      <h2>full name : {user.fullname}</h2>
    </div>
  )
}
