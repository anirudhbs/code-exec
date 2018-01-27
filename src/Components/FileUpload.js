import React, { Component } from 'react'
import '../App.css'

const compose = (f, g) => x => f(g(x))

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filename: ''
    }
  }

  takeSnapshot () {
    const video = document.getElementById('video')
    const image = document.getElementById('myImg')
    const width = video.offsetWidth
    const height = video.offsetHeight

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, width, height)
    image.src = canvas.toDataURL('image/png')
    image.width = '960px'
    image.alt = 'capture'
    video.style.display = 'none'
    this.fileUpload(canvas)
  }

  async fileUpload (canvas) {
    let file = document.querySelector('input[type=file]').files[0] || canvas.toDataURL('image/png')
    const image = document.getElementById('myImg')
    const video = document.getElementById('video')
    video.style.display = 'none'
    let base64File = await this.getBase64(file)
    let data = await compose(this.callVisionApi, this.createBodyAndKey)(base64File)
    image.src = base64File
    try {
      let res = this.getResponse(data)
      this.props.setCode(res)
    } catch (err) {
      console.error(err)
    }
  }

  getResponse (data) {
    try {
      return data.responses[0].fullTextAnnotation.text
    } catch (err) {
      throw new Error('Invalid Input') || err
    }
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
      if (typeof file !== 'object' && file.startsWith('data:image/png;base64,')) {
        resolve(file)
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      }
    })
  }

  async callVisionApi ([obj, key]) {
    let data = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, obj)
    let dataJSON = await data.json()
    return dataJSON
  }

  onNameChange (event) {
    this.setState({filename: event.target.value})
  }

  onNameSubmit () {
    const url = 'http://192.168.0.106:4000'
    fetch(url + '/files/' + this.state.filename, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT'
      }
    })
    .then((results) => results.json())
    .then((data) => {
      if (data.status === 'success') {
        this.props.setCode(data.content)
      }
    })
    .catch(function (error) {
      console.log('fail', error)
    })
  }

  render () {
    return (
      <div className='fileUpload'>
        <label>Choose an image</label>
        <input id='image_upload' className='file' type='file'
          name='image_upload' accept='.jpg, .jpeg, .png' onChange={this.fileUpload.bind(this)} />
        <div>
          <input type='text' value={this.state.filename} onChange={this.onNameChange.bind(this)} 
            placeholder='Enter file name' />
          <button onClick={this.onNameSubmit.bind(this)}>Submit</button>
        </div>
        <img id='myImg' alt='' width='960px' />
      </div>
    )
  }
}

export default FileUpload
