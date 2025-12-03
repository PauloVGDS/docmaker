import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { ImageBlock as ImageBlockType } from '@/types'
import { useDocument } from '@/contexts'
import { fileToBase64, compressImage } from '@/utils'

interface ImageBlockProps {
  block: ImageBlockType
}

export function ImageBlock({ block }: ImageBlockProps) {
  const { document, updateBlock } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate image number based on position
  const imageNumber = document.blocks
    .filter((b) => b.type === 'image')
    .findIndex((b) => b.id === block.id) + 1

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64)
    updateBlock<ImageBlockType>(block.id, { image: compressed })
  }

  const handleRemoveImage = () => {
    updateBlock<ImageBlockType>(block.id, { image: '' })
  }

  return (
    <div className="py-4">
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
            updateBlock<ImageBlockType>(block.id, { description: e.target.value })
          }
          className="text-sm italic text-gray-600 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Descrição da imagem"
        />
      </div>
    </div>
  )
}
