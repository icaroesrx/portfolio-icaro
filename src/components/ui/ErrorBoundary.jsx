import { Component } from 'react'

/**
 * Catches render errors in its children and shows `fallback` instead.
 * Used around the 3D canvas: if WebGL is unavailable, the rest of the page
 * keeps working.
 */
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('A part of the page failed to render:', error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
