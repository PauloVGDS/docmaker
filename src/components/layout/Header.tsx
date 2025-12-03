import { useState } from 'react'
import { FileText, Download, Upload, Settings, FilePlus, Save } from 'lucide-react'
import { Button } from '@/components/ui'
import { useDocument } from '@/contexts'
import { ExportModal } from '@/components/modals/ExportModal'
import { SettingsModal } from '@/components/modals/SettingsModal'
import { SaveModal } from '@/components/modals/SaveModal'
import { LoadModal } from '@/components/modals/LoadModal'

export function Header() {
  const { document, updateTitle, resetDocument } = useDocument()
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [isLoadOpen, setIsLoadOpen] = useState(false)

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600">
            <FileText size={24} />
            <span className="font-bold text-lg">DocMaker</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <input
            type="text"
            value={document.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-lg font-medium bg-transparent border-none outline-none focus:ring-0 w-64"
            placeholder="Título do documento"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => resetDocument()}>
            <FilePlus size={18} />
            Novo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsLoadOpen(true)}>
            <Upload size={18} />
            Abrir
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsSaveOpen(true)}>
            <Save size={18} />
            Salvar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsExportOpen(true)}>
            <Download size={18} />
            Exportar
          </Button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={18} />
          </Button>
        </div>
      </header>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SaveModal isOpen={isSaveOpen} onClose={() => setIsSaveOpen(false)} />
      <LoadModal isOpen={isLoadOpen} onClose={() => setIsLoadOpen(false)} />
    </>
  )
}
