export function saveJsonFile(fileName: string, data: object): void {
  const a = document.createElement('a')
  document.body.appendChild(a)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
