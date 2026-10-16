/**
 * Prepara una imagen en el navegador antes de subirla: la reduce para que su lado
 * mayor no pase de `maxSide` y la convierte a WebP (conserva la transparencia de los
 * PNG recortados). Si el navegador no sabe codificar WebP, se usa PNG.
 */
export async function toWebp(file: File, maxSide: number, quality = 0.86): Promise<Blob> {
    if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
    const bitmap = await createImageBitmap(file).catch(() => {
        throw new Error('No se pudo leer la imagen. Prueba con un PNG, JPG o WebP.')
    })
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('El navegador no permite procesar imágenes.')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
    const webp = await encode('image/webp')
    if (webp && webp.type === 'image/webp') return webp
    const png = await encode('image/png')
    if (!png) throw new Error('No se pudo convertir la imagen.')
    return png
}
