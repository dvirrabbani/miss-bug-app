import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { useState } from "react"
import { useEffect } from "react"
import { BugFilter } from "../cmps/BugFilter.jsx"
import { useSearchParams } from "react-router-dom"
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer"

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  )

  useEffect(() => {
    setSearchParams(filterBy)
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

  function BugsPdfDocument() {
    return (
      <Document>
        <Page>
          <Text>Bugs</Text>
          {bugs.map((bug) => {
            return (
              <Text
                key={bug._id}
                style={{ fontSize: "14px", marginTop: "8px", padding: "8px" }}
              >
                Bug - Id: {bug._id}, Title: {bug.title}, Severity:
                {bug.severity}
              </Text>
            )
          })}
        </Page>
      </Document>
    )
  }

  function PDFDownloader() {
    return (
      <PDFDownloadLink
        document={<BugsPdfDocument />}
        fileName="missBugsReview.pdf"
      >
        <button>Download as PDF</button>
      </PDFDownloadLink>
    )
  }

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...fieldsToUpdate }))
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
