import { useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { Modal, Button } from '@/components/ui'
import { useSettings, useDocument } from '@/contexts'
import { fileToBase64, compressImage } from '@/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, setDefaultLogo } = useSettings()
  const { document, updateSettings } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64, 400, 0.9)

    // Set as default and current document logo
    setDefaultLogo(compressed)
    updateSettings({ companyLogo: compressed })
  }

  const handleRemoveLogo = () => {
    setDefaultLogo(null)
    updateSettings({ companyLogo: null })
  }

  const currentLogo = document.settings.companyLogo || settings.defaultLogo

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações"
      footer={
        <Button onClick={onClose}>Fechar</Button>
      }
    >
      <div className="space-y-6">
        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo da Empresa (Rodapé)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Esta logo aparecerá centralizada no rodapé de todas as páginas do documento exportado.
          </p>

          {currentLogo ? (
            <div className="flex items-center gap-4">
              <div className="p-2 border border-gray-200 rounded-lg">
                <img
                  src={currentLogo}
                  alt="Logo da empresa"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  Trocar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveLogo}
                >
                  <Trash2 size={16} />
                  Remover
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload size={24} className="text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">Clique para adicionar logo</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho da Página
          </label>
          <select
            value={document.settings.pageSize}
            onChange={(e) => updateSettings({ pageSize: e.target.value as 'A4' | 'Letter' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A4">A4 (210 x 297 mm)</option>
            <option value="Letter">Carta (216 x 279 mm)</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}
