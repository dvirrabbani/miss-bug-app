import fs from "fs"
import { utilService } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"

const bugs = utilService.readJsonFile("data/bug.json")

export const bugService = {
  query,
  getById,
  remove,
  save,
}

async function query(searchParams) {
  try {
    let { txt, minSeverity, page, pageSize, labels } = searchParams
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

    let total = 0
    let paginateBugs = filteredBugs
    if (page !== undefined && pageSize !== undefined) {
      const startIdx = (page - 1) * pageSize
      total = filteredBugs.length
      paginateBugs = filteredBugs.slice(startIdx, startIdx + pageSize)
    }

    const res = {
      data: paginateBugs,
      total,
    }

    return res
  } catch (error) {
    // When catch an error, use the error with logger.service() e.g
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

async function remove(bugId, loggedinUser) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
    const bug = bugs[bugIdx]

    if (bug?.owner?._id !== loggedinUser._id) {
      loggerService.error(
        `unauthorize user._id ${loggedinUser._id} to update ${bug._id}`
      )
    }

    bugs.splice(bugIdx, 1)
    _saveBugsToFile()
  } catch (error) {
    throw error
  }
}

async function save(bug, loggedinUser) {
  try {
    // update bug
    if (bug?._id) {
      const idx = bugs.findIndex((bug) => bug._id === bug._id)
      if (idx < 0) throw `Cant find bug with _id ${bug._id}`
      if (bug?.owner?._id !== loggedinUser._id) {
        loggerService.error(
          `unauthorize user._id ${loggedinUser._id} to update ${bug._id}`
        )
      }
      bugs[idx] = bug
    }
    //create new bug
    else {
      bug._id = utilService.makeId()
      bug.owner = loggedinUser
      bug.createdAt = Date.now()
      bugs.push(bug)
    }

    await _saveBugsToFile()
    return bug
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
