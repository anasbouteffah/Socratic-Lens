import { useState, useRef, useCallback } from 'react'
import WebcamCapture from './WebcamCapture'
import ImageUpload from './ImageUpload'

function ImageInput({ mode, onImageCapture }) {
  if (mode === 'webcam') {
    return <WebcamCapture onCapture={onImageCapture} />
  }
  
  return <ImageUpload onUpload={onImageCapture} />
}

export default ImageInput
