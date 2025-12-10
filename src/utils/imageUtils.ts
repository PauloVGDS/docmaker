export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export async function loadDefaultImage(name: 'cover' | 'footer'): Promise<string> {
  const filename = name === 'cover' ? 'blipsPage.jpg' : 'blipsFooter.png'
  const response = await fetch(`/images/${filename}`)
  const blob = await response.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export function compressImage(
  base64: string,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      // Se a imagem ja esta dentro do limite, manter original
      if (img.width <= maxWidth) {
        resolve(base64)
        return
      }

      const canvas = document.createElement('canvas')
      const height = (img.height * maxWidth) / img.width

      canvas.width = maxWidth
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, maxWidth, height)
      ctx.drawImage(img, 0, 0, maxWidth, height)

      // Preservar PNG para manter transparencia
      const isPng = base64.startsWith('data:image/png')
      if (isPng) {
        resolve(canvas.toDataURL('image/png'))
      } else {
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
    }
    img.src = base64
  })
}
