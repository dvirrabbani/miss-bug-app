import { Link } from "react-router-dom"
import { BugPreview } from "./BugPreview"
import userService from "../../services/user"

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  function shouldShowActionBtns(bug) {
    const user = userService.getLoggedinUser()
    if (!user) return false
    if (user.isAdmin) return true
    return bug.owner?._id === user._id
  }
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {shouldShowActionBtns && (
            <section className="bug-btn-actions">
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                x
              </button>
              <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button>
            </section>
          )}
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
