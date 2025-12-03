import { TextBlock as TextBlockType } from '@/types'
import { useDocument } from '@/contexts'

interface TextBlockProps {
  block: TextBlockType
}

export function TextBlock({ block }: TextBlockProps) {
  const { updateBlock } = useDocument()

  return (
    <div className="py-2">
      <textarea
        value={block.data.content}
        onChange={(e) =>
          updateBlock<TextBlockType>(block.id, { content: e.target.value })
        }
        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none focus:ring-0 text-gray-700 leading-relaxed"
        placeholder="Digite o texto aqui..."
      />
    </div>
  )
}
