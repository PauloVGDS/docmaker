import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  Footer,
  PageNumber,
  AlignmentType,
  HeadingLevel,
  WidthType,
  BorderStyle,
  convertInchesToTwip,
  NumberFormat,
} from 'docx'
import { Document, Block } from '@/types'

// Configuration
const DOCX_CONFIG = {
  titleFontSize: 32, // Points * 2 (16 * 2)
  textFontSize: 22, // 11 * 2
  imageWidthEmu: 4940303, // 13cm in EMUs
}

interface ImageCounter {
  count: number
}

async function base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

async function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = base64
  })
}

async function convertBlockToDocx(
  block: Block,
  imageCounter: ImageCounter
): Promise<(Paragraph | Table)[]> {
  switch (block.type) {
    case 'cover':
      const coverElements: Paragraph[] = []

      if (block.data.image) {
        const buffer = await base64ToArrayBuffer(block.data.image)
        const dims = await getImageDimensions(block.data.image)
        const aspectRatio = dims.height / dims.width
        const widthEmu = 5500000 // ~15cm
        const heightEmu = Math.round(widthEmu * aspectRatio)

        coverElements.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: buffer,
                transformation: {
                  width: widthEmu / 9525,
                  height: heightEmu / 9525,
                },
                type: 'png',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000, after: 600 },
          })
        )
      }

      coverElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: block.data.title,
              bold: true,
              size: 56,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        })
      )

      // Page break after cover
      coverElements.push(
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        })
      )

      return coverElements

    case 'section':
      const headingLevels = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
      }
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: block.data.title,
              bold: true,
              size: DOCX_CONFIG.titleFontSize,
            }),
          ],
          heading: headingLevels[block.data.level],
          spacing: { before: 300, after: 200 },
        }),
      ]

    case 'image':
      if (!block.data.image) return []

      imageCounter.count++
      const imgBuffer = await base64ToArrayBuffer(block.data.image)
      const imgDims = await getImageDimensions(block.data.image)
      const imgAspectRatio = imgDims.height / imgDims.width
      const imgWidthPx = 491 // 13cm at 96dpi
      const imgHeightPx = Math.round(imgWidthPx * imgAspectRatio)

      return [
        new Paragraph({
          children: [
            new ImageRun({
              data: imgBuffer,
              transformation: {
                width: imgWidthPx,
                height: imgHeightPx,
              },
              type: 'png',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Figura ${imageCounter.count}: ${block.data.description}`,
              italics: true,
              size: DOCX_CONFIG.textFontSize,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
      ]

    case 'table':
      const tableRows = [
        // Header row
        new TableRow({
          children: block.data.headers.map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        bold: true,
                        size: DOCX_CONFIG.textFontSize,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: { fill: 'f3f4f6' },
              })
          ),
        }),
        // Data rows
        ...block.data.rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell,
                            size: DOCX_CONFIG.textFontSize,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  })
              ),
            })
        ),
      ]

      return [
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
        }),
      ]

    case 'list':
      return block.data.items.map(
        (item) =>
          new Paragraph({
            children: [
              new TextRun({
                text: item,
                size: DOCX_CONFIG.textFontSize,
              }),
            ],
            bullet:
              block.data.style === 'bullet'
                ? { level: 0 }
                : undefined,
            numbering:
              block.data.style === 'numbered'
                ? { reference: 'numbered-list', level: 0 }
                : undefined,
          })
      )

    case 'text':
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: block.data.content,
              size: DOCX_CONFIG.textFontSize,
            }),
          ],
          spacing: { before: 100, after: 100, line: 360 },
        }),
      ]

    case 'section-table': {
      const sectionTableHeadingLevels = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
      }
      const sectionTableRows = [
        new TableRow({
          children: block.data.headers.map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        bold: true,
                        size: DOCX_CONFIG.textFontSize,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: { fill: 'f3f4f6' },
              })
          ),
        }),
        ...block.data.rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell,
                            size: DOCX_CONFIG.textFontSize,
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  })
              ),
            })
        ),
      ]

      return [
        new Paragraph({
          children: [
            new TextRun({
              text: block.data.title,
              bold: true,
              size: DOCX_CONFIG.titleFontSize,
            }),
          ],
          heading: sectionTableHeadingLevels[block.data.level],
          spacing: { before: 300, after: 200 },
        }),
        new Table({
          rows: sectionTableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
        }),
      ]
    }

    case 'section-list': {
      const sectionListHeadingLevels = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
      }
      const titleParagraph = new Paragraph({
        children: [
          new TextRun({
            text: block.data.title,
            bold: true,
            size: DOCX_CONFIG.titleFontSize,
          }),
        ],
        heading: sectionListHeadingLevels[block.data.level],
        spacing: { before: 300, after: 200 },
      })

      const listItems = block.data.items.map(
        (item) =>
          new Paragraph({
            children: [
              new TextRun({
                text: item,
                size: DOCX_CONFIG.textFontSize,
              }),
            ],
            bullet:
              block.data.style === 'bullet'
                ? { level: 0 }
                : undefined,
            numbering:
              block.data.style === 'numbered'
                ? { reference: 'numbered-list', level: 0 }
                : undefined,
          })
      )

      return [titleParagraph, ...listItems]
    }

    default:
      return []
  }
}

async function buildDocxContent(blocks: Block[]): Promise<(Paragraph | Table)[]> {
  const imageCounter: ImageCounter = { count: 0 }
  const content: (Paragraph | Table)[] = []

  for (const block of blocks) {
    const elements = await convertBlockToDocx(block, imageCounter)
    content.push(...elements)
  }

  return content
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportToDocx(doc: Document): Promise<void> {
  const content = await buildDocxContent(doc.blocks)

  // Create footer with logo and page number
  const footerChildren: Paragraph[] = []

  if (doc.settings.companyLogo) {
    const logoBuffer = await base64ToArrayBuffer(doc.settings.companyLogo)
    footerChildren.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 450, height: 200 }, // 13cm x 2.5cm
            type: 'png',
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    )
  }

  footerChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          children: [PageNumber.CURRENT],
          size: 20,
        }),
      ],
      alignment: AlignmentType.LEFT,
    })
  )

  const docx = new DocxDocument({
    numbering: {
      config: [
        {
          reference: 'numbered-list',
          levels: [
            {
              level: 0,
              format: NumberFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
            },
          },
        },
        footers: {
          default: new Footer({
            children: footerChildren,
          }),
        },
        children: content,
      },
    ],
  })

  const blob = await Packer.toBlob(docx)
  downloadBlob(blob, `${doc.title}.docx`)
}
