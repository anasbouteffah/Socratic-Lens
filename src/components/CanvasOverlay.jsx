import { useRef, useEffect, useState, useCallback } from 'react'

function CanvasOverlay({ image, activeTool, brushColor, brushSize }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Initialize canvas when image loads
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !image) return

    const img = new Image()
    img.onload = () => {
      // Set canvas size to match container
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext('2d')
      setContext(ctx)
      setImageLoaded(true)
    }
    img.src = image
  }, [image])

  // Update brush settings
  useEffect(() => {
    if (!context) return
    
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = brushSize
    
    if (activeTool === 'highlighter') {
      context.globalAlpha = 0.3
      context.strokeStyle = brushColor
    } else if (activeTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out'
      context.globalAlpha = 1
    } else {
      context.globalCompositeOperation = 'source-over'
      context.globalAlpha = 1
      context.strokeStyle = brushColor
    }
  }, [context, activeTool, brushColor, brushSize])

  const getPosition = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }, [])

  const startDrawing = useCallback((e) => {
    if (!context) return
    e.preventDefault()
    
    const pos = getPosition(e)
    lastPosRef.current = pos
    setIsDrawing(true)
    
    // Draw a dot for single clicks
    context.beginPath()
    context.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
    context.fill()
  }, [context, getPosition, brushSize])

  const draw = useCallback((e) => {
    if (!isDrawing || !context) return
    e.preventDefault()
    
    const pos = getPosition(e)
    
    context.beginPath()
    context.moveTo(lastPosRef.current.x, lastPosRef.current.y)
    context.lineTo(pos.x, pos.y)
    context.stroke()
    
    lastPosRef.current = pos
  }, [isDrawing, context, getPosition])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      {/* Background Image */}
      <img
        src={image}
        alt="Captured homework"
        className="captured-image"
      />
      
      {/* Drawing Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  )
}

export default CanvasOverlay
