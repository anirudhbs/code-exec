import React, { Component } from 'react'
import '../App.css'

const video = window.video
const compose = (f, g) => x => f(g(x))

class FileUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      placeholder: null
    }
  }

  componentDidMount () {
    const video = document.getElementById('video')
    video.addEventListener('click', this.takeSnapshot.bind(this))

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.src = window.URL.createObjectURL(stream)
      })
      .catch((err) => {
        console.error('camera error: ' + err.name)
      })
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
    image.alt = 'capture'
    video.style.display = 'none'
    this.fileUpload(canvas)
  }

  async fileUpload (canvas) {
    let file = document.querySelector('input[type=file]').files[0] || canvas.toDataURL('image/png')
    const image = document.getElementById('myImg')
    const video = document.getElementById('video')
    video.style.display = 'none'
    image.src = file.name
    console.log(file)
    let base64File = await this.getBase64(file)
    let data = await compose(this.callVisionApi, this.createBodyAndKey)(base64File)
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

  render () {
    return (
      <div className='fileUpload'>
        <label>Choose an image</label>
        <input className='file' type='file' name='image_upload' accept='.jpg, .jpeg, .png' onChange={this.fileUpload.bind(this)} />
        <div>
          <label> Capture an image</label>
          <video id='video' autoPlay />
        </div>
        <img id='myImg' />
      </div>
    )
  }
}

export default FileUpload
