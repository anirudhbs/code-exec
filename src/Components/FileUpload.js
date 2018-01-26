import React, { Component } from 'react'
import '../App.css'
import { Label } from 'react-bootstrap'

const Tesseract = window.Tesseract

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      placeholder: null
    }
  }

  fileUpload () {
    let file = document.querySelector('input[type=file]').files[0]
    this.fileRead(file)
  }

  fileRead (file) {
    let reader = new FileReader()
    reader.onloadend = () => {
      this.callTesseract(reader)
    }
    if (file) {
      reader.readAsDataURL(file)
    } else {}
  }

  callTesseract (reader) {
    Tesseract.recognize(reader.result)
    .catch(err => console.log(err))
    .then(result => {
      console.log('code', result.text)
      this.props.setCode(result.text)
    })
  }

  render () {
    return (
      <div>
        <Label>Choose an image</Label>
        <input className='file' type='file' name='image_upload' accept='.jpg, .jpeg, .png' onChange={this.fileUpload.bind(this)} />
      </div>
    )
  }
}

export default FileUpload
