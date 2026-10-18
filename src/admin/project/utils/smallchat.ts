import { useScript } from '../../../utils/hooks/useScript'

export const useSmallchat = () => useScript(import.meta.env.VITE_SMALL_CHAT)

export const getSmallChatTopButton = (): HTMLElement[] => {
    const topButton = document.querySelector<HTMLElement>('#Smallchat')
    if (topButton) return [topButton]
    return []
}

export const getSmallChatInnerButton = (): HTMLElement[] => {
    try {
        const button = getSmallChatTopButton()
            .map((node) =>
                // The Smallchat widget renders its launcher inside an iframe.
                (
                    node.children[0] as HTMLIFrameElement
                ).contentDocument?.querySelector<HTMLElement>('.Launcher')
            )
            .filter((item): item is HTMLElement => !!item)
        if (button.length > 0) return button
    } catch {
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
