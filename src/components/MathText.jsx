import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Renders text with LaTeX math formulas and basic markdown
 * - LaTeX: $..$ for inline, $$...$$ for block
 * - Markdown: **bold**, *italic*, `code`
 */
function MathText({ children }) {
  const rendered = useMemo(() => {
    if (!children || typeof children !== 'string') return children

    let text = children

    // Process LaTeX first
    // Block math: $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
      try {
        return `<div class="math-block">${katex.renderToString(latex.trim(), { 
          displayMode: true,
          throwOnError: false 
        })}</div>`
      } catch {
        return `<code class="math-error">${latex}</code>`
      }
    })

    // Inline math: $...$  or \(...\) or raw LaTeX patterns
    text = text.replace(/\$([^$]+)\$/g, (match, latex) => {
      try {
        return katex.renderToString(latex.trim(), { 
          displayMode: false,
          throwOnError: false 
        })
      } catch {
        return `<code>${latex}</code>`
      }
    })

    // Handle raw LaTeX (like \sqrt, \frac, \int without $ delimiters)
    // Detect common LaTeX commands and wrap them
    const latexPattern = /(\\(?:sqrt|frac|int|sum|prod|lim|alpha|beta|gamma|delta|theta|pi|infty|partial|nabla|cdot|times|div|pm|mp|leq|geq|neq|approx|equiv|subset|supset|cup|cap|in|notin|forall|exists|rightarrow|leftarrow|Rightarrow|Leftarrow|ldots|cdots|vdots|ddots)(?:\{[^}]*\}|\[[^\]]*\]|[_^][^{}\s]|\s)*)+/g
    
    text = text.replace(latexPattern, (match) => {
      // Skip if already inside HTML tags (already processed)
      if (match.includes('<')) return match
      try {
        return katex.renderToString(match.trim(), { 
          displayMode: false,
          throwOnError: false 
        })
      } catch {
        return `<code>${match}</code>`
      }
    })

    // Process markdown
    // Bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Italic: *text*
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Inline code: `text`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>')

    return text
  }, [children])

  return (
    <span 
      className="math-text"
      dangerouslySetInnerHTML={{ __html: rendered }} 
    />
  )
}

export default MathText
