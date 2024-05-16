import { Link } from "react-router-dom"

export function BugPreview({ bug }) {
  return (
    <article>
      <h4>{bug.title}</h4>
      <h1>🐛</h1>
      {bug.owner && (
        <h4>
          Owner: <Link to={`/user/${bug.owner._id}`}>{bug.owner.fullname}</Link>{" "}
        </h4>
      )}
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
    </article>
  )
}
