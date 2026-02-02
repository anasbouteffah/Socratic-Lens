import { useState, useRef, useEffect } from 'react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'ai',
    content: "Hello! I'm your Socratic tutor. Upload a photo of your homework problem, and I'll help guide you to the solution through thoughtful questions – without giving you the answer directly.",
  }
]

const SAMPLE_HINTS = [
  "Interesting problem! Let me ask you this: What do you already know about this type of equation?",
  "Good thinking! Now, what happens if you isolate the variable on one side? What operation would you use?",
  "You're getting closer! Remember the fundamental principle here – what must remain balanced on both sides?",
  "Excellent progress! Before we continue, can you tell me what pattern you notice in this problem?",
  "Think about this: If you had a similar problem before, what approach worked then?",
]

function HintPanel({ hasImage }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add a hint when image is uploaded
  useEffect(() => {
    if (hasImage && messages.length === 1) {
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'ai',
            content: "I can see your problem! Take a moment to highlight or circle the part you're stuck on. Then tell me: What have you tried so far?"
          }])
        }, 1500)
      }, 500)
    }
  }, [hasImage, messages.length])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const randomHint = SAMPLE_HINTS[Math.floor(Math.random() * SAMPLE_HINTS.length)]
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: randomHint
      }])
    }, 1500 + Math.random() * 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <aside className="hint-panel glass-card">
      <div className="hint-header">
        <h3 className="hint-title">
          <span style={{ fontSize: '1.25rem' }}>🧠</span>
          Socratic Guide
        </h3>
        <p className="hint-subtitle">I'll help you think, not give answers</p>
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
            <div className="message-content">{msg.content}</div>
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
            placeholder={hasImage ? "Ask about your problem..." : "Upload an image first..."}
            disabled={!hasImage}
          />
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!hasImage || !inputValue.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </aside>
  )
}

export default HintPanel
