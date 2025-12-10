import { DocumentMeta, Template } from './document'

export type Theme = 'light' | 'dark'

export interface AppSettings {
  defaultLogo: string | null
  recentDocuments: DocumentMeta[]
  templates: Template[]
  theme: Theme
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultLogo: null,
  recentDocuments: [],
  templates: [],
  theme: 'light',
}
