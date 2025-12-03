import { useRef } from 'react'
import { Upload, FileText, BookTemplate, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui'
import { useDocument, useSettings } from '@/contexts'
import { Document, Template } from '@/types'
import { generateId } from '@/utils'

interface LoadModalProps {
  isOpen: boolean
  onClose: () => void
}

const STORAGE_KEY_PREFIX = 'docmaker_doc_'

export function LoadModal({ isOpen, onClose }: LoadModalProps) {
  const { setDocument } = useDocument()
  const { settings, removeRecentDocument, removeTemplate } = useSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLoadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const doc = JSON.parse(event.target?.result as string) as Document
        setDocument(doc)
        onClose()
      } catch {
        alert('Arquivo inválido. Por favor, selecione um arquivo JSON válido.')
      }
    }
    reader.readAsText(file)
  }

  const handleLoadRecent = (id: string) => {
    const key = `${STORAGE_KEY_PREFIX}${id}`
    const stored = localStorage.getItem(key)
    if (stored) {
      const doc = JSON.parse(stored) as Document
      setDocument(doc)
      onClose()
    } else {
      alert('Documento não encontrado no armazenamento local.')
      removeRecentDocument(id)
    }
  }

  const handleLoadTemplate = (template: Template) => {
    const newDoc: Document = {
      id: generateId(),
      title: `Novo - ${template.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        companyLogo: null,
        pageSize: 'A4',
      },
      blocks: template.blocks.map((block) => ({
        ...block,
        id: generateId(),
      })),
    }
    setDocument(newDoc)
    onClose()
  }

  const handleDeleteRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const key = `${STORAGE_KEY_PREFIX}${id}`
    localStorage.removeItem(key)
    removeRecentDocument(id)
  }

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Tem certeza que deseja excluir este template?')) {
      removeTemplate(id)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Abrir Documento"
    >
      <div className="space-y-4">
        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <Upload size={24} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Importar Arquivo</p>
            <p className="text-sm text-gray-500">
              Abrir arquivo JSON do computador
            </p>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadJson}
          className="hidden"
        />

        {/* Recent Documents */}
        {settings.recentDocuments.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={16} />
              Documentos Recentes
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {settings.recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleLoadRecent(doc.id)}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteRecent(doc.id, e)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates */}
        {settings.templates.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BookTemplate size={16} />
              Templates
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {settings.templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleLoadTemplate(template)}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {settings.recentDocuments.length === 0 && settings.templates.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhum documento ou template salvo ainda.
          </p>
        )}
      </div>
    </Modal>
  )
}
