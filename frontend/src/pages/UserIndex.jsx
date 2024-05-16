import { useEffect, useState } from "react"
import userService from "../services/user"
import { UserList } from "../cmps/user/UserList"

export function UserIndex() {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const users = await userService.query()
      setUsers(users)
    } catch (err) {
      console.log("Had issues loading Users", err)
    }
  }

  if (!users) {
    return "loading..."
  }

  return (
    <div className="user-index">
      <UserList users={users} />
    </div>
  )
}
