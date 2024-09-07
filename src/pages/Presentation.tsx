import PresentationSlide from '../components/PresentationSlide'
import { ThemeSelector } from '@/components/ThemeSelector'
import { useState } from 'react'

export default function Presentation() {
  const [theme, setTheme] = useState('default')

  return (
    <div className={`theme-${theme}`}>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <PresentationSlide />
    </div>
  )
}