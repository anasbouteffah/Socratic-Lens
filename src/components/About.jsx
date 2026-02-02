function About() {
  const features = [
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your homework images are processed securely and never stored permanently.'
    },
    {
      icon: '🎓',
      title: 'Teacher Approved',
      description: 'Designed with educators in mind – promotes genuine learning, not shortcuts.'
    },
    {
      icon: '🌍',
      title: 'Works Everywhere',
      description: 'Use from any device – desktop, tablet, or phone with a camera.'
    }
  ]

  const techStack = [
    { name: 'Computer Vision', desc: 'CNN-based recognition for handwriting & diagrams' },
    { name: 'LLM Reasoning', desc: 'Advanced language models for Socratic questioning' },
    { name: 'React Frontend', desc: 'Modern, responsive user interface' }
  ]

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-badge">🚀 About the Project</span>
            <h2 className="section-title">
              Built for <span className="gradient-text">Real Learning</span>
            </h2>
            <p className="about-text">
              Socratic Lens was created to solve a growing problem in education: AI tools that 
              give students answers instead of helping them learn. Inspired by the Socratic 
              method of teaching through questions, our platform guides students to discover 
              solutions on their own.
            </p>
            <p className="about-text">
              We believe that struggling with a problem – with the right guidance – is where 
              real learning happens. Our AI is trained to ask the right questions at the right 
              time, building your problem-solving skills for life.
            </p>

            <div className="features-list">
              {features.map((feature) => (
                <div key={feature.title} className="feature-item">
                  <span className="feature-icon">{feature.icon}</span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tech-stack glass-card">
            <h3 className="tech-title">
              <span>⚙️</span> Technology Stack
            </h3>
            <div className="tech-list">
              {techStack.map((tech) => (
                <div key={tech.name} className="tech-item">
                  <div className="tech-name">{tech.name}</div>
                  <div className="tech-desc">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
