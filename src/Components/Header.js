import React, { Component } from 'react'
import '../App.css'
import { PageHeader } from 'react-bootstrap'

class Header extends Component {
  render () {
    return (
      <PageHeader className='header'>
        Code Exec
      </PageHeader>
    )
  }
}

export default Header
