import { useEffect, useCallback, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useEffectUpdate } from "../customHooks/useEffectUpdate.js"

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { bugService } from "../services/bug.service.js"
import { utilService } from "../services/util.service.js"

import { BugFilter } from "../cmps/bug/BugFilter.jsx"
import { PDFDownloader } from "../cmps/bug/BugPdfDownloader.jsx"
import { BugList } from "../cmps/bug/BugList.jsx"
import { Pagination } from "../cmps/Pagination.jsx"

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [totalBugs, setTotalBugs] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )

  const debouncedSetFilter = useCallback(
    utilService.debounce(onSetFilter, 1000),
    []
  )

  useEffect(() => {
    updateFilterBy()
  }, [searchParams])

  useEffectUpdate(() => {
    loadBugs()
  }, [filterBy])

  async function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity? *Minimum 1"),
    }
    try {
      const savedBug = await bugService.save(bug)
      loadBugs()
      showSuccessMsg("Bug added")
    } catch (err) {
      console.log("Error from onAddBug ->", err)
      showErrorMsg("Cannot add bug")
    }
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      loadBugs()
      showSuccessMsg("Bug removed")
    } catch (err) {
      console.log("Error from onRemoveBug ->", err)
      showErrorMsg("Cannot remove bug")
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

  function onPageChange(currentPage) {
    setSearchParams((prevPagination) => {
      prevPagination.set("pageIdx", currentPage)
      return prevPagination
    })
  }

  function onSetFilter(fieldsToUpdate) {
    setSearchParams({ ...filterBy, ...fieldsToUpdate })
  }

  function updateFilterBy() {
    const filterByToUpdate = bugService.getFilterFromParams(searchParams)
    setFilterBy(filterByToUpdate)
  }

  async function loadBugs() {
    try {
      const { bugs, total } = await bugService.query(filterBy)
      setBugs(bugs)
      setTotalBugs(total)
    } catch (error) {
      console.log("Had issues loading Bugs", error)
    }
  }

  const { txt, minSeverity } = filterBy
  const totalBugPages = Math.ceil(totalBugs / filterBy.perPage)

  return (
    <div className="bug-index">
      <h3>Bugs App</h3>
      <main>
        <BugFilter
          filterBy={{ txt, minSeverity }}
          onSetFilter={debouncedSetFilter}
        />
        <button className="add-btn" onClick={onAddBug}>
          Add Bug ⛐
        </button>
        <PDFDownloader bugs={bugs} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

        {totalBugPages > 0 && (
          <Pagination
            current={filterBy.pageIdx}
            total={totalBugPages}
            onPageChange={onPageChange}
          />
        )}
      </main>
    </div>
  )
}
