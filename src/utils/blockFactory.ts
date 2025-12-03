import { Block, BlockType } from '@/types'
import { generateId } from './idGenerator'

export function createBlock(type: BlockType): Block {
  const id = generateId()

  switch (type) {
    case 'cover':
      return {
        id,
        type: 'cover',
        data: {
          title: 'Título do Documento',
          image: null,
        },
      }
    case 'section':
      return {
        id,
        type: 'section',
        data: {
          title: 'Nova Seção',
          level: 1,
        },
      }
    case 'image':
      return {
        id,
        type: 'image',
        data: {
          image: '',
          description: 'Descrição da imagem',
        },
      }
    case 'table':
      return {
        id,
        type: 'table',
        data: {
          headers: ['Coluna 1', 'Coluna 2', 'Coluna 3'],
          rows: [
            ['', '', ''],
            ['', '', ''],
          ],
        },
      }
    case 'list':
      return {
        id,
        type: 'list',
        data: {
          style: 'bullet',
          items: ['Item 1', 'Item 2', 'Item 3'],
        },
      }
    case 'text':
      return {
        id,
        type: 'text',
        data: {
          content: 'Digite o texto aqui...',
        },
      }
    case 'section-table':
      return {
        id,
        type: 'section-table',
        data: {
          title: 'Nova Seção',
          level: 1,
          headers: ['Coluna 1', 'Coluna 2', 'Coluna 3'],
          rows: [
            ['', '', ''],
            ['', '', ''],
          ],
        },
      }
    case 'section-list':
      return {
        id,
        type: 'section-list',
        data: {
          title: 'Nova Seção',
          level: 1,
          style: 'bullet',
          items: ['Item 1', 'Item 2', 'Item 3'],
        },
      }
  }
}
