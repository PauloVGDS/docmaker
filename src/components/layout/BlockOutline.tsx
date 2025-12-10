import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Image,
  Type,
  Table,
  List,
  FileImage,
  Heading,
  TableProperties,
  ListTree,
  FileText,
  ImagePlus,
  FileSpreadsheet,
  GripVertical,
} from 'lucide-react'
import { useDocument } from '@/contexts'
import { Block, BlockType, BLOCK_LABELS } from '@/types'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  cover: FileImage,
  'cover-detailed': FileSpreadsheet,
  section: Heading,
  image: Image,
  table: Table,
  list: List,
  text: Type,
  'section-table': TableProperties,
  'section-list': ListTree,
  'section-text': FileText,
  'section-image': ImagePlus,
}

function getBlockTitle(block: Block): string {
  switch (block.type) {
    case 'cover':
    case 'cover-detailed':
    case 'section':
    case 'section-table':
    case 'section-list':
    case 'section-text':
    case 'section-image':
      return block.data.title || BLOCK_LABELS[block.type]
    case 'text':
      return block.data.content?.slice(0, 30) || BLOCK_LABELS[block.type]
    case 'image':
      return block.data.description?.slice(0, 30) || BLOCK_LABELS[block.type]
    default:
      return BLOCK_LABELS[block.type]
  }
}

interface OutlineItemProps {
  block: Block
  index: number
}

function OutlineItem({ block, index }: OutlineItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Icon = BLOCK_ICONS[block.type]
  const title = getBlockTitle(block)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-md
        hover:border-blue-400 hover:bg-blue-50 transition-colors
        ${isDragging ? 'opacity-50 shadow-lg z-50' : ''}
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>
      <span className="text-xs text-gray-400 w-5">{index + 1}</span>
      <Icon size={14} className="text-blue-600 flex-shrink-0" />
      <span className="text-sm text-gray-700 truncate flex-1" title={title}>
        {title}
      </span>
    </div>
  )
}

export function BlockOutline() {
  const { document } = useDocument()

  if (document.blocks.length === 0) {
    return (
      <aside className="w-56 bg-gray-50 border-l border-gray-200 p-4 flex flex-col h-full overflow-hidden">
        <h2 className="font-semibold text-gray-700 mb-4 text-sm">Estrutura</h2>
        <p className="text-xs text-gray-400 text-center py-8">
          Nenhum componente adicionado
        </p>
      </aside>
    )
  }

  return (
    <aside className="w-56 bg-gray-50 border-l border-gray-200 p-4 flex flex-col h-full overflow-hidden">
      <h2 className="font-semibold text-gray-700 mb-2 text-sm">Estrutura</h2>
      <p className="text-xs text-gray-500 mb-3">
        Arraste para reorganizar
      </p>
      <div className="flex flex-col gap-1 overflow-y-auto flex-1">
        <SortableContext
          items={document.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {document.blocks.map((block, index) => (
            <OutlineItem key={block.id} block={block} index={index} />
          ))}
        </SortableContext>
      </div>
    </aside>
  )
}
