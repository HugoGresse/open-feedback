export const setFavicon = url => {
    const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
    link.type = 'image/png'
    link.rel = 'shortcut icon'
    link.href = url
    document.getElementsByTagName('head')[0].appendChild(link)
}
