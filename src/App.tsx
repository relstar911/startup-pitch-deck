import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import EntryForm from './components/EntryForm'
import PresentationSlide from './components/PresentationSlide'
import './index.css';
import { Dashboard } from './components/Dashboard';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<EntryForm />} />
          <Route path="/presentation" element={<PresentationSlide />} />
          <Route path="/presentation/:id" element={<PresentationSlide />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}