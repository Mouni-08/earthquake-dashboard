import React from 'react'
import './ErrorBox.css'

export default function ErrorBox({ message, onRetry }){
  return (
    <div className="error-root">
      <div>
        <div className="err-title">Error</div>
        <div className="err-message">{message}</div>
      </div>
      <div>
        <button className="err-btn" onClick={onRetry}>Retry</button>
      </div>
    </div>
  )
}
