import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { CoverDetailedBlock as CoverDetailedBlockType } from '@/types'
import { useDocument } from '@/contexts'
import { fileToBase64, compressImage } from '@/utils'

interface CoverDetailedBlockProps {
  block: CoverDetailedBlockType
}

export function CoverDetailedBlock({ block }: CoverDetailedBlockProps) {
  const { updateBlock } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64, 1920) // Maior resolucao para capa
    updateBlock<CoverDetailedBlockType>(block.id, { image: compressed })
  }

  const handleRemoveImage = () => {
    updateBlock<CoverDetailedBlockType>(block.id, { image: null })
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
          {/* Conteudo na parte inferior da imagem */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/70 to-transparent">
            {/* Titulo centralizado */}
            <input
              type="text"
              value={block.data.title}
              onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { title: e.target.value })}
              className="text-2xl font-bold text-center w-full bg-transparent border-none outline-none focus:ring-0 text-white mb-4"
              placeholder="Titulo do Documento"
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
            />
            {/* Campos adicionais alinhados a esquerda */}
            <div className="space-y-2 text-left max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 w-28">Máquina:</span>
                <input
                  type="text"
                  value={block.data.machineName}
                  onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { machineName: e.target.value })}
                  className="flex-1 text-sm bg-transparent border-b border-gray-500 outline-none focus:border-white text-white"
                  placeholder="Nome da máquina"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 w-28">Responsável:</span>
                <input
                  type="text"
                  value={block.data.responsibleName}
                  onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { responsibleName: e.target.value })}
                  className="flex-1 text-sm bg-transparent border-b border-gray-500 outline-none focus:border-white text-white"
                  placeholder="Nome do responsável"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 w-28">Data:</span>
                <input
                  type="text"
                  value={block.data.date}
                  onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { date: e.target.value })}
                  className="flex-1 text-sm bg-transparent border-b border-gray-500 outline-none focus:border-white text-white"
                  placeholder="Data do documento"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Estado SEM imagem - botao de upload com campos abaixo
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <Upload size={64} className="text-gray-400 mb-3" />
            <span className="text-gray-400 text-lg">Clique para adicionar imagem de capa</span>
            <span className="text-gray-500 text-sm mt-1">A imagem preenchera toda a primeira pagina</span>
          </button>

          {/* Titulo */}
          <input
            type="text"
            value={block.data.title}
            onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { title: e.target.value })}
            className="mt-6 text-2xl font-bold text-center w-3/4 bg-transparent border-b border-gray-600 outline-none focus:border-gray-400 text-gray-300"
            placeholder="Titulo do Documento"
          />

          {/* Campos adicionais */}
          <div className="mt-6 space-y-3 w-3/4 max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 w-28">Máquina:</span>
              <input
                type="text"
                value={block.data.machineName}
                onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { machineName: e.target.value })}
                className="flex-1 text-sm bg-transparent border-b border-gray-600 outline-none focus:border-gray-400 text-gray-300"
                placeholder="Nome da máquina"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 w-28">Responsável:</span>
              <input
                type="text"
                value={block.data.responsibleName}
                onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { responsibleName: e.target.value })}
                className="flex-1 text-sm bg-transparent border-b border-gray-600 outline-none focus:border-gray-400 text-gray-300"
                placeholder="Nome do responsável"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 w-28">Data:</span>
              <input
                type="text"
                value={block.data.date}
                onChange={(e) => updateBlock<CoverDetailedBlockType>(block.id, { date: e.target.value })}
                className="flex-1 text-sm bg-transparent border-b border-gray-600 outline-none focus:border-gray-400 text-gray-300"
                placeholder="Data do documento"
              />
            </div>
          </div>
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
