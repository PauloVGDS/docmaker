import { useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { CoverBlock as CoverBlockType } from '@/types'
import { useDocument } from '@/contexts'
import { fileToBase64, compressImage, loadDefaultImage } from '@/utils'

interface CoverBlockProps {
  block: CoverBlockType
}

export function CoverBlock({ block }: CoverBlockProps) {
  const { updateBlock } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64, 1920) // Maior resolucao para capa
    updateBlock<CoverBlockType>(block.id, { image: compressed })
  }

  const handleRemoveImage = () => {
    updateBlock<CoverBlockType>(block.id, { image: null })
  }

  const handleLoadDefaultImage = async () => {
    const base64 = await loadDefaultImage('cover')
    updateBlock<CoverBlockType>(block.id, { image: base64 })
  }

  return (
    <div className="relative min-h-[500px] rounded-lg overflow-hidden bg-gray-800">
      {block.data.image ? (
        // Estado COM imagem
        <div className="absolute inset-0">
          <img
            src={block.data.image}
            alt="Capa"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
          >
            <X size={18} />
          </button>
          {/* Titulo na parte inferior da imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-16">
            <input
              type="text"
              value={block.data.title}
              onChange={(e) => updateBlock<CoverBlockType>(block.id, { title: e.target.value })}
              className="text-2xl font-bold text-center w-full bg-transparent border-none outline-none focus:ring-0 text-white"
              placeholder="Titulo do Documento"
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
            />
          </div>
        </div>
      ) : (
        // Estado SEM imagem - botao de upload com titulo abaixo
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <Upload size={64} className="text-gray-400 mb-3" />
            <span className="text-gray-400 text-lg">Clique para adicionar imagem de capa</span>
            <span className="text-gray-500 text-sm mt-1">A imagem preenchera toda a primeira pagina</span>
          </button>
          <button
            onClick={handleLoadDefaultImage}
            className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ImageIcon size={16} />
            Usar imagem padrão
          </button>
          <input
            type="text"
            value={block.data.title}
            onChange={(e) => updateBlock<CoverBlockType>(block.id, { title: e.target.value })}
            className="mt-6 text-2xl font-bold text-center w-3/4 bg-transparent border-b border-gray-600 outline-none focus:border-gray-400 text-gray-300"
            placeholder="Titulo do Documento"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}
