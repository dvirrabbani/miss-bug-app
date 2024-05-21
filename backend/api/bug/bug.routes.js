import express from "express"
import { requireAuth } from "../../middlewares/auth.middleware.js"
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
router.get("/:bugId", requireAuth, updateBugCookies, getBug)
router.delete("/:bugId", requireAuth, removeBug)
router.put("/:bugId", requireAuth, updateBug)
router.post("/", requireAuth, addBug)

export const bugRoutes = router
