import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-3xl font-bold underline">Hello, Pythodar!</div>} />
      </Routes>
    </Router>
  )
}

export default App