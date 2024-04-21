export function assetsUrl(value: string) {
  if (!value) return ''

  return `https://firebasestorage.googleapis.com/v0/b/${
    import.meta.env.VITE_STORAGE_BUCKET
  }/o/${value.replace('/', '%2F')}?alt=media`
}
