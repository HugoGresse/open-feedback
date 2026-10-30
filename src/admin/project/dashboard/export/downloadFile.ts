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
    // Revoked once the download started, some browsers read the URL async.
    setTimeout(() => URL.revokeObjectURL(url), 0)
}
