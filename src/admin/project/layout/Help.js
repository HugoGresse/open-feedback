import React, { useEffect, useState } from 'react'
import HelpIcon from '@material-ui/icons/HelpOutline'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useTranslation } from 'react-i18next'

const Help = ({ buttonClass }) => {
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState(null)
    const [isSupportOpen, setSupportOpen] = useState(false)

    const getSmallChatTopButton = () => {
        const topButton = document.querySelector('#Smallchat')
        if (topButton) return [topButton]
        return []
    }

    const getSmallChatInnerButton = () => {
        try {
            const button = getSmallChatTopButton()
                .map(node =>
                    node.children[0].contentDocument.querySelector('.Launcher')
                )
                .filter(item => !!item)
            if (button.length > 0) return button
        } catch (error) {
            // ignored
        }
        return []
    }

    useEffect(() => {
        closeSupport()
    }, [])

    const openSupport = () => {
        getSmallChatTopButton().forEach(node => (node.style.display = 'block'))
        getSmallChatInnerButton().forEach(button => button.click())
        setAnchorEl(null)
        setSupportOpen(true)
    }

    const closeSupport = () => {
        getSmallChatTopButton().forEach(node => (node.style.display = 'none'))
        setSupportOpen(false)
    }

    const closeSupportClick = () => {
        closeSupport()
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                className={buttonClass}
                onClick={event => setAnchorEl(event.currentTarget)}>
                <HelpIcon />
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}>
                <MenuItem component={'a'} target="_blank" href="/#faq">
                    {t('layout.faq')}
                </MenuItem>
                {!isSupportOpen && (
                    <MenuItem onClick={() => openSupport()}>
                        {t('layout.support')}
                    </MenuItem>
                )}
                {isSupportOpen && (
                    <MenuItem onClick={() => closeSupportClick()}>
                        {t('layout.closeSupport')}
                    </MenuItem>
                )}
            </Menu>
        </>
    )
}

export default Help
