import { useScript } from '../../../utils/hooks/useScript'

export const useSmallchat = () => useScript(import.meta.env.VITE_SMALL_CHAT)

export const getSmallChatTopButton = () => {
    const topButton = document.querySelector('#Smallchat')
    if (topButton) return [topButton]
    return []
}

export const getSmallChatInnerButton = () => {
    try {
        const button = getSmallChatTopButton()
            .map((node) =>
                node.children[0].contentDocument.querySelector('.Launcher')
            )
            .filter((item) => !!item)
        if (button.length > 0) return button
    } catch (error) {
        // ignored
    }
    return []
}

export const hideSmallChat = () => {
    getSmallChatTopButton().forEach(
        (node) => (node.style.visibility = 'hidden')
    )
}

export const showSmallChat = () => {
    getSmallChatTopButton().forEach(
        (node) => (node.style.visibility = 'visible')
    )
}

export const openSmallChat = () => {
    getSmallChatTopButton().forEach(
        (node) => (node.style.visibility = 'visible')
    )
    getSmallChatInnerButton().forEach((button) => button.click())
}
