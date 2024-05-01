import fs from "fs"
import { utilService } from "../../services/util.service.js"

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile("data/bug.json")

export const bugService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy) {
  try {
    let { txt, minSeverity, pageIdx, sortBy, sortDir, labels } = filterBy
    const regExpTxt = new RegExp(txt, "i")

    let filteredBugs = bugs.filter((bug) => {
      return (
        (!txt ||
          regExpTxt.test(bug.title) ||
          regExpTxt.test(bug.description)) &&
        (!minSeverity || bug.severity >= minSeverity) &&
        (!labels || labels.every((label) => bug.labels.includes(label)))
      )
    })

    switch (sortBy) {
      case "title":
        bugs.sort((a, b) => a.title.localeCompare(b.title))
      case "severity":
        bugs.sort((a, b) => a.severity - b.severity)
        break
    }

    switch (sortDir) {
      // Descending Order
      case "-1":
        bugs.reverse()
        break
    }

    if (pageIdx !== undefined) {
      const startIdx = pageIdx * PAGE_SIZE
      filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return filteredBugs
  } catch (error) {
    throw error
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId)
    return bug
  } catch (error) {
    throw error
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    _saveBugsToFile()
  } catch (error) {
    throw error
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
      if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`
      bugs[idx] = bugToSave
    } else {
      bugToSave._id = utilService.makeId()
      bugToSave.createAt = Date.now()
      bugs.push(bugToSave)
    }
    await _saveBugsToFile()
    return bugToSave
  } catch (error) {
    throw error
  }
}

function _saveBugsToFile(path = "./data/bug.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
