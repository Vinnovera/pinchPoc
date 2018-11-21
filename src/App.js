import React, { Component } from 'react'
import { PinchView } from 'react-pinch-zoom-pan'
import './App.css'

const SCALE_FACTOR_UP = 0.01
const SCALE_FACTOR_DOWN = 0.1
const SCALE_FACTOR_PAN = 1

const hammerOptions = {
  recognizers: {
    pinch: {enable: true},
    pan: {
      threshold: 10
    }
  }
}

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {}

    this.wrapperRef = React.createRef()
    this.imgRef = React.createRef()
  }

  handleTap = () => {
  }

  handlePinch = (event) => {
  }

  handlePan = (event) => {
  }

  imageLoaded = ({target: img}) => {
  }

  fitWindow = () => {
    const img = this.imgRef.current
    /*
        const {aspectRatio, wrapperOffsetWidth, wrapperOffsetHeight} = this.state
        const width = Math.min(wrapperOffsetWidth, (wrapperOffsetHeight / aspectRatio))
        const height = Math.min(wrapperOffsetHeight, (wrapperOffsetWidth / aspectRatio))
    */
    const width = this.state.offsetWidth
    const height = this.state.offsetHeight

    this.setState({width, height})
    img.style.width = `${width}px`
    img.style.height = `${height}px`
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          PINCH POC
        </header>
        <main className="App-main">
          <div className="pinch-wrapper" ref={this.wrapperRef}>
            <PinchView
              debug
              backgroundColor='#fd0'
              maxScale={4}
              containerRatio={((400 / 600) * 100)}
            >
              <img src="/test.jpg" alt="" ref={this.imgRef} onLoad={this.imageLoaded} className="pinch-img"/>
            </PinchView>
          </div>
        </main>
      </div>
    )
  }
}

export default App
