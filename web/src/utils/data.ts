export function convertMessageToBase64(message: string) {
  const json = JSON.parse(message)
  return window.atob(json.message)
}