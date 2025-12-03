import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDocument } from '@/contexts'
import { BlockWrapper } from './BlockWrapper'
import { BlockRenderer } from './BlockRenderer'
import { FileText } from 'lucide-react'

export function DocumentCanvas() {
  const { document } = useDocument()
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
      <div
        ref={setNodeRef}
        className={`
          max-w-4xl mx-auto bg-white shadow-lg rounded-lg min-h-[800px] p-8
          transition-all duration-200
          ${isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        `}
      >
        {document.blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
            <FileText size={64} strokeWidth={1} />
            <p className="mt-4 text-lg">Documento vazio</p>
            <p className="text-sm">Arraste componentes da barra lateral para começar</p>
          </div>
        ) : (
          <SortableContext
            items={document.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {document.blocks.map((block, index) => (
              <BlockWrapper key={block.id} block={block} index={index}>
                <BlockRenderer block={block} />
              </BlockWrapper>
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  )
}
