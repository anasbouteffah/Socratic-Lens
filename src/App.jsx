import { useState, useCallback } from 'react'
import './App.css'
import ImageInput from './components/ImageInput'
import CanvasOverlay from './components/CanvasOverlay'
import HintPanel from './components/HintPanel'
import ToolPalette from './components/ToolPalette'
import HowItWorks from './components/HowItWorks'
import Examples from './components/Examples'
import About from './components/About'
import Footer from './components/Footer'
import { analyzeImage, dataUrlToBlob } from './services/api'

function App() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'webcam'
  const [activeTool, setActiveTool] = useState('pen')
  const [brushColor, setBrushColor] = useState('#ef4444')
  const [brushSize, setBrushSize] = useState(4)
  
  // Problem analysis state
  const [problemData, setProblemData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)

  const handleImageCapture = useCallback(async (imageData) => {
    setCapturedImage(imageData)
    setProblemData(null)
    setAnalysisError(null)
    setIsAnalyzing(true)

    try {
      // Convert base64 to blob and send to backend
      const imageBlob = dataUrlToBlob(imageData)
      const result = await analyzeImage(imageBlob)
      setProblemData(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      setAnalysisError(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const handleClearImage = useCallback(() => {
    setCapturedImage(null)
    setProblemData(null)
    setAnalysisError(null)
  }, [])

  const scrollToWorkspace = () => {
    document.querySelector('.workspace')?.scrollIntoView({ behavior: 'smooth' })
  }

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
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#examples" className="nav-link">Examples</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
          <button className="btn btn-primary" onClick={scrollToWorkspace}>
            Get Started
          </button>
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
          <div className="hero-cta animate-fade-in">
            <button className="btn btn-primary btn-large" onClick={scrollToWorkspace}>
              Try It Now
            </button>
            <a href="#how-it-works" className="btn btn-secondary btn-large">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="workspace" id="workspace">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
            <span className="section-badge">🛠️ Try It Now</span>
            <h2 className="section-title">
              Upload Your <span className="gradient-text">Problem</span>
            </h2>
          </div>
          
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

              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="analysis-status">
                  <div className="status-icon animate-pulse">🔍</div>
                  <span>Analyzing your problem with AI...</span>
                </div>
              )}
              
              {analysisError && (
                <div className="analysis-error">
                  <span>⚠️ {analysisError}</span>
                </div>
              )}

              {problemData && (
                <div className="analysis-result glass-card">
                  <div className="result-header">
                    <span className="result-icon">✅</span>
                    <span>Problem Detected</span>
                  </div>
                  <div className="result-content">
                    <div className="result-item">
                      <span className="label">Subject:</span>
                      <span className="value">{problemData.subject}</span>
                    </div>
                    <div className="result-item">
                      <span className="label">Type:</span>
                      <span className="value">{problemData.problem_type}</span>
                    </div>
                    {problemData.difficulty && (
                      <div className="result-item">
                        <span className="label">Difficulty:</span>
                        <span className={`value difficulty-${problemData.difficulty}`}>
                          {problemData.difficulty}
                        </span>
                      </div>
                    )}
                    <div className="result-text">
                      <span className="label">Extracted:</span>
                      <code>{problemData.extracted_text}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Hints */}
            <HintPanel 
              hasImage={!!capturedImage} 
              problemData={problemData}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Examples Section */}
      <Examples />

      {/* About Section */}
      <About />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
