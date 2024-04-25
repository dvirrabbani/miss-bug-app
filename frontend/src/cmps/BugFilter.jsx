import React from "react"
import { useForm } from "../customHooks/useForm"

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, handleChange] = useForm(filterBy)

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  return (
    <form className="bug-filter" onSubmit={onSubmitFilter}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Search by title"
          name="title"
          onChange={handleChange}
          value={filterByToEdit.title}
        />
      </div>
      <div className="form-group">
        <label htmlFor="severity">Severity</label>
        <input
          type="number"
          id="severity"
          min={0}
          name="severity"
          placeholder="Search by severity"
          value={filterByToEdit.severity || ""}
          onChange={handleChange}
        />
      </div>

      <button>Filter</button>
    </form>
  )
}
