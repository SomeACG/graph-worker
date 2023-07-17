export function getImageMIMEType(file_name: string) {
    const ext = file_name.split('.').pop()
    
    switch (ext) {
        case 'png':
            return 'image/png'
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'webp':
            return 'image/webp'
        default:
            return 'image/png'
    }
}