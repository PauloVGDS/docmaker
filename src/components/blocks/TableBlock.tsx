import { Plus, Minus } from 'lucide-react'
import { TableBlock as TableBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface TableBlockProps {
  block: TableBlockType
}

export function TableBlock({ block }: TableBlockProps) {
  const { updateBlock } = useDocument()

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...block.data.headers]
    newHeaders[index] = value
    updateBlock<TableBlockType>(block.id, { headers: newHeaders })
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = block.data.rows.map((row, i) =>
      i === rowIndex
        ? row.map((cell, j) => (j === colIndex ? value : cell))
        : row
    )
    updateBlock<TableBlockType>(block.id, { rows: newRows })
  }

  const addColumn = () => {
    const newHeaders = [...block.data.headers, `Coluna ${block.data.headers.length + 1}`]
    const newRows = block.data.rows.map((row) => [...row, ''])
    updateBlock<TableBlockType>(block.id, { headers: newHeaders, rows: newRows })
  }

  const removeColumn = () => {
    if (block.data.headers.length <= 1) return
    const newHeaders = block.data.headers.slice(0, -1)
    const newRows = block.data.rows.map((row) => row.slice(0, -1))
    updateBlock<TableBlockType>(block.id, { headers: newHeaders, rows: newRows })
  }

  const addRow = () => {
    const newRow = new Array(block.data.headers.length).fill('')
    const newRows = [...block.data.rows, newRow]
    updateBlock<TableBlockType>(block.id, { rows: newRows })
  }

  const removeRow = () => {
    if (block.data.rows.length <= 1) return
    const newRows = block.data.rows.slice(0, -1)
    updateBlock<TableBlockType>(block.id, { rows: newRows })
  }

  return (
    <div className="py-4">
      {/* Controls */}
      <div className="flex gap-4 mb-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Colunas:</span>
          <button
            onClick={removeColumn}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={block.data.headers.length <= 1}
          >
            <Minus size={14} />
          </button>
          <span>{block.data.headers.length}</span>
          <button onClick={addColumn} className="p-1 hover:bg-gray-100 rounded">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Linhas:</span>
          <button
            onClick={removeRow}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={block.data.rows.length <= 1}
          >
            <Minus size={14} />
          </button>
          <span>{block.data.rows.length}</span>
          <button onClick={addRow} className="p-1 hover:bg-gray-100 rounded">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {block.data.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(index, e.target.value)}
                    className="w-full bg-transparent font-bold text-center outline-none focus:ring-0"
                    placeholder={`Coluna ${index + 1}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full bg-transparent text-center outline-none focus:ring-0"
                      placeholder="-"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
