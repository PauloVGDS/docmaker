export type BlockType = 'cover' | 'cover-detailed' | 'section' | 'image' | 'table' | 'list' | 'text' | 'section-table' | 'section-list' | 'section-text' | 'section-image'

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface CoverBlock extends BaseBlock {
  type: 'cover'
  data: {
    title: string
    image: string | null
  }
}

export interface SectionBlock extends BaseBlock {
  type: 'section'
  data: {
    title: string
    level: 1 | 2 | 3
  }
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  data: {
    image: string
    description: string
  }
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  data: {
    headers: string[]
    rows: string[][]
  }
}

export interface ListBlock extends BaseBlock {
  type: 'list'
  data: {
    style: 'bullet' | 'numbered'
    items: string[]
  }
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  data: {
    content: string
  }
}

export interface SectionTableBlock extends BaseBlock {
  type: 'section-table'
  data: {
    title: string
    level: 1 | 2 | 3
    headers: string[]
    rows: string[][]
  }
}

export interface SectionListBlock extends BaseBlock {
  type: 'section-list'
  data: {
    title: string
    level: 1 | 2 | 3
    style: 'bullet' | 'numbered'
    items: string[]
  }
}

export interface SectionTextBlock extends BaseBlock {
  type: 'section-text'
  data: {
    title: string
    level: 1 | 2 | 3
    content: string
  }
}

export interface SectionImageBlock extends BaseBlock {
  type: 'section-image'
  data: {
    title: string
    level: 1 | 2 | 3
    image: string | null
    description: string
  }
}

export interface CoverDetailedBlock extends BaseBlock {
  type: 'cover-detailed'
  data: {
    title: string
    image: string | null
    machineName: string
    responsibleName: string
    date: string
  }
}

export type Block =
  | CoverBlock
  | CoverDetailedBlock
  | SectionBlock
  | ImageBlock
  | TableBlock
  | ListBlock
  | TextBlock
  | SectionTableBlock
  | SectionListBlock
  | SectionTextBlock
  | SectionImageBlock

export const BLOCK_LABELS: Record<BlockType, string> = {
  cover: 'Capa',
  'cover-detailed': 'Capa Detalhada',
  section: 'Seção',
  image: 'Imagem',
  table: 'Tabela',
  list: 'Lista',
  text: 'Texto',
  'section-table': 'Seção + Tabela',
  'section-list': 'Seção + Lista',
  'section-text': 'Seção + Texto',
  'section-image': 'Seção + Imagem',
}

export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  cover: 'Página de capa com imagem e título',
  'cover-detailed': 'Capa com máquina, responsável e data',
  section: 'Título de seção',
  image: 'Imagem com descrição numerada',
  table: 'Tabela editável',
  list: 'Lista com marcadores ou numerada',
  text: 'Bloco de texto simples',
  'section-table': 'Título de seção com tabela abaixo',
  'section-list': 'Título de seção com lista abaixo',
  'section-text': 'Título de seção com texto abaixo',
  'section-image': 'Título de seção com imagem abaixo',
}
