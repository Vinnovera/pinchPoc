import React, { Component } from 'react'
import './App.css'
import Hammer from 'react-hammerjs'

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

    this.state = {
      scale: 1,
      wrapperOffsetWidth: 0,
      wrapperOffsetHeight: 0,
      offsetHeight: 0,
      offsetWidth: 0,
      aspectRatio: 1,
      width: 0,
      height: 0,
      marginLeft: 0,
      marginTop: 0,
      maxMarginTop: 0,
      minMarginTop: 0,
      maxMarginLeft: 0,
      minMarginLeft: 0
    }

    this.wrapperRef = React.createRef()
    this.imgRef = React.createRef()
  }

  handleTap = () => {
    console.log('onTap')
  }

  handlePinch = (event) => {
    const inboundScale = event.scale
    const adjustedScale = this.getAdjustedScaleFactor(inboundScale)
    // calc wanted scale
    const scale = this.state.scale * adjustedScale

    // check if image fits, is too small, etc
    const newValues = this.findNewImageProportions(scale)

    // set new width and height on image
    this.setSizeOnImg({width: newValues.width, height: newValues.height})

    // re-calculate boundaries for margins
    const minMarginTop = this.getMinMargin(newValues.height, this.state.wrapperOffsetHeight)
    const minMarginLeft = this.getMinMargin(newValues.width, this.state.wrapperOffsetWidth)

    this.setState({scale: newValues.scale, minMarginTop, minMarginLeft}, () => {

    })

  }

  handlePan = (event) => {
    const deltaLeft = this.getAdjustedPanFactor(event.deltaX)
    const deltaTop = this.getAdjustedPanFactor(event.deltaY)
    console.log('handlePan', deltaLeft, deltaTop)

    const marginLeft = this.getMargin('LEFT', deltaLeft)
    const marginTop = this.getMargin('TOP', deltaTop)

    this.setState({marginLeft, marginTop}, this.setMarginOnImage)
  }

  getMargin = (type, delta) => {
    const {maxMarginTop, minMarginTop, maxMarginLeft, minMarginLeft} = this.state

    if (type === 'LEFT') {
      const margin = this.state.marginLeft + delta
      if (margin < maxMarginLeft && margin > minMarginLeft) {
        return margin
      } else if (margin > maxMarginLeft) {
        return maxMarginLeft
      } else if (margin < minMarginLeft) {
        return minMarginLeft
      }
    } else {
      const margin = this.state.marginTop + delta
      if (margin < maxMarginTop && margin > minMarginTop) {
        return margin
      } else if (margin > maxMarginTop) {
        return maxMarginTop
      } else if (margin < minMarginTop) {
        return minMarginTop
      }
    }
  }

  getAdjustedPanFactor = (delta) => {
    return delta * SCALE_FACTOR_PAN
  }

  setMarginOnImage = () => {
    const {marginTop, marginLeft} = this.state
    this.imgRef.current.style.marginTop = `${marginTop}px`
    this.imgRef.current.style.marginLeft = `${marginLeft}px`

  }

  getAdjustedScaleFactor = inboundScale => {
    // 0.5 * x = 0.9 => x = 0.9 / 0.5 => 1.8
    if (inboundScale < 1) {
      return 1 - ((1 - inboundScale) * SCALE_FACTOR_DOWN)
    } else if (inboundScale > 1) {
      return 1 + ((inboundScale - 1) * SCALE_FACTOR_UP)
    } else {
      return 1
    }
  }

  findNewImageProportions = scale => {
    const imageMinWidth = this.state.wrapperOffsetWidth
    const width = this.state.width * scale
    const isSmallerThanWrapperWidth = width < imageMinWidth

    const imageMinHeight = this.state.wrapperOffsetHeight
    const height = this.state.height * scale
    const isSmallerThanWrapperHeight = height < imageMinHeight

    // TODO: ta höjd för aspect ratio
    if (isSmallerThanWrapperWidth || isSmallerThanWrapperHeight) {
      //Width:
      //Height:
    // TODO: recalculate scale that was actually used
      //newScale:
    } else {
      //Width:
      //Height:
    // TODO: recalculate scale that was actually used
      //newScale:
    }
    return {width, height, scale}
  }

  setSizeOnImg = ({width, height}) => {
    this.imgRef.current.style.width = `${width}px`
    this.imgRef.current.style.height = `${height}px`
  }

  getMinMargin = (imageSize, wrapperSize) => {
    return -(imageSize - wrapperSize)
  }

  imageLoaded = ({target: img}) => {
    const {offsetWidth: wrapperOffsetWidth, offsetHeight: wrapperOffsetHeight} = this.wrapperRef.current
    const {offsetHeight, offsetWidth} = img
    console.log('offsetWidth', offsetWidth)
    console.log('offsetHeight', offsetHeight)
    const aspectRatio = offsetWidth / offsetHeight

    const maxMarginTop = 0
    const minMarginTop = this.getMinMargin(offsetHeight, wrapperOffsetHeight)
    const maxMarginLeft = 0
    const minMarginLeft = this.getMinMargin(offsetWidth, wrapperOffsetWidth)

    this.setState({
      aspectRatio,
      wrapperOffsetWidth,
      wrapperOffsetHeight,
      offsetHeight,
      offsetWidth,
      maxMarginTop,
      minMarginTop,
      maxMarginLeft,
      minMarginLeft
    }, this.fitWindow)
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
