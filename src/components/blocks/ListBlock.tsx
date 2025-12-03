import { Plus, Trash2 } from 'lucide-react'
import { ListBlock as ListBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface ListBlockProps {
  block: ListBlockType
}

export function ListBlock({ block }: ListBlockProps) {
  const { updateBlock } = useDocument()

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.data.items]
    newItems[index] = value
    updateBlock<ListBlockType>(block.id, { items: newItems })
  }

  const addItem = () => {
    const newItems = [...block.data.items, '']
    updateBlock<ListBlockType>(block.id, { items: newItems })
  }

  const removeItem = (index: number) => {
    if (block.data.items.length <= 1) return
    const newItems = block.data.items.filter((_, i) => i !== index)
    updateBlock<ListBlockType>(block.id, { items: newItems })
  }

  const toggleStyle = () => {
    updateBlock<ListBlockType>(block.id, {
      style: block.data.style === 'bullet' ? 'numbered' : 'bullet',
    })
  }

  return (
    <div className="py-2">
      {/* Controls */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={toggleStyle}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            block.data.style === 'bullet'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          • Marcadores
        </button>
        <button
          onClick={toggleStyle}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            block.data.style === 'numbered'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          1. Numerada
        </button>
      </div>

      {/* List items */}
      <div className="space-y-1">
        {block.data.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="w-6 text-gray-500 text-right">
              {block.data.style === 'numbered' ? `${index + 1}.` : '•'}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 bg-transparent outline-none focus:ring-0 border-b border-transparent focus:border-gray-300"
              placeholder="Item da lista"
            />
            <button
              onClick={() => removeItem(index)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-opacity"
              disabled={block.data.items.length <= 1}
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Add item button */}
      <button
        onClick={addItem}
        className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Plus size={14} />
        Adicionar item
      </button>
    </div>
  )
}
