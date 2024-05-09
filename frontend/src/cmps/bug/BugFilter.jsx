import React, { useEffect } from "react"
import { useForm } from "../../customHooks/useForm"

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, handleChange] = useForm(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  return (
    <section className="bug-filter">
      <h2>Filter</h2>
      <form>
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
      </form>
    </section>
  )
}
