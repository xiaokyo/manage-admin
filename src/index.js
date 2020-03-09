import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"

import App from './app'

const Main = () => (
  <Router basename="/">
    <App />
  </Router>
)

const dom = document.getElementById('root')
ReactDOM.render(<Main />, dom)
