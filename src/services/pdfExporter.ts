import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Document, Block } from '@/types'

// Initialize pdfmake with fonts
pdfMake.vfs = pdfFonts.vfs

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

// Configuration based on requirements
const PDF_CONFIG = {
  titleFontSize: 16,
  textFontSize: 11,
  imageWidthPt: 368.5, // 13cm in points (1cm = 28.35pt)
  descriptionFontSize: 11,
  margins: {
    top: 40,
    bottom: 80, // More space for footer
    left: 40,
    right: 40,
  },
}

interface ImageCounter {
  count: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertBlockToPdf(block: Block, imageCounter: ImageCounter, pageSize: string): any[] {
  const pageWidth = pageSize === 'A4' ? A4_WIDTH : 612 // Letter width
  const pageHeight = pageSize === 'A4' ? A4_HEIGHT : 792 // Letter height

  switch (block.type) {
    case 'cover': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coverContent: any[] = []

      if (block.data.image) {
        // Imagem preenchendo toda a pagina
        coverContent.push({
          image: block.data.image,
          width: pageWidth,
          height: pageHeight,
          absolutePosition: { x: 0, y: 0 },
        })
      }

      // Titulo na parte inferior da pagina
      coverContent.push({
        text: block.data.title,
        fontSize: 24,
        bold: true,
        alignment: 'center',
        color: 'black',
        absolutePosition: { x: 0, y: pageHeight - 120 }, // Proximo ao final da pagina
        width: pageWidth,
      })

      // Page break after cover
      coverContent.push({
        text: '',
        pageBreak: 'after',
      })

      return coverContent
    }

    case 'section': {
      const sectionSizes = { 1: 16, 2: 14, 3: 12 }
      return [{
        text: block.data.title,
        fontSize: sectionSizes[block.data.level] || PDF_CONFIG.titleFontSize,
        bold: true,
        margin: [0, 15, 0, 10],
      }]
    }

    case 'image':
      if (!block.data.image) return []

      imageCounter.count++
      return [
        {
          image: block.data.image,
          fit: [PDF_CONFIG.imageWidthPt, 600],
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
        {
          text: `Figura ${imageCounter.count}: ${block.data.description}`,
          fontSize: PDF_CONFIG.descriptionFontSize,
          italics: true,
          alignment: 'center',
          margin: [0, 5, 0, 15],
        },
      ]

    case 'table':
      return [{
        table: {
          headerRows: 1,
          widths: Array(block.data.headers.length).fill('*'),
          body: [
            block.data.headers.map((h) => ({
              text: h,
              bold: true,
              fontSize: PDF_CONFIG.textFontSize,
              fillColor: '#fcc603',
            })),
            ...block.data.rows.map((row) =>
              row.map((cell) => ({
                text: cell,
                fontSize: PDF_CONFIG.textFontSize,
              }))
            ),
          ],
        },
        margin: [0, 10, 0, 15],
      }]

    case 'list': {
      const listContent = block.data.items.map((item) => ({
        text: item,
        fontSize: PDF_CONFIG.textFontSize,
      }))

      if (block.data.style === 'numbered') {
        return [{
          ol: listContent,
          margin: [0, 5, 0, 10],
        }]
      } else {
        return [{
          ul: listContent,
          margin: [0, 5, 0, 10],
        }]
      }
    }

    case 'text':
      return [{
        text: block.data.content,
        fontSize: PDF_CONFIG.textFontSize,
        margin: [0, 5, 0, 5],
        lineHeight: 1.4,
      }]

    case 'section-table': {
      const sectionTableSizes = { 1: 16, 2: 14, 3: 12 }
      return [
        {
          text: block.data.title,
          fontSize: sectionTableSizes[block.data.level] || PDF_CONFIG.titleFontSize,
          bold: true,
          margin: [0, 15, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: Array(block.data.headers.length).fill('*'),
            body: [
              block.data.headers.map((h) => ({
                text: h,
                bold: true,
                fontSize: PDF_CONFIG.textFontSize,
                fillColor: '#fcc603',
              })),
              ...block.data.rows.map((row) =>
                row.map((cell) => ({
                  text: cell,
                  fontSize: PDF_CONFIG.textFontSize,
                }))
              ),
            ],
          },
          margin: [0, 0, 0, 15],
        },
      ]
    }

    case 'section-list': {
      const sectionListSizes = { 1: 16, 2: 14, 3: 12 }
      const listContent = block.data.items.map((item) => ({
        text: item,
        fontSize: PDF_CONFIG.textFontSize,
      }))

      const listElement = block.data.style === 'numbered'
        ? { ol: listContent, margin: [0, 0, 0, 10] }
        : { ul: listContent, margin: [0, 0, 0, 10] }

      return [
        {
          text: block.data.title,
          fontSize: sectionListSizes[block.data.level] || PDF_CONFIG.titleFontSize,
          bold: true,
          margin: [0, 15, 0, 10],
        },
        listElement,
      ]
    }

    case 'section-text': {
      const sectionTextSizes = { 1: 16, 2: 14, 3: 12 }
      return [
        {
          text: block.data.title,
          fontSize: sectionTextSizes[block.data.level] || PDF_CONFIG.titleFontSize,
          bold: true,
          margin: [0, 15, 0, 10],
        },
        {
          text: block.data.content,
          fontSize: PDF_CONFIG.textFontSize,
          margin: [0, 0, 0, 10],
          lineHeight: 1.4,
        },
      ]
    }

    case 'section-image': {
      const sectionImageSizes = { 1: 16, 2: 14, 3: 12 }
      if (!block.data.image) {
        return [
          {
            text: block.data.title,
            fontSize: sectionImageSizes[block.data.level] || PDF_CONFIG.titleFontSize,
            bold: true,
            margin: [0, 15, 0, 10],
          },
        ]
      }

      imageCounter.count++
      return [
        {
          stack: [
            {
              text: block.data.title,
              fontSize: sectionImageSizes[block.data.level] || PDF_CONFIG.titleFontSize,
              bold: true,
              margin: [0, 15, 0, 10],
            },
            {
              image: block.data.image,
              fit: [PDF_CONFIG.imageWidthPt, 600],
              alignment: 'center',
              margin: [0, 0, 0, 0],
            },
            {
              text: `Figura ${imageCounter.count}: ${block.data.description}`,
              fontSize: PDF_CONFIG.descriptionFontSize,
              italics: true,
              alignment: 'center',
              margin: [0, 5, 0, 15],
            },
          ],
          unbreakable: true,
        },
      ]
    }

    case 'cover-detailed': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coverDetailedContent: any[] = []

      if (block.data.image) {
        // Imagem preenchendo toda a pagina
        coverDetailedContent.push({
          image: block.data.image,
          width: pageWidth,
          height: pageHeight,
          absolutePosition: { x: 0, y: 0 },
        })
      }

      // Titulo centralizado na parte inferior
      coverDetailedContent.push({
        text: block.data.title,
        fontSize: 24,
        bold: true,
        alignment: 'center',
        color: 'black',
        absolutePosition: { x: 0, y: pageHeight - 180 },
        width: pageWidth,
      })

      // Campos adicionais alinhados a esquerda
      const detailsY = pageHeight - 140
      const leftMargin = 60

      if (block.data.machineName) {
        coverDetailedContent.push({
          text: `Máquina: ${block.data.machineName}`,
          fontSize: 14,
          color: 'black',
          absolutePosition: { x: leftMargin, y: detailsY },
        })
      }

      if (block.data.responsibleName) {
        coverDetailedContent.push({
          text: `Responsável: ${block.data.responsibleName}`,
          fontSize: 14,
          color: 'black',
          absolutePosition: { x: leftMargin, y: detailsY + 20 },
        })
      }

      if (block.data.date) {
        coverDetailedContent.push({
          text: `Data: ${block.data.date}`,
          fontSize: 14,
          color: 'black',
          absolutePosition: { x: leftMargin, y: detailsY + 40 },
        })
      }

      // Page break after cover
      coverDetailedContent.push({
        text: '',
        pageBreak: 'after',
      })

      return coverDetailedContent
    }

    default:
      return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPdfContent(blocks: Block[], pageSize: string): any[] {
  const imageCounter: ImageCounter = { count: 0 }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any[] = []

  blocks.forEach((block) => {
    const blockContent = convertBlockToPdf(block, imageCounter, pageSize)
    content.push(...blockContent)
  })

  return content
}

export async function exportToPdf(doc: Document): Promise<void> {
  const hasCover = doc.blocks.length > 0 && (doc.blocks[0].type === 'cover' || doc.blocks[0].type === 'cover-detailed')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docDefinition: any = {
    pageSize: doc.settings.pageSize,
    pageMargins: [
      PDF_CONFIG.margins.left,
      PDF_CONFIG.margins.top,
      PDF_CONFIG.margins.right,
      PDF_CONFIG.margins.bottom,
    ],

    footer: (currentPage: number) => {
      // No footer on cover page
      if (hasCover && currentPage === 1) return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const footerStack: any[] = []

      // Logo centralizada - 13cm largura x 2.5cm altura
      if (doc.settings.companyLogo) {
        footerStack.push({
          image: doc.settings.companyLogo,
          width: 369, // 13cm em points
          height: 90, // 2.5cm em points
          alignment: 'center',
          margin: [0, 0, 0, 5],
        })
      }

      // Numero da pagina a esquerda
      footerStack.push({
        text: currentPage.toString(),
        alignment: 'left',
        fontSize: 10,
        margin: [PDF_CONFIG.margins.left, 0, 0, 0],
      })

      return {
        stack: footerStack,
        margin: [0, 5, 0, 0],
      }
    },

    content: buildPdfContent(doc.blocks, doc.settings.pageSize),

    defaultStyle: {
      font: 'Roboto',
    },
  }

  pdfMake.createPdf(docDefinition).download(`${doc.title}.pdf`)
}
