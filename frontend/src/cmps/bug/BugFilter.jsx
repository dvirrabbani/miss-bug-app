import React, { useEffect } from "react"
import { useForm } from "../../customHooks/useForm"

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, handleChange] = useForm(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  return (
    <section className="bug-filter">
      <h3>Filter</h3>
      <div className="col">
        <div className="form-group">
          <label htmlFor="txt">Text</label>
          <input
            type="text"
            id="txt"
            name="txt"
            onChange={handleChange}
            value={filterByToEdit.txt}
          />
        </div>
        <div className="form-group">
          <label htmlFor="minSeverity">Minium Severity</label>
          <input
            type="number"
            id="minSeverity"
            min={1}
            name="minSeverity"
            value={filterByToEdit.minSeverity}
            onChange={handleChange}
          />
        </div>
      </div>
      <h3>Sort</h3>
      <div className="col">
        <div className="form-group">
          <select
            name="sortBy"
            value={filterByToEdit.sortBy}
            onChange={handleChange}
          >
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="severity">Severity</option>
            <option value="createdAt">Date</option>
          </select>
        </div>
        <div className="form-group">
          <select
            name="sortDir"
            value={filterByToEdit.sortDir}
            onChange={handleChange}
          >
            <option value="">Order</option>
            <option value="1">Ascending</option>
            <option value="-1">Descending</option>
          </select>
        </div>
      </div>
    </section>
  )
}
