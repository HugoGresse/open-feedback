import React, { useEffect, useState } from 'react'
import HelpIcon from '@material-ui/icons/HelpOutline'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useTranslation } from 'react-i18next'
import { hideSmallChat, openSmallChat } from '../utils/smallchat'

const Help = ({ buttonClass }) => {
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState(null)
    const [isSupportOpen, setSupportOpen] = useState(false)

    useEffect(() => {
        if (isSupportOpen) {
            openSmallChat()
        } else {
            hideSmallChat()
        }
        return () => {
            hideSmallChat()
        }
    }, [isSupportOpen])

    const openSupport = () => {
        setAnchorEl(null)
        setSupportOpen(true)
    }

    const closeSupportClick = () => {
        setSupportOpen(false)
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
