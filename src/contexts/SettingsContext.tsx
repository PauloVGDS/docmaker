import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { AppSettings, Template, DocumentMeta, Theme, DEFAULT_APP_SETTINGS } from '@/types'

const STORAGE_KEY = 'docmaker_settings'

interface SettingsContextType {
  settings: AppSettings
  setDefaultLogo: (logo: string | null) => void
  setTheme: (theme: Theme) => void
  addRecentDocument: (doc: DocumentMeta) => void
  removeRecentDocument: (id: string) => void
  addTemplate: (template: Template) => void
  removeTemplate: (id: string) => void
  updateTemplate: (id: string, updates: Partial<Template>) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return DEFAULT_APP_SETTINGS
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  // Apply theme on initial load
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setDefaultLogo = useCallback((logo: string | null) => {
    setSettings((prev) => ({ ...prev, defaultLogo: logo }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }))
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const addRecentDocument = useCallback((doc: DocumentMeta) => {
    setSettings((prev) => {
      const filtered = prev.recentDocuments.filter((d) => d.id !== doc.id)
      return {
        ...prev,
        recentDocuments: [doc, ...filtered].slice(0, 10),
      }
    })
  }, [])

  const removeRecentDocument = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      recentDocuments: prev.recentDocuments.filter((d) => d.id !== id),
    }))
  }, [])

  const addTemplate = useCallback((template: Template) => {
    setSettings((prev) => ({
      ...prev,
      templates: [...prev.templates, template],
    }))
  }, [])

  const removeTemplate = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== id),
    }))
  }, [])

  const updateTemplate = useCallback((id: string, updates: Partial<Template>) => {
    setSettings((prev) => ({
      ...prev,
      templates: prev.templates.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }))
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setDefaultLogo,
        setTheme,
        addRecentDocument,
        removeRecentDocument,
        addTemplate,
        removeTemplate,
        updateTemplate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
