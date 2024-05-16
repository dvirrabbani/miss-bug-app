import { Link } from "react-router-dom"

export function UserList({ users }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li className="user-preview" key={user._id}>
          <Link to={`/user/${user._id}`}>{user.fullname}</Link>
        </li>
      ))}
    </ul>
  )
}
