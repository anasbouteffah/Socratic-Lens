import { useState, useCallback } from 'react'
import './App.css'
import ImageInput from './components/ImageInput'
import CanvasOverlay from './components/CanvasOverlay'
import HintPanel from './components/HintPanel'
import ToolPalette from './components/ToolPalette'

function App() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'webcam'
  const [activeTool, setActiveTool] = useState('pen')
  const [brushColor, setBrushColor] = useState('#ef4444')
  const [brushSize, setBrushSize] = useState(4)

  const handleImageCapture = useCallback((imageData) => {
    setCapturedImage(imageData)
  }, [])

  const handleClearImage = useCallback(() => {
    setCapturedImage(null)
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">🎓</div>
            <span className="gradient-text">Socratic Lens</span>
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link">How it works</a>
            <a href="#" className="nav-link">Examples</a>
            <a href="#" className="nav-link">About</a>
          </nav>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate-fade-in">
            <span>✨</span>
            <span>AI-Powered Learning Without Answers</span>
          </div>
          <h1 className="hero-title animate-fade-in">
            Learn to <span className="gradient-text">Think</span>, Not Just Copy
          </h1>
          <p className="hero-subtitle animate-fade-in">
            Upload your homework problem and let our Socratic AI guide you to the solution 
            through thoughtful hints – never giving away the answer.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="workspace">
        <div className="container">
          <div className="workspace-grid">
            {/* Left Panel - Image & Canvas */}
            <div className="image-panel">
              <div className="panel-header">
                <h2 className="panel-title">Your Problem</h2>
                <div className="panel-actions">
                  {capturedImage && (
                    <ToolPalette
                      activeTool={activeTool}
                      setActiveTool={setActiveTool}
                      brushColor={brushColor}
                      setBrushColor={setBrushColor}
                      brushSize={brushSize}
                      setBrushSize={setBrushSize}
                      onClear={handleClearImage}
                    />
                  )}
                </div>
              </div>

              {/* Input Mode Toggle */}
              <div className="input-toggle">
                <button
                  className={`toggle-btn ${inputMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setInputMode('upload')}
                >
                  📁 Upload
                </button>
                <button
                  className={`toggle-btn ${inputMode === 'webcam' ? 'active' : ''}`}
                  onClick={() => setInputMode('webcam')}
                >
                  📷 Webcam
                </button>
              </div>

              {/* Canvas Container */}
              <div className="canvas-container glass-card">
                {capturedImage ? (
                  <CanvasOverlay
                    image={capturedImage}
                    activeTool={activeTool}
                    brushColor={brushColor}
                    brushSize={brushSize}
                  />
                ) : (
                  <ImageInput
                    mode={inputMode}
                    onImageCapture={handleImageCapture}
                  />
                )}
              </div>
            </div>

            {/* Right Panel - Hints */}
            <HintPanel hasImage={!!capturedImage} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
