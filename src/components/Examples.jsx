function Examples() {
  const examples = [
    {
      subject: 'Mathematics',
      icon: '📐',
      problem: 'Solve: 2x² + 5x - 3 = 0',
      hint: '"What methods do you know for solving quadratic equations? Have you tried factoring?"',
      color: '#6366f1'
    },
    {
      subject: 'Physics',
      icon: '⚡',
      problem: 'A ball is thrown upward at 20 m/s. Find max height.',
      hint: '"At the highest point, what happens to the velocity? What equation relates velocity to height?"',
      color: '#8b5cf6'
    },
    {
      subject: 'Chemistry',
      icon: '🧪',
      problem: 'Balance: Fe + O₂ → Fe₂O₃',
      hint: '"Count the atoms on each side. Which element is unbalanced first?"',
      color: '#a855f7'
    },
    {
      subject: 'Calculus',
      icon: '∫',
      problem: 'Find the derivative of f(x) = x³sin(x)',
      hint: '"This is a product of two functions. What rule applies when differentiating products?"',
      color: '#ec4899'
    }
  ]

  return (
    <section className="examples" id="examples">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">🎯 Real Examples</span>
          <h2 className="section-title">
            See <span className="gradient-text">Socratic Teaching</span> in Action
          </h2>
          <p className="section-subtitle">
            Here's how our AI guides students through different types of problems
          </p>
        </div>

        <div className="examples-grid">
          {examples.map((example, index) => (
            <div 
              key={example.subject} 
              className="example-card glass-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="example-header">
                <span className="example-icon" style={{ background: example.color }}>
                  {example.icon}
                </span>
                <span className="example-subject">{example.subject}</span>
              </div>
              
              <div className="example-problem">
                <span className="label">Problem:</span>
                <p>{example.problem}</p>
              </div>
              
              <div className="example-hint">
                <span className="label">Socratic Hint:</span>
                <p>{example.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Examples
