import { useState } from 'react'
import { FileText, FileIcon } from 'lucide-react'
import { Modal } from '@/components/ui'
import { useDocument } from '@/contexts'
import { exportToPdf } from '@/services/pdfExporter'
import { exportToDocx } from '@/services/docxExporter'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { document } = useDocument()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPdf = async () => {
    setIsExporting(true)
    try {
      await exportToPdf(document)
      onClose()
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Verifique o console para mais detalhes.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDocx = async () => {
    setIsExporting(true)
    try {
      await exportToDocx(document)
      onClose()
    } catch (error) {
      console.error('Erro ao exportar DOCX:', error)
      alert('Erro ao exportar DOCX. Verifique o console para mais detalhes.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar Documento"
    >
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Escolha o formato para exportar "{document.title}"
        </p>

        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
        >
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <FileText size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">PDF</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Formato ideal para impressão e compartilhamento
            </p>
          </div>
        </button>

        <button
          onClick={handleExportDocx}
          disabled={isExporting}
          className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
        >
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileIcon size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">DOCX</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Formato editável do Microsoft Word
            </p>
          </div>
        </button>

        {isExporting && (
          <p className="text-center text-gray-500 dark:text-gray-400">Exportando...</p>
        )}
      </div>
    </Modal>
  )
}
