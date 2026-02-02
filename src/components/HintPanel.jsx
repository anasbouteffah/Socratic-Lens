import { useState, useRef, useEffect, useCallback } from 'react'
import { getSocraticHint } from '../services/api'

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'ai',
    content: "Hello! I'm your Socratic tutor. Upload a photo of your homework problem, and I'll help guide you to the solution through thoughtful questions – without giving you the answer directly.",
  }
]

function HintPanel({ hasImage, problemData, isAnalyzing }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [previousHints, setPreviousHints] = useState([])
  const messagesEndRef = useRef(null)
  const hasShownAnalysisMessage = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show analyzing message
  useEffect(() => {
    if (isAnalyzing && !hasShownAnalysisMessage.current) {
      hasShownAnalysisMessage.current = true
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: "I can see you've uploaded an image! Let me analyze the problem..."
      }])
    }
  }, [isAnalyzing])

  // Show problem detected message and get first hint
  useEffect(() => {
    if (problemData && hasShownAnalysisMessage.current) {
      // Add problem detection message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: `I've identified this as a **${problemData.subject}** problem (${problemData.problem_type.replace(/_/g, ' ')}). I can see: "${problemData.extracted_text}"\n\nHighlight or circle the part you're stuck on, then ask me a question!`
      }])
      
      // Reset for next image
      hasShownAnalysisMessage.current = false
      setPreviousHints([])
    }
  }, [problemData])

  const fetchHint = useCallback(async (userQuestion) => {
    if (!problemData) return

    setIsTyping(true)
    
    try {
      const result = await getSocraticHint({
        problemText: problemData.extracted_text,
        problemType: problemData.problem_type,
        subject: problemData.subject,
        userQuestion: userQuestion,
        previousHints: previousHints
      })

      // Add hint to messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: result.hint + (result.follow_up ? `\n\n💡 ${result.follow_up}` : '')
      }])

      // Track previous hints
      setPreviousHints(prev => [...prev, result.hint])

    } catch (error) {
      console.error('Failed to get hint:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: "I'm having trouble connecting to the AI. Please make sure the backend server is running."
      }])
    } finally {
      setIsTyping(false)
    }
  }, [problemData, previousHints])

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: userMessage
    }])
    setInputValue('')

    // Fetch hint from API
    fetchHint(userMessage)
  }, [inputValue, fetchHint])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = hasImage && problemData && !isTyping && inputValue.trim()

  return (
    <aside className="hint-panel glass-card">
      <div className="hint-header">
        <h3 className="hint-title">
          <span style={{ fontSize: '1.25rem' }}>🧠</span>
          Socratic Guide
        </h3>
        <p className="hint-subtitle">
          {problemData 
            ? `Helping with: ${problemData.subject}` 
            : "I'll help you think, not give answers"}
        </p>
      </div>

      <div className="hint-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-header">
              <div className="message-avatar">
                {msg.type === 'ai' ? '🎓' : '👤'}
              </div>
              <span>{msg.type === 'ai' ? 'Socratic Tutor' : 'You'}</span>
            </div>
            <div className="message-content">
              {msg.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="hint-input">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !hasImage 
                ? "Upload an image first..." 
                : isAnalyzing 
                ? "Analyzing image..." 
                : !problemData 
                ? "Waiting for analysis..."
                : "Ask about your problem..."
            }
            disabled={!hasImage || !problemData || isTyping}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!canSend}
          >
            ➤
          </button>
        </div>
      </div>
    </aside>
  )
}

export default HintPanel
