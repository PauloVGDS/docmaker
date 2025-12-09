import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { SectionImageBlock as SectionImageBlockType } from '@/types'
import { useDocument } from '@/contexts'
import { fileToBase64, compressImage } from '@/utils'

interface SectionImageBlockProps {
  block: SectionImageBlockType
}

export function SectionImageBlock({ block }: SectionImageBlockProps) {
  const { document, updateBlock } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fontSizes = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
  }

  // Calculate image number based on position (counting both 'image' and 'section-image' blocks)
  const imageNumber = document.blocks
    .filter((b) => b.type === 'image' || b.type === 'section-image')
    .findIndex((b) => b.id === block.id) + 1

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64)
    updateBlock<SectionImageBlockType>(block.id, { image: compressed })
  }

  const handleRemoveImage = () => {
    updateBlock<SectionImageBlockType>(block.id, { image: null })
  }

  return (
    <div className="py-2">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <select
          value={block.data.level}
          onChange={(e) =>
            updateBlock<SectionImageBlockType>(block.id, {
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
            updateBlock<SectionImageBlockType>(block.id, { title: e.target.value })
          }
          className={`flex-1 font-bold bg-transparent border-none outline-none focus:ring-0 ${fontSizes[block.data.level]}`}
          placeholder="Titulo da secao"
        />
      </div>

      {/* Image area */}
      <div className="flex justify-center mb-2">
        {block.data.image ? (
          <div className="relative" style={{ width: '13cm', maxWidth: '100%' }}>
            <img
              src={block.data.image}
              alt={block.data.description}
              className="w-full rounded-lg border border-gray-200"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-md h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-gray-500">Clique para adicionar imagem</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Description */}
      <div className="text-center">
        <span className="text-sm italic text-gray-600">Figura {imageNumber}: </span>
        <input
          type="text"
          value={block.data.description}
          onChange={(e) =>
            updateBlock<SectionImageBlockType>(block.id, { description: e.target.value })
          }
          className="text-sm italic text-gray-600 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Descrição da imagem"
        />
      </div>
    </div>
  )
}
