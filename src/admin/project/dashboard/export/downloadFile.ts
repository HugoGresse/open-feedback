const REVOKE_DELAY_MS = 40_000

// Hands a generated file to the browser, which saves it under `fileName`.
export const downloadFile = (
    fileName: string,
    content: string,
    type: string
): void => {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Safari reads the URL only once the user accepted the download: revoke it
    // later, as FileSaver.js does.
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS)
}
