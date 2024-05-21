import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { asyncLocalStorage } from "../../services/als.service.js"

const COLL_NAME = "bug"
const collection = await dbService.getCollection(COLL_NAME)

export const bugService = {
  query,
  getById,
  remove,
  add,
  update,
}

const PAGE_SIZE = 5

async function query(filterBy = { txt: "" }) {
  try {
    const criteria = {
      title: { $regex: filterBy.txt, $options: "i" },
    }
    const total = await collection.countDocuments(criteria)
    const bugCursor = await collection.find(criteria)

    if (filterBy.pageIdx !== undefined) {
      const perPage = filterBy.perPage || PAGE_SIZE
      const startIdx = (filterBy.pageIdx - 1) * perPage
      bugCursor.skip(startIdx).limit(perPage)
    }

    const bugs = await bugCursor.toArray()

    return { bugs, total }
  } catch (err) {
    loggerService.error("cannot find bugs", err)
    throw err
  }
}

async function getById(bugId) {
  try {
    const bug = await collection.findOne({ _id: new ObjectId(bugId) })
    bug.createdAt = new ObjectId(bug._id).getTimestamp()

    return bug
  } catch (err) {
    loggerService.error(`while finding bug ${bugId}`, err)
    throw err
  }
}

async function remove(bugId) {
  try {
    await collection.deleteOne({
      _id: new ObjectId(bugId),
    })
    return bugId
  } catch (err) {
    loggerService.error(`cannot remove bug ${bugId}`, err)
    throw err
  }
}

async function update(bug) {
  try {
    const bugToSave = {
      title: bug.title,
      severity: bug.severity,
    }

    await collection.updateOne(
      { _id: new ObjectId(bug._id) },
      { $set: bugToSave }
    )
    return bug
  } catch (err) {
    loggerService.error(`cannot update bug ${bug?._id}`, err)
    throw err
  }
}

async function add(bug) {
  try {
    await collection.insertOne(bug)
    return bug
  } catch (err) {
    loggerService.error("cannot insert bug", err)
    throw err
  }
}
