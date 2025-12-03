import { SectionBlock as SectionBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface SectionBlockProps {
  block: SectionBlockType
}

export function SectionBlock({ block }: SectionBlockProps) {
  const { updateBlock } = useDocument()

  const fontSizes = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
  }

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-2">
        <select
          value={block.data.level}
          onChange={(e) =>
            updateBlock<SectionBlockType>(block.id, {
              level: parseInt(e.target.value) as 1 | 2 | 3,
            })
          }
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value={1}>H1 - Principal</option>
          <option value={2}>H2 - Secundário</option>
          <option value={3}>H3 - Terciário</option>
        </select>
      </div>
      <input
        type="text"
        value={block.data.title}
        onChange={(e) =>
          updateBlock<SectionBlockType>(block.id, { title: e.target.value })
        }
        className={`w-full font-bold bg-transparent border-none outline-none focus:ring-0 ${fontSizes[block.data.level]}`}
        placeholder="Título da seção"
      />
    </div>
  )
}
