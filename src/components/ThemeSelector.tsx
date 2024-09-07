import { Button } from "@/components/ui/button"

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = ['default', 'dark', 'light', 'colorful']

  return (
    <div className="flex space-x-2 mb-4">
      {themes.map((theme) => (
        <Button
          key={theme}
          onClick={() => onThemeChange(theme)}
          variant={currentTheme === theme ? 'default' : 'outline'}
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </Button>
      ))}
    </div>
  )
}
