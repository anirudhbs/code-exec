import React, { Component } from 'react'
import './App.css'
import TextEditor from './Components/TextEditor'
import FileUpload from './Components/FileUpload'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: '// Code goes here\n',
      flag: false
    }
  }

  setCode (code) {
    console.log('c', code)
    this.setState({ code })
    this.setState({flag: true})
  }

  render () {
    const { code } = this.state
    return (
      <div className='App'>
        <FileUpload setCode={this.setCode.bind(this)} />
        {(this.state.flag) && <TextEditor code={code} />}
      </div>
    )
  }
}

export default App
