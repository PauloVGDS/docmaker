import { Block } from '@/types'
import {
  CoverBlock,
  CoverDetailedBlock,
  SectionBlock,
  ImageBlock,
  TableBlock,
  ListBlock,
  TextBlock,
  SectionTableBlock,
  SectionListBlock,
  SectionTextBlock,
  SectionImageBlock,
} from '@/components/blocks'

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'cover':
      return <CoverBlock block={block} />
    case 'cover-detailed':
      return <CoverDetailedBlock block={block} />
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
    case 'section-text':
      return <SectionTextBlock block={block} />
    case 'section-image':
      return <SectionImageBlock block={block} />
    default:
      return <div className="text-red-500">Bloco desconhecido</div>
  }
}
