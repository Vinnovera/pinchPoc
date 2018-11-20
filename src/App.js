import React, { Component } from 'react'
import './App.css'
import Hammer from 'react-hammerjs'

const hammerOptions = {
  recognizers: {
    pinch: {enable: true}
  }
}

class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      scale: 1,
      wrapperOffsetWidth: 0,
      wrapperOffsetHeight: 0,
      offsetHeight: 0,
      offsetWidth: 0,
      aspectRatio: 1,
      width: 0,
      height: 0
    }

    this.wrapperRef = React.createRef()
    this.imgRef = React.createRef()
  }

  handleTap = () => {
    console.log('onTap')
  }

  handlePinch = (event) => {
    const inboundScale = event.scale
    const scale = this.state.scale * this.getAdjustedScaleFactor(inboundScale)
    this.setState({scale}, () => {
      this.setScaleOnImg()
    })
  }

  handlePan = (event) => {
    const {deltaX, deltaY} = event
    const marginX = this.getMargin('TOP', deltaX)
    const marginY = this.getMargin('LEFT', deltaY)
    this.setState({marginX, marginY}, this.setMarginOnImage)
  }

  getMargin = (type, delta) => {
    const margin = type === 'TOP' ? this.state.marginX : this.state.marginY
    return margin + delta
  }

  setMarginOnImage = () => {
    const {marginX: marginTop, marginY: marginLeft} = this.state

    this.imgRef.current.style['margin-top'] = `${marginTop}px`
    this.imgRef.current.style['margin-left']= `${marginLeft}px`

  }

  getAdjustedScaleFactor = inboundScale => {
    // 0.5 * x = 0.9 => x = 0.9 / 0.5 => 1.8
    const SCALE_FACTOR_UP = 0.01
    const SCALE_FACTOR_DOWN = 0.1
    if (inboundScale < 1) {
      return 1 - ((1 - inboundScale) * SCALE_FACTOR_DOWN)
    } else if (inboundScale > 1) {
      return 1 + ((inboundScale - 1) * SCALE_FACTOR_UP)
    } else {
      return 1
    }
  }

  setScaleOnImg = () => {
    const scale = this.state.scale
    const w = this.state.width * scale
    const h = this.state.height * scale
    this.imgRef.current.style.width = `${w}px`
    this.imgRef.current.style.height = `${h}px`
  }

  imageLoaded = ({target: img}) => {
    const {offsetWidth: wrapperOffsetWidth, offsetHeight: wrapperOffsetHeight} = this.wrapperRef.current
    const {offsetHeight, offsetWidth} = img
    const aspectRatio = offsetWidth / offsetHeight
    this.setState({aspectRatio, wrapperOffsetWidth, wrapperOffsetHeight, offsetHeight, offsetWidth}, this.fitWindow)
  }

  fitWindow = () => {
    const img = this.imgRef.current
    const {aspectRatio, wrapperOffsetWidth, wrapperOffsetHeight} = this.state
    const width = Math.min(wrapperOffsetWidth, (wrapperOffsetHeight / aspectRatio))
    const height = Math.min(wrapperOffsetHeight, (wrapperOffsetWidth / aspectRatio))
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
            <Hammer
              onTap={this.handleTap}
              onPinch={this.handlePinch}
              onPan={this.handlePan}
              options={hammerOptions}>
              <div>
                <img src="/test.jpg" alt="" ref={this.imgRef} onLoad={this.imageLoaded} className="pinch-img"/>
              </div>
            </Hammer>
          </div>
        </main>
      </div>
    )
  }
}

export default App
