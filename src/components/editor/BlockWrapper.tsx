import { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Copy } from 'lucide-react'
import { Block } from '@/types'
import { useDocument } from '@/contexts'
import { createBlock } from '@/utils'

interface BlockWrapperProps {
  block: Block
  index: number
  children: ReactNode
}

export function BlockWrapper({ block, index, children }: BlockWrapperProps) {
  const { deleteBlock, addBlock } = useDocument()
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

  const handleDuplicate = () => {
    const newBlock = createBlock(block.type)
    // Copy data from current block
    Object.assign(newBlock.data, block.data)
    addBlock(block.type, index + 1)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative mb-4 m-2 rounded-lg border-2 border-transparent
        hover:border-gray-200 transition-all duration-150
        ${isDragging ? 'opacity-50 z-50 shadow-xl' : ''}
      `}
    >
      {/* Drag handle and actions */}
      <div
        className={`
          absolute -left-9 top-1/2 -translate-y-1/2 flex flex-col gap-1
          opacity-0 group-hover:opacity-100 transition-opacity
        `}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-2  rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          title="Arrastar"
        >
          <GripVertical size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Action buttons */}
      <div
        className={`
          absolute -right-9 top-1/2 -translate-y-1/2 flex flex-col gap-1
          opacity-0 group-hover:opacity-100 transition-opacity
        `}
      >
        <button
          onClick={handleDuplicate}
          className="p-2 rounded hover:bg-gray-100"
          title="Duplicar"
        >
          <Copy size={16} className="text-gray-400" />
        </button>
        <button
          onClick={() => deleteBlock(block.id)}
          className="p-2 rounded hover:bg-red-50"
          title="Excluir"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>

      {/* Block content */}
      <div className="p-1">{children}</div>
    </div>
  )
}
