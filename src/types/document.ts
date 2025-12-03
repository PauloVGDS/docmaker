import { Block } from './blocks'

export interface DocumentSettings {
  companyLogo: string | null
  pageSize: 'A4' | 'Letter'
}

export interface Document {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  settings: DocumentSettings
  blocks: Block[]
}

export interface Template {
  id: string
  name: string
  description: string
  blocks: Block[]
  createdAt: string
}

export interface DocumentMeta {
  id: string
  title: string
  updatedAt: string
}

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  companyLogo: null,
  pageSize: 'A4',
}
