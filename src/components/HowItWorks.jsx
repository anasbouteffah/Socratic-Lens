function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '📸',
      title: 'Capture Your Problem',
      description: 'Take a photo or upload an image of your homework. Works with math equations, physics diagrams, chemistry structures, and more.'
    },
    {
      number: '02',
      icon: '✏️',
      title: 'Highlight What\'s Tricky',
      description: 'Use our drawing tools to circle or highlight the specific part you\'re stuck on. This helps the AI understand exactly where you need guidance.'
    },
    {
      number: '03',
      icon: '🧠',
      title: 'Get Socratic Hints',
      description: 'Our AI analyzes your problem and asks guiding questions. No direct answers – just thoughtful prompts that help you discover the solution yourself.'
    },
    {
      number: '04',
      icon: '💡',
      title: 'Build Real Understanding',
      description: 'By working through the hints, you develop genuine problem-solving skills that stick. Learn to think, not just memorize.'
    }
  ]

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">📚 The Process</span>
          <h2 className="section-title">
            How <span className="gradient-text">Socratic Lens</span> Works
          </h2>
          <p className="section-subtitle">
            A revolutionary approach to learning that respects your intelligence
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card glass-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
