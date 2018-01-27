import React, { Component } from 'react'
import '../App.css'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Button } from 'react-bootstrap'

class TextEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: this.props.code,
      lang: 'clojure',
      flag: false,
      result: null
    }
  }

  onBeforeChange (editor, data, value) {
    this.setState({code: value})
  }

  onChange (editor, data, value) {
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT'
      },
      body: JSON.stringify({ code: code, lang: 'clojure' })
    })
    .then((results) => results.json())
    .then((data) => {
      console.log(data)
      if (data.status === 'success')
      this.setState({ flag: true, result: data.result })
    })
    .catch(function (error) {
      console.log('fail', error)
    })
  }

  onChangeLanguage (event) {
    this.setState({lang: event.target.value})
  }

  render () {
    const options = {}
    return (
      <div className='editor'>
        <select className='btn btn-outline-primary' value={this.state.lang} onChange={this.onChangeLanguage.bind(this)}>
          <option value='clojure'>Clojure</option>
          <option value='python'>Python</option>
          <option value='clisp'>Lisp</option>
        </select>
        {/* <DropdownButton bsStyle='Primary' title={this.state.lang} onChange={this.onChangeLanguage.bind(this)}>
          <MenuItem value='clojure'>Clojure</MenuItem>
          <MenuItem value='python'>Python</MenuItem>
          <MenuItem value='clisp'>Lisp</MenuItem>
        </DropdownButton> */}
        <CodeMirror value={this.state.code} options={options} onBeforeChange={this.onBeforeChange.bind(this)}
          onChange={this.onChange.bind(this)} />
        <Button onClick={this.onSubmit.bind(this)} bsStyle='success'>Evaluate</Button>
        <div className='result'>
          {(this.state.flag) && <div>Result: {this.state.result}</div>}
        </div>
      </div>
    )
  }
}

export default TextEditor
