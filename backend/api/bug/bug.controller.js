import ms from "ms"
import { bugService as bugService } from "./bug.service.js"
import { loggerService } from "../../services/logger.service.js"

export async function getBugs(req, res) {
  const { txt, minSeverity, pageIdx, sortBy, sortDir, labels } = req.query

  const filterBy = {
    txt,
    minSeverity: +minSeverity,
    sortBy,
    pageIdx,
    sortDir,
  }

  try {
    if (labels) {
      filterBy.labels = JSON.parse(labels)
    }
  } catch (error) {
    res.status(400).send("invalid query")
    loggerService.warn("invalid labels format")
    return
  }

  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (error) {
    loggerService.error(`Could'nt get bugs`, error)
    res.status(400).send(`Could'nt get bugs`)
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.bugId
    console.log("bugId:", bugId)
    const bug = await bugService.getById(bugId)
    console.log("bug:", bug)
    res.send(bug)
  } catch (error) {
    loggerService.error(`Could'nt get bug`, error)
    res.status(400).send(`Could'nt get bug`)
  }
}

export async function removeBug(req, res) {
  try {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send("deleted")
  } catch (error) {
    loggerService.error(`Could'nt remove bug`, error)
    res.status(400).send(`Could'nt remove bug`)
  }
}

export async function updateBug(req, res) {
  const { _id, title, severity } = req.body
  let bugToSave = { _id, title, severity: +severity }

  try {
    bugToSave = await bugService.save(bugToSave)
    res.send(bugToSave)
  } catch (error) {
    loggerService.error(`Could'nt save bug`, error)
    res.status(400).send(`Could'nt save bug`)
  }
}

export async function addBug(req, res) {
  const { title, severity } = req.body
  let bugToSave = { title, severity: +severity }
  try {
    bugToSave = await bugService.save(bugToSave)
    res.send(bugToSave)
  } catch (error) {
    loggerService.error(`Could'nt save bug`, error)
    res.status(400).send(`Could'nt save bug`)
  }
}

export async function updateBugCookies(req, res, next) {
  try {
    const bugId = req.params.bugId
    // Cookies are stored as string
    let visitBugIds = req.cookies.visitBugIds || []

    // user can't see more than 3 different bug id's during some time
    if (visitBugIds.length > 3) {
      res.status(401).send("Wait for a bit")
      return
    }

    // update "visitBugIds" which holds unique bug ids list
    if (!visitBugIds.includes(bugId)) {
      visitBugIds.push(bugId)
    }

    res.cookie("visitBugIds", visitBugIds, { maxAge: ms("7s") })

    next()
  } catch (error) {
    loggerService.error(`Coudn't update bug's cookies`, error)
  }
}