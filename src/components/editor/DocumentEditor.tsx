import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { useDocument } from '@/contexts'
import { BlockType, BLOCK_LABELS } from '@/types'
import { Sidebar } from '@/components/layout'
import { DocumentCanvas } from './DocumentCanvas'

export function DocumentEditor() {
  const { addBlock, moveBlock } = useDocument()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeData = active.data.current

    // Check if it's a new block from sidebar
    if (activeData?.isNew) {
      addBlock(activeData.type as BlockType)
      return
    }

    // Otherwise it's a reorder
    if (active.id !== over.id) {
      moveBlock(active.id as string, over.id as string)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <DocumentCanvas />
      </div>

      <DragOverlay>
        {activeId?.startsWith('new-') && (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 shadow-lg">
            <p className="font-medium text-blue-700">
              {BLOCK_LABELS[activeId.replace('new-', '') as BlockType]}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
