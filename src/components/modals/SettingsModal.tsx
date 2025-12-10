import { useRef } from 'react'
import { Upload, Trash2, Sun, Moon, ImageIcon } from 'lucide-react'
import { Modal, Button } from '@/components/ui'
import { useSettings, useDocument } from '@/contexts'
import { fileToBase64, compressImage, loadDefaultImage } from '@/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, setDefaultLogo, setTheme } = useSettings()
  const { document, updateSettings } = useDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const base64 = await fileToBase64(file)
    const compressed = await compressImage(base64, 800, 0.95)

    // Set as default and current document logo
    setDefaultLogo(compressed)
    updateSettings({ companyLogo: compressed })
  }

  const handleRemoveLogo = () => {
    setDefaultLogo(null)
    updateSettings({ companyLogo: null })
  }

  const handleLoadDefaultLogo = async () => {
    const base64 = await loadDefaultImage('footer')
    setDefaultLogo(base64)
    updateSettings({ companyLogo: base64 })
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo da Empresa (Rodapé)
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Esta logo aparecerá centralizada no rodapé de todas as páginas do documento exportado.
          </p>

          {currentLogo ? (
            <div className="flex items-center gap-4">
              <div className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
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
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Upload size={24} className="text-gray-400 mb-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Clique para adicionar logo</span>
              </button>
              <button
                onClick={handleLoadDefaultLogo}
                className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2"
              >
                <ImageIcon size={16} />
                Usar logo padrão
              </button>
            </div>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamanho da Página
          </label>
          <select
            value={document.settings.pageSize}
            onChange={(e) => updateSettings({ pageSize: e.target.value as 'A4' | 'Letter' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="A4">A4 (210 x 297 mm)</option>
            <option value="Letter">Carta (216 x 279 mm)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tema
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                settings.theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <Sun size={20} />
              <span>Claro</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                settings.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <Moon size={20} />
              <span>Escuro</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
