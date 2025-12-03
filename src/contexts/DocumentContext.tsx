import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Document, Block, BlockType, DEFAULT_DOCUMENT_SETTINGS } from '@/types'
import { generateId, createBlock } from '@/utils'

interface DocumentContextType {
  document: Document
  setDocument: (doc: Document) => void
  addBlock: (type: BlockType, position?: number) => void
  updateBlock: <T extends Block>(id: string, data: Partial<T['data']>) => void
  deleteBlock: (id: string) => void
  moveBlock: (activeId: string, overId: string) => void
  updateTitle: (title: string) => void
  updateSettings: (settings: Partial<Document['settings']>) => void
  resetDocument: () => void
}

const DocumentContext = createContext<DocumentContextType | null>(null)

function createNewDocument(): Document {
  return {
    id: generateId(),
    title: 'Novo Documento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: DEFAULT_DOCUMENT_SETTINGS,
    blocks: [],
  }
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [document, setDocumentState] = useState<Document>(createNewDocument)

  const setDocument = useCallback((doc: Document) => {
    setDocumentState(doc)
  }, [])

  const addBlock = useCallback((type: BlockType, position?: number) => {
    const newBlock = createBlock(type)
    setDocumentState((prev) => {
      const blocks = [...prev.blocks]
      if (position !== undefined) {
        blocks.splice(position, 0, newBlock)
      } else {
        blocks.push(newBlock)
      }
      return {
        ...prev,
        blocks,
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const updateBlock = useCallback(<T extends Block>(id: string, data: Partial<T['data']>) => {
    setDocumentState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === id
          ? { ...block, data: { ...block.data, ...data } }
          : block
      ) as Block[],
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setDocumentState((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const moveBlock = useCallback((activeId: string, overId: string) => {
    setDocumentState((prev) => {
      const oldIndex = prev.blocks.findIndex((b) => b.id === activeId)
      const newIndex = prev.blocks.findIndex((b) => b.id === overId)

      if (oldIndex === -1 || newIndex === -1) return prev

      const blocks = [...prev.blocks]
      const [movedBlock] = blocks.splice(oldIndex, 1)
      blocks.splice(newIndex, 0, movedBlock)

      return {
        ...prev,
        blocks,
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const updateTitle = useCallback((title: string) => {
    setDocumentState((prev) => ({
      ...prev,
      title,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const updateSettings = useCallback((settings: Partial<Document['settings']>) => {
    setDocumentState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const resetDocument = useCallback(() => {
    setDocumentState(createNewDocument())
  }, [])

  return (
    <DocumentContext.Provider
      value={{
        document,
        setDocument,
        addBlock,
        updateBlock,
        deleteBlock,
        moveBlock,
        updateTitle,
        updateSettings,
        resetDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}
