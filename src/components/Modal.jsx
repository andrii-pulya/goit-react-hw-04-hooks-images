import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Modal({ largeImg, tags, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  function handleKeyDown(e) {
    if (e.code === 'Escape') {
      onClose()
    }
  }

  function handleBackdropClick(e) {
    if (e.currentTarget === e.target) onClose()
  }

  return (
    <div className="Overlay" onClick={handleBackdropClick}>
      <div className="Modal">
        <img src={largeImg} alt={tags} />
      </div>
    </div>
  )
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
