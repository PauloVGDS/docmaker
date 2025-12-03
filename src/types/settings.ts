import { DocumentMeta, Template } from './document'

export interface AppSettings {
  defaultLogo: string | null
  recentDocuments: DocumentMeta[]
  templates: Template[]
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultLogo: null,
  recentDocuments: [],
  templates: [],
}
