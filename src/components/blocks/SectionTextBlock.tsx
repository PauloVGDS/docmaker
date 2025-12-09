import { SectionTextBlock as SectionTextBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface SectionTextBlockProps {
  block: SectionTextBlockType
}

export function SectionTextBlock({ block }: SectionTextBlockProps) {
  const { updateBlock } = useDocument()

  const fontSizes = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
  }

  return (
    <div className="py-2">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <select
          value={block.data.level}
          onChange={(e) =>
            updateBlock<SectionTextBlockType>(block.id, {
              level: parseInt(e.target.value) as 1 | 2 | 3,
            })
          }
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <input
          type="text"
          value={block.data.title}
          onChange={(e) =>
            updateBlock<SectionTextBlockType>(block.id, { title: e.target.value })
          }
          className={`flex-1 font-bold bg-transparent border-none outline-none focus:ring-0 ${fontSizes[block.data.level]}`}
          placeholder="Titulo da secao"
        />
      </div>

      {/* Text Content */}
      <textarea
        value={block.data.content}
        onChange={(e) =>
          updateBlock<SectionTextBlockType>(block.id, { content: e.target.value })
        }
        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none focus:ring-0 text-gray-700 leading-relaxed"
        placeholder="Digite o texto aqui..."
      />
    </div>
  )
}
