import express from "express"
import { useAuth, validateAdmin } from "../middlewares/auth.middleware.js"
import {
  addBug,
  getBug,
  getBugs,
  removeBug,
  updateBug,
  updateBugCookies,
} from "./bug.controller.js"

const router = express.Router()
router.use(useAuth())

router.get("/", getBugs)
router.get("/:bugId", updateBugCookies, getBug)
router.delete("/:bugId", validateAdmin, removeBug)
router.put("/:bugId", validateAdmin, updateBug)
router.post("/", addBug)

export const bugRoutes = router
