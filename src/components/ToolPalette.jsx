function ToolPalette({ 
  activeTool, 
  setActiveTool, 
  brushColor, 
  setBrushColor, 
  brushSize,
  setBrushSize,
  onClear 
}) {
  const tools = [
    { id: 'pen', icon: '✏️', label: 'Pen' },
    { id: 'highlighter', icon: '🖍️', label: 'Highlighter' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
  ]

  return (
    <div className="tool-palette">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => setActiveTool(tool.id)}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
      
      <div className="tool-divider" />
      
      <input
        type="color"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
        className="color-picker"
        title="Brush Color"
      />
      
      <select
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          padding: '4px 8px',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}
        title="Brush Size"
      >
        <option value={2}>Thin</option>
        <option value={4}>Medium</option>
        <option value={8}>Thick</option>
        <option value={16}>Extra Thick</option>
      </select>
      
      <div className="tool-divider" />
      
      <button 
        className="tool-btn" 
        onClick={onClear}
        title="Clear & Start Over"
      >
        🗑️
      </button>
    </div>
  )
}

export default ToolPalette
