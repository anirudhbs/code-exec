import React, { Component } from 'react'
import '../App.css'

const compose = (f, g) => x => f(g(x))

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      placeholder: null
    }
  }

  async fileUpload () {
    let file = document.querySelector('input[type=file]').files[0]
    let base64File = await this.getBase64(file)
    let data = await compose(this.callVisionApi, this.createBodyAndKey)(base64File)
    let res = this.getResponse(data)
    this.props.setCode(res)
  }

  getResponse (data) {
    return data.responses[0].fullTextAnnotation.text
  }

  createBodyAndKey (file) {
    const key = 'AIzaSyD-26bnoWy9LdX5G89ZTou3XaI4wNC9SyQ'
    let len = 'data:image/png;base64,'
    const body = {
      requests: [
        {
          features: [
            {
              type: 'TEXT_DETECTION'
            }
          ],
          image: {
            content: file.slice(len.length, file.length)
          }
        }
      ]
    }
    const obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      },
      body: JSON.stringify(body)
    }
    return [obj, key]
  }

  getBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  async callVisionApi ([obj, key]) {
    let data = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, obj)
    let dataJSON = await data.json()
    return dataJSON
  }

  render () {
    return (
      <div>
        <label>Choose an image</label>
        <input className='file' type='file' name='image_upload' accept='.jpg, .jpeg, .png' onChange={this.fileUpload.bind(this)} />
      </div>
    )
  }
}

export default FileUpload
