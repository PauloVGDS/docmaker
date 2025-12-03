declare module 'pdfmake/build/pdfmake' {
  const pdfMake: {
    vfs: Record<string, string>
    createPdf: (docDefinition: import('pdfmake/interfaces').TDocumentDefinitions) => {
      download: (filename?: string) => void
      open: () => void
      print: () => void
      getBlob: (callback: (blob: Blob) => void) => void
      getBase64: (callback: (base64: string) => void) => void
      getBuffer: (callback: (buffer: ArrayBuffer) => void) => void
    }
  }
  export default pdfMake
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfs: {
    vfs: Record<string, string>
  }
  export default vfs
}
