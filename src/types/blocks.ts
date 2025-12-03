export type BlockType = 'cover' | 'section' | 'image' | 'table' | 'list' | 'text' | 'section-table' | 'section-list'

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

export type Block =
  | CoverBlock
  | SectionBlock
  | ImageBlock
  | TableBlock
  | ListBlock
  | TextBlock
  | SectionTableBlock
  | SectionListBlock

export const BLOCK_LABELS: Record<BlockType, string> = {
  cover: 'Capa',
  section: 'Seção',
  image: 'Imagem',
  table: 'Tabela',
  list: 'Lista',
  text: 'Texto',
  'section-table': 'Seção + Tabela',
  'section-list': 'Seção + Lista',
}

export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  cover: 'Página de capa com imagem e título',
  section: 'Título de seção',
  image: 'Imagem com descrição numerada',
  table: 'Tabela editável',
  list: 'Lista com marcadores ou numerada',
  text: 'Bloco de texto simples',
  'section-table': 'Título de seção com tabela abaixo',
  'section-list': 'Título de seção com lista abaixo',
}
