import React, { Component } from 'react'
import '../App.css'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Button } from 'react-bootstrap'

require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')

class TextEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: this.props.code
    }
  }

  onBeforeChange (editor, data, value) {
    this.setState({code: value})
  }

  onChange (editor, value) {
    // do something
    // this.setState({code: value})
  }

  onSubmit () {
    const code = this.state.code
    this.makeAPICall(code)
  }

  makeAPICall (code) {
    const url = 'http://192.168.0.106:4000'
    fetch(url + '/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: code })
    })
    .then((results) => results.json())
    .then((data) => {
      console.log(data)
    })
    .catch(function (error) {
      console.log('fail', error)
    })
  }

  render () {
    const options = {}
    return (
      <div>
        <CodeMirror value={this.state.code} options={options} onBeforeChange={this.onBeforeChange.bind(this)}
          onChange={this.onChange.bind(this)} />
        <Button onClick={this.onSubmit.bind(this)} bsStyle='primary'>Evaluate</Button>
      </div>
    )
  }
}

export default TextEditor
