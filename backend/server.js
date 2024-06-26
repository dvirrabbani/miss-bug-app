import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import { bugRoutes } from "./api/bug/bug.routes.js"
import { userRoutes } from "./api/user/user.routes.js"
import { authRoutes } from "./api/auth/auth.routes.js"

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
app.use(express.json())

import { setupAsyncLocalStorage } from "./middlewares/setupAls.middleware.js"
app.all("*", setupAsyncLocalStorage)

app.use("/api/bug", bugRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.get("/", (req, res) => res.send("Hello there"))

const port = process.env.PORT || 3030
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}`)
)
