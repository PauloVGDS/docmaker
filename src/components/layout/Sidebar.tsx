import { useDraggable } from '@dnd-kit/core'
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
} from 'lucide-react'
import { BlockType, BLOCK_LABELS, BLOCK_DESCRIPTIONS } from '@/types'

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

interface DraggableBlockProps {
  type: BlockType
}

function DraggableBlock({ type }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: { type, isNew: true },
  })

  const Icon = BLOCK_ICONS[type]

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg
        cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-sm
        transition-all duration-150
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
    >
      <div className="p-2 bg-blue-50 rounded-md text-blue-600">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{BLOCK_LABELS[type]}</p>
        <p className="text-xs text-gray-500 truncate">{BLOCK_DESCRIPTIONS[type]}</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  const blockTypes: BlockType[] = [
    'cover',
    'cover-detailed',
    'section',
    'text',
    'image',
    'table',
    'list',
    'section-table',
    'section-list',
    'section-text',
    'section-image',
  ]

  return (
    <aside className="w-72 bg-gray-50 border-r border-gray-200 p-4 flex flex-col h-full overflow-hidden">
      <h2 className="font-semibold text-gray-700 mb-4">Componentes</h2>
      <p className="text-sm text-gray-500 mb-4">
        Arraste os componentes para a área do documento
      </p>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {blockTypes.map((type) => (
          <DraggableBlock key={type} type={type} />
        ))}
      </div>
    </aside>
  )
}
