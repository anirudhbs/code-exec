import React, { Component } from 'react'
import './App.css'
import TextEditor from './Components/TextEditor'
import FileUpload from './Components/FileUpload'
import Header from './Components/Header'

require('codemirror/lib/codemirror.css')
require('codemirror/mode/clojure/clojure')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: '// Code goes here',
      flag: false
    }
  }

  setCode (code) {
    this.setState({ code,
      flag: true
    })
  }

  render () {
    const { code } = this.state
    return (
      <div className='App'>
        <Header />
        <FileUpload setCode={this.setCode.bind(this)} />
        {(this.state.flag) && <TextEditor code={code} />}
      </div>
    )
  }
}

export default App
