import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks';
import { getStorage } from 'utils'

const client = new ApolloClient({
  url: 'http://localhost:4000',
  headers: {
    authorization: 'bearer ' + getStorage('accessToken') ?? ''
  }
})

import App from './app'

const Main = () => (
  <ApolloProvider client={client}>
    <Router basename="/">
      <App />
    </Router>
  </ApolloProvider>
)

const dom = document.getElementById('root')
ReactDOM.render(<Main />, dom)
