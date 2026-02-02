function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">🎓</div>
              <span className="gradient-text">Socratic Lens</span>
            </div>
            <p className="footer-tagline">
              Learn to think, not just copy. The AI tutor that respects your intelligence.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#how-it-works">How it Works</a>
              <a href="#examples">Examples</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">GitHub</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Socratic Lens. Built for learners, by learners.</p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-link" aria-label="GitHub">⌂</a>
            <a href="#" className="social-link" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
