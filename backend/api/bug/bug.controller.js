import ms from "ms"
import { bugService as bugService } from "./bug.service.js"
import { loggerService } from "../../services/logger.service.js"
import { asyncLocalStorage } from "../../services/als.service.js"

export async function getBugs(req, res) {
  const { txt, minSeverity, pageIdx, perPage } = req.query

  try {
    loggerService.debug("Getting Bugs:", req.query)
    const filterBy = {
      txt,
      minSeverity: +minSeverity,
      pageIdx: +pageIdx,
      perPage: +perPage,
    }

    const bugs = await bugService.query(filterBy)
    res.json(bugs)
  } catch (err) {
    loggerService.error("Failed to get bugs", err)
    res.status(400).send({ err: "Failed to get bugs" })
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.bugId
    const bug = await bugService.getById(bugId)
    res.json(bug)
  } catch (err) {
    loggerService.error("Failed to get bug", err)
    res.status(400).send({ err: "Failed to get bug" })
  }
}

export async function removeBug(req, res) {
  const bugId = req.params.bugId
  const { loggedinUser } = asyncLocalStorage.getStore()
  try {
    const bug = await bugService.getById(bugId)

    if (
      !(bug?.owner?._id === loggedinUser._id || loggedinUser.isAdmin === true)
    ) {
      res.status(401).send({ err: "Not Authorize" })
      return
    }

    const removedId = await bugService.remove(bugId)
    res.send(removedId)
  } catch (err) {
    loggerService.error("Failed to remove bug", err)
    res.status(400).send({ err: "Failed to remove bug" })
  }
}

export async function updateBug(req, res) {
  const bugToUpdate = req.body
  const { loggedinUser } = asyncLocalStorage.getStore()
  try {
    if (
      !(
        bugToUpdate?.owner?._id === loggedinUser._id ||
        loggedinUser.isAdmin === true
      )
    ) {
      res.status(401).send({ err: "Not Authorize" })
      return
    }
    const updatedBug = await bugService.update(bugToUpdate)
    res.json(updatedBug)
  } catch (err) {
    loggerService.error("Failed to get bug", err)
    res.status(400).send({ err: "Failed to get bug" })
  }
}

export async function addBug(req, res) {
  const { title, severity } = req.body
  const { loggedinUser } = asyncLocalStorage.getStore()

  const bugToSave = { title, severity: +severity }
  bugToSave.owner = loggedinUser

  try {
    const addedBug = await bugService.add(bugToSave)
    res.send(addedBug)
  } catch (error) {
    loggerService.error("Failed to get bug", err)
    res.status(400).send({ err: "Failed to get bug" })
  }
}

export async function updateBugCookies(req, res, next) {
  try {
    const bugId = req.params.bugId
    const visitBugIds = req.cookies.visitBugIds || []
    const isBugIdVisited = visitBugIds.includes(bugId)

    // user can't see more than 3 different bug id's during some time
    if (!isBugIdVisited && visitBugIds.length === 3) {
      res.status(401).send("Wait for a bit")
      return
    } else if (!isBugIdVisited) {
      visitBugIds.push(bugId)
    }

    res.cookie("visitBugIds", visitBugIds, { maxAge: ms("7s") })

    next()
  } catch (error) {
    loggerService.error(`Couldn't update bug's cookies`, error)
  }
}
