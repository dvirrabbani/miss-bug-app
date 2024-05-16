import { Route, HashRouter as Router, Routes } from "react-router-dom"

import { Home } from "./pages/Home.jsx"
import { AboutUs } from "./pages/AboutUs.jsx"
import { BugIndex } from "./pages/BugIndex.jsx"
import { BugDetails } from "./pages/BugDetails.jsx"
import { UserIndex } from "./pages/UserIndex.jsx"

import { AppHeader } from "./cmps/AppHeader.jsx"
import { AppFooter } from "./cmps/AppFooter.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"
import { UserDetails } from "./cmps/user/UserDetails.jsx"

export function App() {
  return (
    <Router>
      <div className="main-app">
        <AppHeader />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bug" element={<BugIndex />} />
            <Route path="/bug/:bugId" element={<BugDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/user/" element={<UserIndex />} />
            <Route path="/user/:userId" element={<UserDetails />} />
          </Routes>
        </main>
        <AppFooter />
        <UserMsg />
      </div>
    </Router>
  )
}
