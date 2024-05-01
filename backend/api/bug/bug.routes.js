import express from "express"
import {
  addBug,
  getBug,
  getBugs,
  removeBug,
  updateBug,
  updateBugCookies,
} from "./bug.controller.js"

const router = express.Router()

router.get("/", getBugs)
router.get("/:bugId", updateBugCookies, getBug)
router.delete("/:bugId", removeBug)
router.put("/:bugId", updateBug)
router.post("/", addBug)

export const bugRoutes = router
