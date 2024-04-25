import express from "express"
import cors from "cors"
import { loggerService } from "./services/logger.service.js"
import { bugService } from "./services/bug.service.js"
import cookieParser from "cookie-parser"
const app = express()

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}
// Express Config:
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors(corsOptions))

app.get("/", (req, res) => res.send("Hello there"))
app.get("/api/bug", async (req, res) => {
  const filterBy = req.query
  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (error) {
    loggerService.error(`Could'nt get bugs`, error)
    res.status(400).send(`Could'nt get bugs`)
  }
})

app.get("/api/bug/save", async (req, res) => {
  try {
    let bugToSave = {
      _id: req.query._id,
      title: req.query.title,
      severity: +req.query.severity,
      createdAt: Date.now(),
    }

    bugToSave = await bugService.save(bugToSave)
    res.send(bugToSave)
  } catch (error) {
    loggerService.error(`Could'nt save bug`, error)
    res.status(400).send(`Could'nt save bug`)
  }
})

app.get("/api/bug/:bugId", async (req, res) => {
  try {
    const COOKIE_MAX_AGE_TIME = 7 * 1000
    const bugId = req.params.bugId
    // Cookies are stored as string
    let visitBugIds = req.cookies.visitBugIds || []

    console.log("initial visit bug ids", visitBugIds)
    // user can't see more than 3 different bug id's during some time
    if (visitBugIds.length > 3) {
      res.status(401).send("Wait for a bit")
      return
    }

    // update cookie, for different bug id in "visitBugIds" cookie
    if (!visitBugIds.includes(bugId)) {
      visitBugIds.push(bugId)
    }

    res.cookie("visitBugIds", visitBugIds, { maxAge: COOKIE_MAX_AGE_TIME })
    console.log("visitBugIds", visitBugIds)
    const bug = await bugService.getById(bugId)
    console.log("bug:", bug)
    res.send(bug)
  } catch (error) {
    loggerService.error(`Could'nt get bug`, error)
    res.status(400).send(`Could'nt get bug`)
  }
})

app.get("/api/bug/:bugId/remove", async (req, res) => {
  try {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send("deleted")
  } catch (error) {
    loggerService.error(`Could'nt remove bug`, error)
    res.status(400).send(`Could'nt remove bug`)
  }
})

app.listen(3030, () => console.log("Server ready at port 3030"))
