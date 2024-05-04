import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/bug/BugList.jsx"
import { useState } from "react"
import { useEffect } from "react"
import { BugFilter } from "../cmps/bug/BugFilter.jsx"
import { useSearchParams } from "react-router-dom"

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )

  useEffect(() => {
    updateFilterBy()
  }, [searchParams])

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  async function loadBugs() {
    try {
      const bugs = await bugService.query(filterBy)
      setBugs(bugs)
    } catch (error) {
      console.log("Had issues loading robots", error)
    }
  }

  function updateFilterBy() {
    const filterByToUpdate = bugService.getFilterFromParams(searchParams)
    setFilterBy(filterByToUpdate)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log("Deleted Succesfully!")
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg("Bug removed")
    } catch (err) {
      console.log("Error from onRemoveBug ->", err)
      showErrorMsg("Cannot remove bug")
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity? *Minimum 1"),
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log("Added Bug", savedBug)
      setBugs((prevBugs) => [...prevBugs, savedBug])
      showSuccessMsg("Bug added")
    } catch (err) {
      console.log("Error from onAddBug ->", err)
      showErrorMsg("Cannot add bug")
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt("New severity?")
    const bugToSave = { ...bug, severity }
    try {
      const savedBug = await bugService.save(bugToSave)
      console.log("Updated Bug:", savedBug)
      setBugs((prevBugs) =>
        prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
      )
      showSuccessMsg("Bug updated")
    } catch (err) {
      console.log("Error from onEditBug ->", err)
      showErrorMsg("Cannot update bug")
    }
  }

  function onSetFilter(fieldsToUpdate) {
    setSearchParams(fieldsToUpdate)
  }

  const { txt, minSeverity } = filterBy
  return (
    <main className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={{ txt, minSeverity }} onSetFilter={onSetFilter} />
        <button className="add-btn" onClick={onAddBug}>
          Add Bug ⛐
        </button>
        <PDFDownloader />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
