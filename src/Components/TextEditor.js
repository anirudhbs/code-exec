import React, { Component } from 'react'
import '../App.css'
import { Controlled as CodeMirror } from 'react-codemirror2'

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
    const options = null
    return (
      <div>
        <CodeMirror value={this.state.code} options={options} onBeforeChange={this.onBeforeChange.bind(this)}
          onChange={this.onChange.bind(this)} />
        <button onClick={this.onSubmit.bind(this)}>Submit</button>
      </div>
    )
  }
}

export default TextEditor
