import { Block } from '@/types'
import {
  CoverBlock,
  SectionBlock,
  ImageBlock,
  TableBlock,
  ListBlock,
  TextBlock,
  SectionTableBlock,
  SectionListBlock,
} from '@/components/blocks'

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'cover':
      return <CoverBlock block={block} />
    case 'section':
      return <SectionBlock block={block} />
    case 'image':
      return <ImageBlock block={block} />
    case 'table':
      return <TableBlock block={block} />
    case 'list':
      return <ListBlock block={block} />
    case 'text':
      return <TextBlock block={block} />
    case 'section-table':
      return <SectionTableBlock block={block} />
    case 'section-list':
      return <SectionListBlock block={block} />
    default:
      return <div className="text-red-500">Bloco desconhecido</div>
  }
}
