import { useState, useRef, useCallback, useEffect } from 'react'

function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    async function startWebcam() {
      try {
        setIsLoading(true)
        setError(null)
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 1280, height: 720 }
        })
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        
        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setHasPermission(true)
        }
      } catch (err) {
        if (isMounted) {
          setError('Camera access denied. Please enable camera permissions.')
          console.error('Webcam error:', err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    startWebcam()

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    onCapture(imageData)

    // Stop the webcam stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [onCapture])

  if (isLoading) {
    return (
      <div className="webcam-container">
        <div className="canvas-placeholder">
          <div className="placeholder-icon animate-pulse">📷</div>
          <div className="placeholder-text">
            <strong>Starting camera...</strong>
            Please allow camera access when prompted
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="webcam-container">
        <div className="canvas-placeholder">
          <div className="placeholder-icon">⚠️</div>
          <div className="placeholder-text">
            <strong>Camera Error</strong>
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="webcam-container">
      <video
        ref={videoRef}
        className="webcam-video"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {hasPermission && (
        <div className="webcam-controls">
          <button className="capture-btn" onClick={handleCapture} title="Capture">
            <span className="sr-only">Capture Photo</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default WebcamCapture
