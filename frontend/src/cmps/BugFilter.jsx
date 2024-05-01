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
        <label htmlFor="txt">Text</label>
        <input
          type="text"
          id="txt"
          placeholder="Search by text"
          name="txt"
          onChange={handleChange}
          value={filterByToEdit.txt}
        />
      </div>
      <div className="form-group">
        <label htmlFor="minSeverity">Severity</label>
        <input
          type="number"
          id="minSeverity"
          min={0}
          name="minSeverity"
          value={filterByToEdit.minSeverity || 0}
          onChange={handleChange}
        />
      </div>

      <button>Filter</button>
    </form>
  )
}
