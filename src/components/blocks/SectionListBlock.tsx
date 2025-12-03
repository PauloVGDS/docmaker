import { Plus, Trash2 } from 'lucide-react'
import { SectionListBlock as SectionListBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface SectionListBlockProps {
  block: SectionListBlockType
}

export function SectionListBlock({ block }: SectionListBlockProps) {
  const { updateBlock } = useDocument()

  const fontSizes = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.data.items]
    newItems[index] = value
    updateBlock<SectionListBlockType>(block.id, { items: newItems })
  }

  const addItem = () => {
    const newItems = [...block.data.items, '']
    updateBlock<SectionListBlockType>(block.id, { items: newItems })
  }

  const removeItem = (index: number) => {
    if (block.data.items.length <= 1) return
    const newItems = block.data.items.filter((_, i) => i !== index)
    updateBlock<SectionListBlockType>(block.id, { items: newItems })
  }

  const toggleStyle = () => {
    updateBlock<SectionListBlockType>(block.id, {
      style: block.data.style === 'bullet' ? 'numbered' : 'bullet',
    })
  }

  return (
    <div className="py-2">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <select
          value={block.data.level}
          onChange={(e) =>
            updateBlock<SectionListBlockType>(block.id, {
              level: parseInt(e.target.value) as 1 | 2 | 3,
            })
          }
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <input
          type="text"
          value={block.data.title}
          onChange={(e) =>
            updateBlock<SectionListBlockType>(block.id, { title: e.target.value })
          }
          className={`flex-1 font-bold bg-transparent border-none outline-none focus:ring-0 ${fontSizes[block.data.level]}`}
          placeholder="Titulo da secao"
        />
      </div>

      {/* List Style Toggle */}
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

      {/* List Items */}
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

      {/* Add Item Button */}
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
