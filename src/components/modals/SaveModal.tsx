import { useState } from 'react'
import { Save, Download, BookTemplate } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { useDocument, useSettings } from '@/contexts'
import { generateId } from '@/utils'
import { Template } from '@/types'

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
}

const STORAGE_KEY_PREFIX = 'docmaker_doc_'

export function SaveModal({ isOpen, onClose }: SaveModalProps) {
  const { document: doc } = useDocument()
  const { addTemplate, addRecentDocument } = useSettings()
  const [templateName, setTemplateName] = useState('')
  const [showTemplateInput, setShowTemplateInput] = useState(false)

  const handleSaveLocal = () => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${doc.id}`
      localStorage.setItem(key, JSON.stringify(doc))

      addRecentDocument({
        id: doc.id,
        title: doc.title,
        updatedAt: doc.updatedAt,
      })

      alert('Documento salvo com sucesso!')
      onClose()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('O documento e muito grande para salvar localmente (limite de armazenamento excedido).\n\nUse "Exportar JSON" para baixar o arquivo e salvar no seu computador.')
      } else {
        throw error
      }
    }
  }

  const handleExportJson = () => {
    const json = JSON.stringify(doc, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = globalThis.document.createElement('a')
    link.href = url
    link.download = `${doc.title}.json`
    globalThis.document.body.appendChild(link)
    link.click()
    globalThis.document.body.removeChild(link)
    URL.revokeObjectURL(url)
    onClose()
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Digite um nome para o template')
      return
    }

    const template: Template = {
      id: generateId(),
      name: templateName,
      description: `Template baseado em "${doc.title}"`,
      blocks: doc.blocks.map((block) => ({
        ...block,
        id: generateId(), // New IDs for template blocks
      })),
      createdAt: new Date().toISOString(),
    }

    addTemplate(template)
    alert('Template salvo com sucesso!')
    setTemplateName('')
    setShowTemplateInput(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salvar Documento"
    >
      <div className="space-y-4">
        <button
          onClick={handleSaveLocal}
          className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <Save size={24} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Salvar Localmente</p>
            <p className="text-sm text-gray-500">
              Salva no navegador para continuar depois
            </p>
          </div>
        </button>

        <button
          onClick={handleExportJson}
          className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <Download size={24} className="text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Exportar JSON</p>
            <p className="text-sm text-gray-500">
              Baixa o arquivo para backup ou transferência
            </p>
          </div>
        </button>

        <div className="border-t pt-4">
          {!showTemplateInput ? (
            <button
              onClick={() => setShowTemplateInput(true)}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookTemplate size={24} className="text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Salvar como Template</p>
                <p className="text-sm text-gray-500">
                  Reutilize esta estrutura em novos documentos
                </p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              <Input
                label="Nome do Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Manual de Montagem"
              />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowTemplateInput(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Salvar Template
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
