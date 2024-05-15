import express from "express"
import { useAuth } from "../middlewares/auth.middleware.js"
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
router.get("/:bugId", useAuth(), updateBugCookies, getBug)
router.delete("/:bugId", useAuth({ isAdmin: true }), removeBug)
router.put("/:bugId", useAuth({ isAdmin: true }), updateBug)
router.post("/", useAuth(), addBug)

export const bugRoutes = router
